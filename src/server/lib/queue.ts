import { Queue } from 'bullmq';
import { redisConnection } from './redis.js';

export const SCAN_QUEUE_NAME = 'vulnerability-scans';

let internalQueue: any;
let isMock = false;

// We'll store a callback to run the scan directly in mock mode
let mockProcessor: ((data: any) => Promise<void>) | null = null;

export const registerMockProcessor = (processor: (data: any) => Promise<void>) => {
  mockProcessor = processor;
};

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
    console.warn('Redis is not responding. Queue will use local fallback.');
    isMock = true;
  });
} catch (err) {
  console.warn('Failed to initialize BullMQ. Falling back to mock queue.');
  isMock = true;
}

// Wrap the queue to handle mock mode
export const scanQueue = {
  add: async (name: string, data: any) => {
    if (isMock || !internalQueue) {
      console.log(`[MockQueue] Adding job ${name}`, data);
      const jobId = 'mock-job-' + Date.now();
      
      // If we have a processor registered, run it asynchronously
      if (mockProcessor) {
        setTimeout(() => {
          mockProcessor!(data, jobId).catch(err => console.error('Mock processor failed:', err));
        }, 100);
      } else {
        console.warn('No mock processor registered. Job will not be processed.');
      }
      
      return { id: jobId, data };
    }

    try {
      return await internalQueue.add(name, data);
    } catch (err) {
      console.warn('BullMQ add failed, falling back to mock:', err);
      isMock = true;
      return scanQueue.add(name, data); // Retry with mock
    }
  }
};
