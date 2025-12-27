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
      endTime,
      products
    } = await request.json();

    // Validate required fields
    if (!title || !description || !discount || !endTime || !products) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, discount, endTime, products' },
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

    // Validate each product has required fields
    for (const product of products) {
      if (!product.name || !product.originalPrice || !product.salePrice || !product.image) {
        return NextResponse.json(
          { error: 'Each product must have name, originalPrice, salePrice, and image' },
          { status: 400 }
        );
      }
    }

    // Send flash sale email
    const result = await EmailService.sendFlashSaleEmail({
      title,
      description,
      discount,
      endTime,
      products
    });

    // Create campaign record in database
    await connectDb();
    const campaign = await EmailCampaign.create({
      name: title,
      type: 'flash-sale',
      subject: title,
      htmlContent: `<div>${description}</div>`,
      textContent: description,
      status: 'sent',
      sentAt: new Date(),
      completedAt: new Date(),
      targetAudience: {
        allSubscribers: true,
        specificPreferences: ['flashSales']
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
        endTime,
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
    console.error('Flash sale email error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send flash sale email' },
      { status: 500 }
    );
  }
}
