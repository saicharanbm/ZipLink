import client from "@repo/db/client";
import "dotenv/config";
import Redis from "ioredis";

const redisUrl = process.env.UPSTASH_REDIS_URL;
if (!redisUrl) {
  throw new Error("UPSTASH_REDIS_URL is not defined");
}
export const redisClient = new Redis(redisUrl);

const BATCH_SIZE = 1000;
const WORKER_INTERVAL = 60 * 60 * 1000;
const VISIT_QUEUE_KEY = "visit_queue";

// Function to process a batch of visits
async function processVisitsBatch() {
  try {
    // Fetch up to BATCH_SIZE visits from Redis
    const batch = await redisClient.lrange(VISIT_QUEUE_KEY, 0, BATCH_SIZE - 1);
    if (batch.length === 0) {
      console.log("No visits to process.");
      return;
    }

    console.log(`Processing ${batch.length} visits...`);

    // Parse the visits data
    const visits = batch.map((visit) => JSON.parse(visit));

    // Bulk insert the visits into the database
    await client.visit.createMany({ data: visits });

    // Remove processed items from Redis to avoide multiple inserts
    await redisClient.ltrim(VISIT_QUEUE_KEY, batch.length, -1);

    console.log(`Successfully processed ${batch.length} visits.`);
  } catch (error) {
    console.error("Error processing visits:", error);
  }
}

// Function to wait for either 1000 visits or 1 hour
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

    // Check Redis queue length periodically
    const interval = setInterval(async () => {
      const queueLength = await redisClient.llen(VISIT_QUEUE_KEY);
      console.log(`Queue length: ${queueLength}`);

      if (queueLength >= BATCH_SIZE && !resolved) {
        resolved = true;
        console.log("Queue length threshold reached. Triggering processing...");
        clearTimeout(timer);
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  });
}

async function startWorker() {
  console.log("Worker started...");

  while (true) {
    // waits for an hour or till we get 1000 visits
    await waitForThreshold();
    await processVisitsBatch();
  }
}

// Start the worker
async function main() {
  try {
    await startWorker();
  } catch (error) {
    console.error("Error starting worker:", error);
    process.exit(1);
  }
}

main();
