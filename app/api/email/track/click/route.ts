import { NextRequest, NextResponse } from 'next/server';
import { EmailCampaign } from '@/models/EmailCampaign';
import { EmailSubscriber } from '@/models/EmailSubscriber';
import { connectDb } from '@/utils/mongodb';

export async function GET(request: NextRequest) {
    try {
        await connectDb();
        const { searchParams } = new URL(request.url);
        const campaignId = searchParams.get('c');
        const subscriberId = searchParams.get('s');
        const url = searchParams.get('url');

        if (!url) {
            return NextResponse.redirect('https://champion-choice.com');
        }

        // Update campaign analytics
        if (campaignId) {
            const campaign = await EmailCampaign.findById(campaignId);
            if (campaign) {
                campaign.analytics.emailsClicked = (campaign.analytics.emailsClicked || 0) + 1;
                campaign.analytics.clickRate = Math.round(
                    (campaign.analytics.emailsClicked / campaign.analytics.emailsSent) * 100
                );
                await campaign.save();
            }
        }

        // Update subscriber stats
        if (subscriberId) {
            const subscriber = await EmailSubscriber.findById(subscriberId);
            if (subscriber) {
                subscriber.totalClicks = (subscriber.totalClicks || 0) + 1;
                subscriber.lastClickAt = new Date();
                await subscriber.save();
            }
        }

        // Redirect to actual URL
        return NextResponse.redirect(url);
    } catch (error) {
        console.error('Error tracking click:', error);
        // Redirect to homepage on error
        return NextResponse.redirect('https://champion-choice.com');
    }
}
