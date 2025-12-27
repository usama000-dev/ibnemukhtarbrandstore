import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/services/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email, type, data } = await request.json();

    // Validate required fields
    if (!email || !type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: email, type, data' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send test email based on type
    let result;
    if (type === 'flash-sale') {
      result = await EmailService.sendTestFlashSaleEmail(email, data);
    } else if (type === 'deal') {
      result = await EmailService.sendTestDealEmail(email, data);
    } else {
      return NextResponse.json(
        { error: 'Invalid email type. Use "flash-sale" or "deal"' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      result
    });

  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}
