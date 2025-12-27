import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/middleware/mongodb';
import { StreamPost } from '@/app/features/video-stream/models/StreamPost';
import { Product } from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
        if (!YOUTUBE_API_KEY) {
            return NextResponse.json({ error: 'YOUTUBE_API_KEY is missing' }, { status: 500 });
        }

        await connectDb();

        // 1. Archive Logic
        const activeCount = await StreamPost.countDocuments({ status: 'active', type: 'video', source: 'youtube' });
        const FEED_LIMIT = 200;

        if (activeCount >= FEED_LIMIT) {
            const videosToArchive = await StreamPost.find({ status: 'active', type: 'video', source: 'youtube' })
                .sort({ createdAt: 1 })
                .limit(activeCount - FEED_LIMIT + 10);

            const idsToArchive = videosToArchive.map(v => v._id);
            await StreamPost.updateMany(
                { _id: { $in: idsToArchive } },
                {
                    $set: {
                        status: 'archived',
                        archivedAt: new Date()
                    }
                }
            );
        }

        // 2. Fetch New Videos from YOUR CHANNEL ONLY
        // Get your YouTube Channel ID from: https://www.youtube.com/account_advanced
        const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || ''; // Add your channel ID in .env

        // Build search URL with channel filter
        let searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDuration=short&maxResults=50&relevanceLanguage=en&key=${YOUTUBE_API_KEY}&order=date`;

        // If channel ID is provided, fetch from that channel only
        if (YOUTUBE_CHANNEL_ID) {
            searchUrl += `&channelId=${YOUTUBE_CHANNEL_ID}`;
        } else {
            // Fallback: search by keyword if no channel ID
            searchUrl += `&q=Taekwondo`;
        }

        const response = await fetch(searchUrl);
        const data = await response.json();

        if (!data.items) {
            throw new Error('YouTube API returned no items');
        }

        let insertedCount = 0;

        for (const item of data.items) {
            const videoId = item.id.videoId;
            const title = item.snippet.title;
            const description = item.snippet.description;

            const existing = await StreamPost.findOne({ platformId: videoId });
            if (existing) continue;

            // 3. Smart Categorization
            let category = 'other';
            const text = (title + ' ' + description).toLowerCase();

            if (text.includes('poomsae') || text.includes('pattern') || text.includes('taegeuk') || text.includes('form') || text.includes('kata')) {
                category = 'poomsae';
            } else if (text.includes('sparring') || text.includes('fight') || text.includes('kick') || text.includes('kyorugi') || text.includes('match') || text.includes('competition')) {
                category = 'kyorugi';
            } else if (text.includes('training') || text.includes('workout') || text.includes('fitness') || text.includes('stretch')) {
                category = 'fitness';
            }

            // 4. Auto-Link Products
            let linkedProducts = [];
            let query = {};

            if (category === 'poomsae') {
                query = {
                    $or: [
                        { title: { $regex: 'poomsae', $options: 'i' } },
                        { category: { $regex: 'uniform', $options: 'i' } },
                        { tags: { $in: ['poomsae', 'dobok'] } }
                    ]
                };
            } else if (category === 'kyorugi') {
                query = {
                    $or: [
                        { title: { $regex: 'sparring', $options: 'i' } },
                        { category: { $regex: 'protector', $options: 'i' } },
                        { category: { $regex: 'gloves', $options: 'i' } },
                        { tags: { $in: ['kyorugi', 'fight', 'guard'] } }
                    ]
                };
            } else {
                if (category === 'fitness') {
                    query = {
                        $or: [
                            { title: { $regex: 'target', $options: 'i' } },
                            { title: { $regex: 'pad', $options: 'i' } }
                        ]
                    };
                }
            }

            // Execute query only if we have a strategy
            if (Object.keys(query).length > 0) {
                // Fetch random 1 product
                const products = await Product.find(query).limit(5); // Get pool of 5
                if (products.length > 0) {
                    const randomProduct = products[Math.floor(Math.random() * products.length)];
                    linkedProducts.push(randomProduct._id);
                }
            }

            // 5. Create Video Entry
            await StreamPost.create({
                type: 'video',
                source: 'youtube',
                platformId: videoId,
                url: `https://youtube.com/shorts/${videoId}`,
                title: title,
                description: description,
                category: category,
                status: 'active',
                products: linkedProducts, // Linked here
                meta: {
                    channelName: item.snippet.channelTitle,
                    thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url
                }
            });
            insertedCount++;
        }

        return NextResponse.json({
            success: true,
            message: `Fetcher ran successfully. Inserted ${insertedCount} new videos.`,
            archived: activeCount >= FEED_LIMIT
        });

    } catch (error: any) {
        console.error('Cron Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
