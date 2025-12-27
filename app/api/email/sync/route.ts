import { NextResponse } from 'next/server';
import { connectDb } from '@/utils/mongodb';
import { SyncService } from '@/services/syncService';

export async function POST(req: Request) {
    try {
        await connectDb();

        // Parse body to see what to sync
        const body = await req.json();
        const { type } = body; // 'users', 'orders', or 'all'

        let result = {};

        if (type === 'users' || type === 'all') {
            const userStats = await SyncService.syncUsers();
            result = { ...result, users: userStats };
        }

        if (type === 'orders' || type === 'all') {
            const orderStats = await SyncService.syncOrders();
            result = { ...result, orders: orderStats };
        }

        return NextResponse.json({ success: true, stats: result });
    } catch (error: any) {
        console.error('Sync API Error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
