import { NextRequest, NextResponse } from 'next/server';
import { EmailCampaign } from '@/models/EmailCampaign';
import { EmailTemplate } from '@/models/EmailTemplate';
import { EmailService } from '@/services/emailService';
import { defaultEmailTemplates } from '@/utils/emailTemplates';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const query: any = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const campaigns = await EmailCampaign.find(query)
      .populate('templateId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await EmailCampaign.countDocuments(query);

    return NextResponse.json({
      success: true,
      campaigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });

  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name, subject, htmlContent, textContent, variables, targetAudience, scheduledAt } = body;

    // Validate required fields
    if (!type || !name || !subject || !htmlContent || !textContent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get template for the campaign type
    const template = await EmailTemplate.findOne({ type, isActive: true });
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found for this campaign type' },
        { status: 400 }
      );
    }

    const campaign = await EmailCampaign.create({
      name,
      type,
      templateId: template._id,
      subject,
      htmlContent,
      textContent,
      variables: variables || {},
      targetAudience: targetAudience || { allSubscribers: true },
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      status: scheduledAt ? 'scheduled' : 'draft',
    });

    // If scheduled, trigger sending immediately (hand off to Resend)
    if (scheduledAt) {
      // We don't await this to prevent blocking the response, 
      // but note that Vercel might terminate execution. 
      // For reliability with large lists, Vercel Functions/Cron is better.
      // Per user request, we are doing direct dispatch.
      EmailService.sendCampaign(campaign._id.toString()).catch(err =>
        console.error("Error dispatching scheduled campaign:", err)
      );
    }

    return NextResponse.json({
      success: true,
      message: scheduledAt ? 'Campaign scheduled successfully (dispatching to provider...)' : 'Campaign created successfully',
      campaign
    });

  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
} 