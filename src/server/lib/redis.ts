import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  lazyConnect: true,
  retryStrategy(times) {
    if (times > 3) {
      return null; // Stop retrying after 3 attempts
    }
    return Math.min(times * 100, 2000);
  }
});

redisConnection.on('error', (err) => {
  // Only log once to avoid spam
  if (redisConnection.status !== 'end') {
    console.warn('Redis is unavailable. Queue will operate in mock mode.');
    redisConnection.disconnect();
  }
});
