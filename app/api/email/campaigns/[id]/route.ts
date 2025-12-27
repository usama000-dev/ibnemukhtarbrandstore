import { NextRequest, NextResponse } from 'next/server';
import { EmailCampaign } from '@/models/EmailCampaign';
import { connectDb } from '@/utils/mongodb';
import { EmailService } from '@/services/emailService';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDb();
        const { id } = await params;
        const campaign = await EmailCampaign.findById(id).populate('templateId');

        if (!campaign) {
            return NextResponse.json(
                { success: false, error: 'Campaign not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            campaign,
        });
    } catch (error) {
        console.error('Error fetching campaign:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch campaign' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDb();
        const { id } = await params;
        const body = await request.json();
        const { name, subject, htmlContent, textContent, scheduledAt, status } = body;

        const campaign = await EmailCampaign.findById(id);

        if (!campaign) {
            return NextResponse.json(
                { success: false, error: 'Campaign not found' },
                { status: 404 }
            );
        }

        // Update fields
        if (name) campaign.name = name;
        if (subject) campaign.subject = subject;
        if (htmlContent) campaign.htmlContent = htmlContent;
        if (textContent) campaign.textContent = textContent;
        if (status) campaign.status = status;

        // Handle scheduling
        if (scheduledAt !== undefined) {
            if (scheduledAt) {
                campaign.scheduledAt = new Date(scheduledAt);
                // If scheduled, we process it immediately to send to Resend
                // Resend holds it until the scheduled time.
                campaign.status = 'sent'; // Marked as sent to provider

                // We need to save first to ensure ID and updates are persisted
                await campaign.save();

                // Trigger sending to Resend (which handles the delay)
                // Running in background to avoid blocking response
                EmailService.sendCampaignEmail(campaign).catch(err =>
                    console.error('Background send failed:', err)
                );
            } else {
                campaign.scheduledAt = undefined;
                campaign.status = 'draft';
            }
        }

        await campaign.save();

        return NextResponse.json({
            success: true,
            message: 'Campaign updated successfully',
            campaign,
        });
    } catch (error) {
        console.error('Error updating campaign:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update campaign' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDb();
        const { id } = await params;
        const campaign = await EmailCampaign.findById(id);

        if (!campaign) {
            return NextResponse.json(
                { success: false, error: 'Campaign not found' },
                { status: 404 }
            );
        }

        // Don't allow deletion of campaigns that are currently sending
        if (campaign.status === 'sending') {
            return NextResponse.json(
                { success: false, error: 'Cannot delete campaign that is currently sending' },
                { status: 400 }
            );
        }

        await EmailCampaign.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'Campaign deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting campaign:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete campaign' },
            { status: 500 }
        );
    }
}
