import client from "@repo/db/client";
import "dotenv/config";
import Redis from "ioredis";

// Load Redis URL from environment variables
const redisUrl = process.env.UPSTASH_REDIS_URL;

if (!redisUrl) {
  throw new Error("UPSTASH_REDIS_URL is not defined");
}

console.log("Connecting to Redis:", redisUrl);

export const redisClient = new Redis(redisUrl, {
  tls: {
    rejectUnauthorized: false, // Handle TLS verification issues
  },
  retryStrategy: (times) => {
    if (times > 5) {
      console.error("Redis connection failed after multiple retries.");
      return null; // Stop retrying after 5 attempts
    }
    console.log(`Redis retry attempt: ${times}`);
    return Math.min(times * 100, 3000); // Exponential backoff
  },
  reconnectOnError: (err) => {
    console.error("Redis encountered an error:", err.message);
    return true; // Try reconnecting
  },
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// Constants
const STREAM_NAME = "visit_stream";
const CONSUMER_GROUP = "visit_group";
const CONSUMER_NAME = `worker-${Math.random().toString(36).substring(7)}`;
const BATCH_SIZE = 1;
const WORKER_INTERVAL = 60 * 60 * 1000; // 1 hour

// Ensure the Redis Stream and Consumer Group Exist
async function setupStream() {
  try {
    await redisClient.xgroup(
      "CREATE",
      STREAM_NAME,
      CONSUMER_GROUP,
      "$",
      "MKSTREAM"
    );
    console.log("Consumer group created.");
  } catch (error) {
    if ((error as Error).message.includes("BUSYGROUP")) {
      console.log("Consumer group already exists.");
    } else {
      console.error("Error creating consumer group:", error);
    }
  }
}

// Function to Process a Batch of Visits from Redis Stream
async function processVisitsBatch() {
  try {
    console.log("Checking Redis Stream for new events...");

    // Read up to BATCH_SIZE events from the stream
    const entries = await redisClient.xreadgroup(
      "GROUP",
      CONSUMER_GROUP,
      CONSUMER_NAME,
      "COUNT",
      BATCH_SIZE,
      "BLOCK",
      60000, // Wait up to 60 seconds for new messages
      "STREAMS",
      STREAM_NAME,
      ">"
    );

    if (!entries || entries.length === 0) {
      console.log("No new visits to process.");
      return;
    }

    // Extract messages
    const visits = [];
    const messageIds = [];

    for (const [, messages] of entries) {
      for (const [id, fields] of messages) {
        messageIds.push(id);
        visits.push(JSON.parse(fields[1])); // Assuming only one field
      }
    }

    console.log(`Processing ${visits.length} visits...`);
    await client.visit.createMany({ data: visits });

    // Acknowledge messages after processing
    for (const id of messageIds) {
      await redisClient.xack(STREAM_NAME, CONSUMER_GROUP, id);
    }

    console.log(`Successfully processed ${visits.length} visits.`);
  } catch (error) {
    console.error("Error processing visits:", error);
  }
}

// Function to Wait for Either 1000 Visits or 1 Hour
async function waitForThreshold() {
  return new Promise<void>((resolve) => {
    let resolved = false;

    // Timeout for 1 hour
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.log("1 hour elapsed. Triggering processing...");
        resolve();
      }
    }, WORKER_INTERVAL);

    // Stream polling every 60 seconds to check message count
    const interval = setInterval(async () => {
      try {
        const info = await redisClient.xlen(STREAM_NAME);
        console.log(`Stream message count: ${info}`);

        if (info >= BATCH_SIZE && !resolved) {
          resolved = true;
          console.log("Batch threshold reached. Triggering processing...");
          clearTimeout(timer);
          clearInterval(interval);
          resolve();
        }
      } catch (err) {
        console.error("Error checking Redis Stream length:", err);
        clearInterval(interval);
        clearTimeout(timer);
        resolve();
      }
    }, 60000);
  });
}

// Worker Loop to Continuously Process Messages
async function startWorker() {
  console.log(`Worker ${CONSUMER_NAME} started...`);

  while (true) {
    try {
      await waitForThreshold(); // Waits for 1000 visits or 1 hour
      await processVisitsBatch();
    } catch (error) {
      console.error("Error in worker loop:", error);
    }
  }
}

// Initialize and Start the Worker
async function main() {
  try {
    await setupStream();
    await startWorker();
  } catch (error) {
    console.error("Error starting worker:", error);
    process.exit(1);
  }
}

main();
