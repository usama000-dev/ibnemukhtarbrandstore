import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/services/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email, name, source } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    const subscriber = await EmailService.addSubscriber(email, name, source);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to email notifications',
      subscriber: {
        email: subscriber.email,
        name: subscriber.name,
        source: subscriber.source,
      }
    });

  } catch (error) {
    console.error('Error in email subscription:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to email notifications' },
      { status: 500 }
    );
  }
} 