import { Coupon } from "@/models/Coupon";
import connectDb from "@/middleware/mongoose";
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { token, ...couponData } = body;

    await connectDb();

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingCoupon = await Coupon.findOne({ code: couponData.code.toUpperCase() });
    if (existingCoupon) {
      return NextResponse.json({ message: "Coupon code already exists" }, { status: 400 });
    }

    // Optional: Convert types
    couponData.discountValue = Number(couponData.discountValue);
    couponData.minOrderAmount = Number(couponData.minOrderAmount);
    couponData.maxUses = Number(couponData.maxUses);
    couponData.code = couponData.code.toUpperCase();

    const newCoupon = await Coupon.create({
      ...couponData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(newCoupon, { status: 201 });
  } catch (error) {
    console.error("âŒ Error creating coupon:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};
