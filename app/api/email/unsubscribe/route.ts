import { NextRequest, NextResponse } from 'next/server';
import { EmailSubscriber } from '@/models/EmailSubscriber';

export async function POST(request: NextRequest) {
  try {
    const { token, email } = await request.json();

    if (!token && !email) {
      return NextResponse.json(
        { error: 'Token or email is required' },
        { status: 400 }
      );
    }

    let query: any = {};
    if (token) {
      query.unsubscribeToken = token;
    } else if (email) {
      query.email = email.toLowerCase();
    }

    const subscriber = await EmailSubscriber.findOne(query);

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    // Update subscriber to inactive
    await EmailSubscriber.findByIdAndUpdate(subscriber._id, {
      isActive: false,
      preferences: {
        deals: false,
        flashSales: false,
        newsletters: false,
        productUpdates: false,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from all email notifications',
      email: subscriber.email
    });

  } catch (error) {
    console.error('Error in unsubscribe:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token && !email) {
      return NextResponse.json(
        { error: 'Token or email is required' },
        { status: 400 }
      );
    }

    let query: any = {};
    if (token) {
      query.unsubscribeToken = token;
    } else if (email) {
      query.email = email.toLowerCase();
    }

    const subscriber = await EmailSubscriber.findOne(query);

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      subscriber: {
        email: subscriber.email,
        name: subscriber.name,
        isActive: subscriber.isActive,
        preferences: subscriber.preferences
      }
    });

  } catch (error) {
    console.error('Error getting subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to get subscriber' },
      { status: 500 }
    );
  }
}
