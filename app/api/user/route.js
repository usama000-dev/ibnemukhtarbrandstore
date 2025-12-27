import { NextResponse } from "next/server";
import connectDb from "@/middleware/mongoose";
import jwt from "jsonwebtoken";
import { User } from "@/models/User";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();
    const token = body.token;

    if (!token) return NextResponse.json({ error: "Token missing" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const userEmail = decoded.email;

    const user = await User.findOne({ email: userEmail }).lean();

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
