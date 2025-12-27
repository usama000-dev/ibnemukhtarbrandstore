import { NextRequest, NextResponse } from 'next/server';
import { EmailSubscriber } from '@/models/EmailSubscriber';

export async function GET(request: NextRequest) {
  try {
    // Get total subscribers
    const totalSubscribers = await EmailSubscriber.countDocuments();
    
    // Get active subscribers
    const activeSubscribers = await EmailSubscriber.countDocuments({ isActive: true });
    
    // Get inactive subscribers
    const inactiveSubscribers = await EmailSubscriber.countDocuments({ isActive: false });
    
    // Get source breakdown
    const sourceBreakdown = await EmailSubscriber.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get preference breakdown
    const preferenceBreakdown = await EmailSubscriber.aggregate([
      {
        $group: {
          _id: null,
          deals: { $sum: { $cond: [{ $eq: ['$preferences.deals', true] }, 1, 0] } },
          flashSales: { $sum: { $cond: [{ $eq: ['$preferences.flashSales', true] }, 1, 0] } },
          newsletters: { $sum: { $cond: [{ $eq: ['$preferences.newsletters', true] }, 1, 0] } },
          productUpdates: { $sum: { $cond: [{ $eq: ['$preferences.productUpdates', true] }, 1, 0] } }
        }
      }
    ]);

    // Convert source breakdown to object format
    const sources: { [key: string]: number } = {};
    sourceBreakdown.forEach((item: any) => {
      sources[item._id] = item.count;
    });

    const stats = {
      total: totalSubscribers,
      active: activeSubscribers,
      inactive: inactiveSubscribers,
      sources,
      preferenceBreakdown: preferenceBreakdown[0] || {
        deals: 0,
        flashSales: 0,
        newsletters: 0,
        productUpdates: 0
      }
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error fetching subscriber stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriber stats' },
      { status: 500 }
    );
  }
}
