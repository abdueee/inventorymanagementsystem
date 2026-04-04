import Redis from "ioredis";

const CHANNEL = "inventory-updated";

const globalForRedis = globalThis as unknown as {
  redisPublisher: Redis;
};

// Singleton publisher — used by server actions to publish events
if (!globalForRedis.redisPublisher) {
  globalForRedis.redisPublisher = new Redis(process.env.REDIS_URL!);
}

export const publisher = globalForRedis.redisPublisher;

// Each SSE connection creates its own subscriber instance.
// Redis requires a dedicated connection per subscriber (can't share with publisher).
export function createSubscriber() {
  return new Redis(process.env.REDIS_URL!);
}

export { CHANNEL };

// Convenience function called by server actions
export async function emitInventoryUpdate() {
  await publisher.publish(CHANNEL, "inventory-updated");
}
