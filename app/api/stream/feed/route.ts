import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/middleware/mongodb';
import { StreamPost } from '@/app/features/video-stream/models/StreamPost';
import { StreamAd } from '@/app/features/video-stream/models/StreamAd';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        const status = searchParams.get('status') || 'active';
        await connectDb();

        const query: any = { status: status };

        if (category && category !== 'all') {
            query.category = category;
        }

        const videos = await StreamPost.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('products', 'title price images slug');

        // Ad Injection Logic (Only if ads exist)
        const ads = await StreamAd.find({ status: 'active' });

        let mixedFeed = [];
        if (ads.length > 0) {
            let adIndex = 0;
            videos.forEach((video, index) => {
                mixedFeed.push(video);
                // Inject ad after every 5th video
                if ((index + 1) % 10 === 0) {
                    const randomAd = ads[Math.floor(Math.random() * ads.length)];
                    mixedFeed.push({
                        ...randomAd.toObject(),
                        source: 'ad',
                        url: randomAd.videoUrl, // Map for frontend compatibility
                        _id: randomAd._id,
                    });
                }
            });
        } else {
            mixedFeed = videos;
        }

        return NextResponse.json({
            success: true,
            videos: mixedFeed,
            hasMore: videos.length === limit
        });
    } catch (error) {
        console.error('Feed Error:', error);
        return NextResponse.json({ error: 'Failed to load feed' }, { status: 500 });
    }
}
