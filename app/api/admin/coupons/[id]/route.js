import { connectDb } from '@/middleware/mongodb';
import { Product } from '@/models/Product';
import { Uniform } from '@/models/uniform.models';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// ✅ GET a single coupon by ID
export const GET = async (req, { params }) => {
  try {
    const db = await connectDb();
    const coupon = await db.collection('coupons').findOne({ _id: new ObjectId(params.id) });

    if (!coupon) {
      return NextResponse.json({ message: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json(coupon);
  } catch (err) {
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
};

// ✅ PUT (Update coupon)
export const PUT = async (req, { params }) => {
  try {
    const body = await req.json();
    const { token, applyTo, uniforms = [], products = [], code } = body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded: ", decoded);

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDb();
    const { id } = await params;
    console.log("id: ", id);

    const existingCoupon = await db.collection('coupons').findOne({ _id: new ObjectId(id) });
    if (!existingCoupon) {
      return NextResponse.json({ message: 'Coupon not found' }, { status: 404 });
    }

    if (code && code.toUpperCase() !== existingCoupon.code) {
      const codeExists = await db.collection('coupons').findOne({
        code: code.toUpperCase(),
        _id: { $ne: new ObjectId(id) },
      });
      if (codeExists) {
        return NextResponse.json({ message: 'Coupon code already in use' }, { status: 400 });
      }
    }

    if (applyTo === 'uniforms') {
      const validUniforms = await Uniform.find({ _id: { $in: uniforms.map(id => new ObjectId(id)) } });
      if (validUniforms.length !== uniforms.length) {
        return NextResponse.json({ message: 'Some uniforms do not exist' }, { status: 400 });
      }
    }

    if (applyTo === 'products') {
      const validProducts = await Product.find({ _id: { $in: products.map(id => new ObjectId(id)) } });
      if (validProducts.length !== products.length) {
        return NextResponse.json({ message: 'Some products do not exist' }, { status: 400 });
      }
    }

    const updatedCoupon = {
      ...existingCoupon,
      ...body,
      code: code ? code.toUpperCase() : existingCoupon.code,
      updatedAt: new Date(),
    };

    await db.collection('coupons').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedCoupon }
    );

    return NextResponse.json(updatedCoupon);
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
};

// ✅ DELETE coupon
export const DELETE = async (req, { params }) => {
  try {
    const body = await req.json();
    const { token } = body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDb();
    const id = params.id;

    const result = await db.collection('coupons').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};
