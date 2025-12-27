import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { EmailService } from '@/services/emailService';
import { EmailCampaign } from '@/models/EmailCampaign';
import { EmailSubscriber } from '@/models/EmailSubscriber';
import { connectDb } from '@/utils/mongodb';
import type { SendCampaignJob, SendSingleEmailJob } from '@/lib/queue';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Redis connection
const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

// Email Worker
const emailWorker = new Worker(
    'email-queue',
    async (job: Job) => {
        await connectDb();

        if (job.name === 'send-campaign') {
            return await processCampaign(job.data as SendCampaignJob);
        } else if (job.name === 'send-email') {
            return await processSingleEmail(job.data as SendSingleEmailJob);
        }
    },
    {
        connection,
        concurrency: 5, // Process 5 jobs concurrently
        limiter: {
            max: 10, // Max 10 jobs
            duration: 1000, // per second
        },
    }
);

// Process campaign sending
async function processCampaign(data: SendCampaignJob) {
    const { campaignId, type } = data;

    console.log(`[Worker] Processing campaign: ${campaignId}, type: ${type}`);

    // Get campaign
    const campaign = await EmailCampaign.findById(campaignId);
    if (!campaign) {
        throw new Error(`Campaign ${campaignId} not found`);
    }

    // Update status to sending
    campaign.status = 'sending';
    campaign.sentAt = new Date();
    await campaign.save();

    try {
        // Get subscribers based on campaign preferences
        const subscribers = await EmailSubscriber.find({
            isActive: true,
            [`preferences.${type === 'flash-sale' ? 'flashSales' : type === 'deal' ? 'deals' : 'newsletters'}`]: true,
        });

        console.log(`[Worker] Found ${subscribers.length} subscribers for campaign ${campaignId}`);

        let sent = 0;
        let failed = 0;

        // Send emails in batches
        for (const subscriber of subscribers) {
            try {
                // Here you would use your EmailService to send
                // For now, we'll simulate sending
                await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay

                // Update subscriber stats
                subscriber.totalEmailsSent = (subscriber.totalEmailsSent || 0) + 1;
                subscriber.lastEmailSent = new Date();
                subscriber.lastCampaignType[type] = new Date();
                await subscriber.save();

                sent++;
            } catch (error) {
                console.error(`[Worker] Failed to send to ${subscriber.email}:`, error);
                failed++;
            }
        }

        // Update campaign analytics
        campaign.analytics.emailsSent = sent;
        campaign.analytics.totalSubscribers = subscribers.length;
        campaign.status = 'sent';
        campaign.completedAt = new Date();
        await campaign.save();

        console.log(`[Worker] Campaign ${campaignId} completed. Sent: ${sent}, Failed: ${failed}`);

        return { sent, failed, total: subscribers.length };
    } catch (error) {
        // Update campaign status to failed
        campaign.status = 'failed';
        await campaign.save();
        throw error;
    }
}

// Process single email
async function processSingleEmail(data: SendSingleEmailJob) {
    const { to, subject, html, text, campaignId, subscriberId } = data;

    console.log(`[Worker] Sending email to: ${to}`);

    // Here you would use your actual email sending service
    // For now, we'll simulate
    await new Promise(resolve => setTimeout(resolve, 100));

    // Update stats if campaign/subscriber provided
    if (subscriberId) {
        const subscriber = await EmailSubscriber.findById(subscriberId);
        if (subscriber) {
            subscriber.totalEmailsSent = (subscriber.totalEmailsSent || 0) + 1;
            subscriber.lastEmailSent = new Date();
            await subscriber.save();
        }
    }

    return { success: true, to };
}

// Worker event handlers
emailWorker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed successfully`);
});

emailWorker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed:`, err);
});

emailWorker.on('error', (err) => {
    console.error('[Worker] Worker error:', err);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    await emailWorker.close();
    await connection.quit();
});

console.log('[Worker] Email worker started and listening for jobs...');

export default emailWorker;
