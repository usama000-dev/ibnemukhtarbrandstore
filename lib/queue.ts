import { Queue } from 'bullmq';
import Redis from 'ioredis';

// Redis connection
const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

// Email Queue
export const emailQueue = new Queue('email-queue', {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: {
            age: 24 * 3600, // Keep completed jobs for 24 hours
            count: 1000,
        },
        removeOnFail: {
            age: 7 * 24 * 3600, // Keep failed jobs for 7 days
        },
    },
});

// Job Types
export interface SendCampaignJob {
    campaignId: string;
    type: 'flash-sale' | 'deal' | 'newsletter' | 'product-update' | 'welcome';
}

export interface SendSingleEmailJob {
    to: string;
    subject: string;
    html: string;
    text: string;
    campaignId?: string;
    subscriberId?: string;
}

// Helper function to add campaign to queue
export async function queueCampaign(campaignId: string, type: SendCampaignJob['type']) {
    const job = await emailQueue.add('send-campaign', {
        campaignId,
        type,
    } as SendCampaignJob);

    return job;
}

// Helper function to add single email to queue
export async function queueEmail(emailData: SendSingleEmailJob) {
    const job = await emailQueue.add('send-email', emailData);
    return job;
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    await emailQueue.close();
    await connection.quit();
});
