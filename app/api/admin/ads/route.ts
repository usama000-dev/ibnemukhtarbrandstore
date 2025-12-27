import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/middleware/mongodb';
import { StreamAd } from '@/app/features/video-stream/models/StreamAd';

// GET: List all ads
export async function GET(request: NextRequest) {
    try {
        await connectDb();
        const ads = await StreamAd.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, ads });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Create a new ad
export async function POST(request: NextRequest) {
    try {
        await connectDb();
        const body = await request.json();
        const { title, videoUrl, ctaText, ctaLink, ctaType, status } = body;

        const newAd = await StreamAd.create({
            title,
            videoUrl,
            ctaText,
            ctaLink,
            ctaType,
            status: status || 'active'
        });

        return NextResponse.json({ success: true, ad: newAd });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: Update status or details
export async function PUT(request: NextRequest) {
    try {
        await connectDb();
        const body = await request.json();
        const { id, ...updates } = body;

        const updatedAd = await StreamAd.findByIdAndUpdate(id, updates, { new: true });
        return NextResponse.json({ success: true, ad: updatedAd });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Remove ad
export async function DELETE(request: NextRequest) {
    try {
        await connectDb();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        await StreamAd.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
