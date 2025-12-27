import { NextRequest, NextResponse } from 'next/server';
import { EmailSubscriber } from '@/models/EmailSubscriber';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || null;
    const source = searchParams.get('source') || null;
    const search = searchParams.get('search') || null;

    const skip = (page - 1) * limit;

    // Build query
    let query: any = {};

    // ✅ Status filter
    if (status && status !== 'all') {
      if (status === 'active') {
        query.isActive = true;
      } else if (status === 'inactive') {
        query.isActive = false;
      }
    }

    // ✅ Source filter
    if (source && source !== 'all') {
      query.source = source;
    }

    // ✅ Search filter
    if (search && search.trim() !== '') {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    // Get subscribers with pagination
    const subscribers = await EmailSubscriber.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-unsubscribeToken');

    // Get total count
    const total = await EmailSubscriber.countDocuments(query);

    // Get statistics
    const stats = await EmailSubscriber.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: ['$isActive', 1, 0] } },
          inactive: { $sum: { $cond: ['$isActive', 0, 1] } },
          totalEmailsSent: { $sum: '$totalEmailsSent' }
        }
      }
    ]);

    const sourceStats = await EmailSubscriber.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      subscribers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: stats[0] || { total: 0, active: 0, inactive: 0, totalEmailsSent: 0 },
      sourceStats
    });

  } catch (error) {
    console.error('Error getting subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to get subscribers' },
      { status: 500 }
    );
  }
}



export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const result = await EmailSubscriber.deleteOne({ email: email.toLowerCase() });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Subscriber deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscriber' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { email, isActive } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const subscriber = await EmailSubscriber.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isActive },
      { new: true }
    );

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Subscriber updated successfully',
      subscriber: {
        email: subscriber.email,
        name: subscriber.name,
        isActive: subscriber.isActive,
        source: subscriber.source
      }
    });

  } catch (error) {
    console.error('Error updating subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to update subscriber' },
      { status: 500 }
    );
  }
}
