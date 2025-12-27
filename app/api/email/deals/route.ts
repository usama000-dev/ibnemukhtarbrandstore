import { NextRequest, NextResponse } from 'next/server';
import { DealCheckService } from '@/services/dealCheckService';

export async function GET(request: NextRequest) {
  try {
    const activeDeals = await DealCheckService.checkActiveDeals();
    
    return NextResponse.json({
      success: true,
      deals: activeDeals
    });

  } catch (error) {
    console.error('Error fetching active deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active deals' },
      { status: 500 }
    );
  }
}
