import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/middleware/mongodb';
import { StreamPost } from '@/app/features/video-stream/models/StreamPost';
import { User } from '@/models/User';
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        await connectDb();
        const body = await request.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let user;
        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
            user = await User.findOne({ email: decoded.email });
        } catch (e) {
            return NextResponse.json({ error: 'Invalid Session' }, { status: 401 });
        }

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const posts = await StreamPost.find({ user: user._id })
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, posts });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
