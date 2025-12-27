import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/services/emailService';
import { EmailCampaign } from '@/models/EmailCampaign';
import { connectDb } from '@/middleware/mongodb';

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      discount,
      validUntil,
      products
    } = await request.json();

    // Validate required fields
    if (!title || !description || !discount || !validUntil || !products) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, discount, validUntil, products' },
        { status: 400 }
      );
    }

    // Validate products array
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: 'Products must be a non-empty array' },
        { status: 400 }
      );
    }

    // Send deal email
    const result = await EmailService.sendDealEmail({
      title,
      description,
      discount,
      validUntil,
      products
    });

    // Create campaign record in database
    await connectDb();
    const campaign = await EmailCampaign.create({
      name: title,
      type: 'deal',
      subject: title,
      htmlContent: `<div>${description}</div>`,
      textContent: description,
      status: 'sent',
      sentAt: new Date(),
      completedAt: new Date(),
      targetAudience: {
        allSubscribers: true,
        specificPreferences: ['deals']
      },
      analytics: {
        totalSubscribers: result.totalSubscribers,
        emailsSent: result.emailsSent,
        emailsDelivered: result.emailsSent,
        emailsOpened: 0,
        emailsClicked: 0,
        openRate: 0,
        clickRate: 0
      },
      variables: {
        discount,
        validUntil,
        products: JSON.stringify(products)
      }
    });

    return NextResponse.json({
      success: true,
      result,
      campaign: {
        id: campaign._id,
        name: campaign.name,
        status: campaign.status
      }
    });
  } catch (error: any) {
    console.error('Deal email error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send deal email' },
      { status: 500 }
    );
  }
}
