import { Queue } from 'bullmq';
import { redisConnection } from './redis.js';

export const SCAN_QUEUE_NAME = 'vulnerability-scans';

export const scanQueue = new Queue(SCAN_QUEUE_NAME, {
  connection: redisConnection,
});
