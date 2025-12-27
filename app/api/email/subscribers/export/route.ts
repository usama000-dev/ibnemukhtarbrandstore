import { NextRequest, NextResponse } from 'next/server';
import { EmailSubscriber } from '@/models/EmailSubscriber';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const source = searchParams.get('source');

    // Build query
    let query: any = {};
    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }
    if (source && source !== 'all') {
      query.source = source;
    }

    // Get subscribers
    const subscribers = await EmailSubscriber.find(query)
      .select('email name source isActive subscribedAt totalEmailsSent notes tags interests totalClicks')
      .sort({ subscribedAt: -1 })
      .lean();

    // Convert to CSV
    const csvHeaders = [
      'Email',
      'Name',
      'Source',
      'Status',
      'Subscribed Date',
      'Total Emails Sent',
      'Total Clicks',
      'Notes',
      'Tags',
      'Interests'
    ];

    const csvRows = subscribers.map(sub => [
      sub.email,
      sub.name || '',
      sub.source,
      sub.isActive ? 'Active' : 'Inactive',
      new Date(sub.subscribedAt).toLocaleDateString(),
      sub.totalEmailsSent || 0,
      sub.totalClicks || 0,
      sub.notes || '',
      (sub.tags || []).join(', '),
      (sub.interests || []).join(', ')
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Update export timestamp for all exported subscribers
    await EmailSubscriber.updateMany(
      { _id: { $in: subscribers.map(s => s._id) } },
      { exportedAt: new Date() }
    );

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="subscribers-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });

  } catch (error) {
    console.error('Error exporting subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to export subscribers' },
      { status: 500 }
    );
  }
}
