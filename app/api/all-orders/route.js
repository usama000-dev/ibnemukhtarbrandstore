// /api/get-orders.js
import { NextResponse } from "next/server";
import { Order } from "@/models/Order";
import connectDb from "@/middleware/mongoose";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDb();

  const body = await req.json();
  const { token } = body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const email = decoded.email;

    // âœ… For user, also match email
    const orders = await Order.find({ email: email }).lean();

    return NextResponse.json({ orders });
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
