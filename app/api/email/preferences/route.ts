import { NextRequest, NextResponse } from 'next/server';
import { EmailSubscriber } from '@/models/EmailSubscriber';

export async function POST(request: NextRequest) {
  try {
    const { email, preferences } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const subscriber = await EmailSubscriber.findOne({ email: email.toLowerCase() });

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    // Update preferences
    const updatedPreferences = {
      deals: preferences.deals ?? subscriber.preferences.deals,
      flashSales: preferences.flashSales ?? subscriber.preferences.flashSales,
      newsletters: preferences.newsletters ?? subscriber.preferences.newsletters,
      productUpdates: preferences.productUpdates ?? subscriber.preferences.productUpdates,
    };

    await EmailSubscriber.findByIdAndUpdate(subscriber._id, {
      preferences: updatedPreferences,
      isActive: Object.values(updatedPreferences).some(pref => pref)
    });

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: updatedPreferences
    });

  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const subscriber = await EmailSubscriber.findOne({ email: email.toLowerCase() });

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
        preferences: subscriber.preferences,
        source: subscriber.source,
        subscribedAt: subscriber.subscribedAt
      }
    });

  } catch (error) {
    console.error('Error getting subscriber preferences:', error);
    return NextResponse.json(
      { error: 'Failed to get subscriber preferences' },
      { status: 500 }
    );
  }
}
