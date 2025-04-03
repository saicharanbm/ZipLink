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
const BATCH_SIZE = 10;
const WORKER_INTERVAL = 60 * 60 * 1000; // 1 hour
const CHECK_INTERVAL = 60000; // Check every minute

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

// Process visits from Redis Stream
async function processVisits() {
  let processedCount = 0;
  let shouldContinue = true;

  while (shouldContinue) {
    try {
      console.log("Processing batch of visits...");

      // Read up to BATCH_SIZE events from the stream with a short timeout
      const entries = await redisClient.xreadgroup(
        "GROUP",
        CONSUMER_GROUP,
        CONSUMER_NAME,
        "COUNT",
        BATCH_SIZE,
        "BLOCK",
        5000, // Short 5-second timeout for immediate processing
        "STREAMS",
        STREAM_NAME,
        ">"
      );

      if (!entries || entries.length === 0 || entries[0][1].length === 0) {
        console.log("No more visits to process at this time.");
        shouldContinue = false;
        continue;
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

      if (visits.length > 0) {
        await client.visit.createMany({ data: visits });
        processedCount += visits.length;

        // Acknowledge messages after processing
        for (const id of messageIds) {
          await redisClient.xack(STREAM_NAME, CONSUMER_GROUP, id);
        }

        console.log(`Successfully processed ${visits.length} visits.`);

        // Check if we should continue processing more batches immediately
        const pendingCount = await redisClient.xlen(STREAM_NAME);
        shouldContinue = pendingCount >= BATCH_SIZE;

        if (shouldContinue) {
          console.log(
            `Still have ${pendingCount} messages in stream. Processing another batch...`
          );
        }
      } else {
        shouldContinue = false;
      }
    } catch (error) {
      console.error("Error processing visits:", error);
      shouldContinue = false;
    }
  }

  return processedCount;
}

// Wait for either BATCH_SIZE visits or WORKER_INTERVAL time
async function waitForProcessingCondition() {
  return new Promise<void>((resolve) => {
    let resolved = false;

    // Set up our hourly timeout
    const hourlyTimer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.log("1 hour elapsed. Triggering processing...");
        resolve();
      }
    }, WORKER_INTERVAL);

    // Check periodically for BATCH_SIZE threshold
    const interval = setInterval(async () => {
      try {
        const count = await redisClient.xlen(STREAM_NAME);

        if (count > 0) {
          console.log(`Stream has ${count}/${BATCH_SIZE} messages.`);
        }

        if (count >= BATCH_SIZE && !resolved) {
          clearTimeout(hourlyTimer);
          clearInterval(interval);
          resolved = true;
          console.log(
            `Batch threshold reached (${count} >= ${BATCH_SIZE}). Triggering processing...`
          );
          resolve();
        }
      } catch (err) {
        console.error("Error checking Redis Stream length:", err);
        if (!resolved) {
          clearTimeout(hourlyTimer);
          clearInterval(interval);
          resolved = true;
          resolve();
        }
      }
    }, CHECK_INTERVAL);
  });
}

// Worker loop
async function startWorker() {
  console.log(`Worker ${CONSUMER_NAME} started...`);

  while (true) {
    try {
      // Wait until we hit our processing condition
      await waitForProcessingCondition();

      // Process all available messages in batches
      const totalProcessed = await processVisits();

      if (totalProcessed > 0) {
        console.log(`Worker processed a total of ${totalProcessed} visits.`);
      } else {
        console.log("No visits were processed in this cycle.");
      }
    } catch (error) {
      console.error("Error in worker loop:", error);
      // Small delay before retrying after an error
      await new Promise((r) => setTimeout(r, 5000));
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
