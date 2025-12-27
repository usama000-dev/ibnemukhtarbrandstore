import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/middleware/mongodb';
import { StreamPost } from '@/app/features/video-stream/models/StreamPost';
import { User } from '@/models/User';
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        await connectDb();
        const body = await request.json();
        const { token, ...postData } = body;

        // 1. Authentication
        let user = null;
        if (token) {
            try {
                const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
                user = await User.findOne({ email: decoded.email });
            } catch (e) {
                return NextResponse.json({ error: 'Invalid Session' }, { status: 401 });
            }
        }

        // Basic validation
        if (!postData.type || !postData.title) {
            return NextResponse.json({ error: 'Type and Title are required' }, { status: 400 });
        }

        // Additional validation based on type
        if (postData.type === 'video' && !postData.url && !postData.platformId) {
            return NextResponse.json({ error: 'Video URL or ID is required' }, { status: 400 });
        }
        if (postData.type === 'image' && (!postData.media || postData.media.length === 0)) {
            return NextResponse.json({ error: 'At least one image is required' }, { status: 400 });
        }
        if (postData.type === 'poll' && (!postData.poll || postData.poll.options.length < 2)) {
            return NextResponse.json({ error: 'Poll query and at least 2 options are required' }, { status: 400 });
        }

        let status = 'pending_approval';
        if (user && user.role === 'admin') {
            status = 'active';
        } else if (!user && postData.source === 'upload') {
            status = postData.status || 'active';
        } else if (user) {
            status = user.role === 'admin' ? 'active' : 'pending_approval';
        }

        const newPost = await StreamPost.create({
            ...postData,
            user: user ? user._id : undefined,
            status: status,
            createdAt: new Date()
        });

        return NextResponse.json({ success: true, post: newPost });
    } catch (error: any) {
        console.error('Create Post Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        await connectDb();
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'ID and Status are required' }, { status: 400 });
        }

        const updated = await StreamPost.findByIdAndUpdate(
            id,
            { status, ...(status === 'active' ? { archivedAt: null } : {}) },
            { new: true }
        );

        return NextResponse.json({ success: true, post: updated });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
