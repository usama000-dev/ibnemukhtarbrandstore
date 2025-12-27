import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/middleware/mongodb';
import { StreamAd } from '@/app/features/video-stream/models/StreamAd';
import { StreamPost } from '@/app/features/video-stream/models/StreamPost';

export async function POST(request: NextRequest) {
    try {
        await connectDb();
        const body = await request.json();
        const { type, videoId } = body;

        if (!videoId || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (type === 'ad_impression') {
            await StreamAd.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
        } else if (type === 'ad_click') {
            await StreamAd.findByIdAndUpdate(videoId, { $inc: { clicks: 1 } });
        } else if (type === 'view') {
            await StreamPost.findByIdAndUpdate(videoId, { $inc: { 'stats.views': 1 } });
        } else if (type === 'like') {
            await StreamPost.findByIdAndUpdate(videoId, { $inc: { 'stats.likes': 1 } });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Interaction Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
