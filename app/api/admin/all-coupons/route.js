import connectDb from '@/middleware/mongoose';
import { NextResponse } from 'next/server';

// âœ… GET a single coupon by ID
export const GET = async () => {
  try {
    console.log("enter a try block");
    
    const db = await connectDb();
    const coupons = await db.collection('coupons').find().toArray();
    console.log("coupons ",coupons);
    
    if (!coupons) {
      return NextResponse.json({ message: 'Coupons not found' }, { status: 404 });
    }

    return NextResponse.json(coupons);
  } catch (err) {
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
};
