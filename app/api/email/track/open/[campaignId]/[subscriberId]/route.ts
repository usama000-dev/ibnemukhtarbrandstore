import { NextRequest, NextResponse } from 'next/server';
import { EmailCampaign } from '@/models/EmailCampaign';
import { EmailSubscriber } from '@/models/EmailSubscriber';
import { connectDb } from '@/utils/mongodb';

// Tracking pixel - 1x1 transparent GIF
const TRACKING_PIXEL = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
);

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ campaignId: string; subscriberId: string }> }
) {
    try {
        await connectDb();
        const { campaignId, subscriberId } = await params;

        // Update campaign analytics
        const campaign = await EmailCampaign.findById(campaignId);
        if (campaign) {
            campaign.analytics.emailsOpened = (campaign.analytics.emailsOpened || 0) + 1;
            campaign.analytics.openRate = Math.round(
                (campaign.analytics.emailsOpened / campaign.analytics.emailsSent) * 100
            );
            await campaign.save();
        }

        // Update subscriber stats
        const subscriber = await EmailSubscriber.findById(subscriberId);
        if (subscriber) {
            // Track that this subscriber opened an email
            subscriber.totalClicks = (subscriber.totalClicks || 0) + 1;
            subscriber.lastClickAt = new Date();
            await subscriber.save();
        }

        // Return tracking pixel
        return new NextResponse(TRACKING_PIXEL, {
            headers: {
                'Content-Type': 'image/gif',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
    } catch (error) {
        console.error('Error tracking email open:', error);
        // Still return pixel even on error
        return new NextResponse(TRACKING_PIXEL, {
            headers: {
                'Content-Type': 'image/gif',
            },
        });
    }
}
