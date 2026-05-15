import { Queue } from 'bullmq';
import { redisConnection } from './redis.js';

export const SCAN_QUEUE_NAME = 'vulnerability-scans';

let internalQueue: any;

try {
  internalQueue = new Queue(SCAN_QUEUE_NAME, {
    connection: redisConnection,
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: false,
    }
  });
  
  // Basic check to see if Redis is actually alive
  redisConnection.ping().catch(() => {
    console.warn('Redis is not responding. Queue might hang.');
  });
} catch (err) {
  console.warn('Failed to initialize BullMQ. Falling back to mock queue.');
  internalQueue = {
    add: async (name: string, data: any) => {
      console.log(`[MockQueue] Adding job ${name}`, data);
      // In a real mock, we would trigger the worker here
      return { id: 'mock-job-' + Date.now(), data };
    },
    on: () => {},
  };
}

export const scanQueue = internalQueue;
