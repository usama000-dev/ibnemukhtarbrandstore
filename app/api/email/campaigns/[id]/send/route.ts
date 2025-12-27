import { NextRequest, NextResponse } from 'next/server';
import { EmailCampaign } from '@/models/EmailCampaign';
import { connectDb } from '@/utils/mongodb';
import { queueCampaign } from '@/lib/queue';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    const campaign = await EmailCampaign.findById(id);

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Check if campaign is in a valid state to send
    if (campaign.status === 'sending') {
      return NextResponse.json(
        { success: false, error: 'Campaign is already being sent' },
        { status: 400 }
      );
    }

    if (campaign.status === 'sent') {
      return NextResponse.json(
        { success: false, error: 'Campaign has already been sent' },
        { status: 400 }
      );
    }

    // Add to queue for background processing
    const job = await queueCampaign(id, campaign.type as any);

    // Update campaign status
    campaign.status = 'sending';
    await campaign.save();

    return NextResponse.json({
      success: true,
      message: 'Campaign queued for sending',
      jobId: job.id,
    });

  } catch (error) {
    console.error('Error sending campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to queue campaign' },
      { status: 500 }
    );
  }
}
