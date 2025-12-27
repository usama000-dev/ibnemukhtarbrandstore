import connectDb from "@/middleware/mongoose";
import { Order } from "@/models/Order";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary config (use your main credentials here or .env as needed)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME_TWO,
  api_key: process.env.CLOUDINARY_API_KEY_TWO,
  api_secret: process.env.CLOUDINARY_API_SECRET_TWO,
});

export async function POST(req) {
  await connectDb();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const deliveryStatus = searchParams.get("deliveryStatus");

  const body = await req.json();
  const { token } = body;

  try {
    // Decode token and extract info
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const email = decoded.email;
    const role = decoded.role || decoded.roll; // safe fallback

    console.log("Decoded:", decoded);
    console.log("Query Params â†’", { status, deliveryStatus });

    let query = {};

    if (role === "admin") {
      // Admin can filter by status or deliveryStatus, or see all
      if (status) {
        query.status = status;
      } else if (deliveryStatus) {
        query.deliveryStatus = deliveryStatus;
      }
      // If none, query remains empty (get all orders)
    } else {
      // Normal user â€” always get only their orders (no status filter)
      query.email = email;
    }

    const orders = await Order.find(query).lean();

    // console.log("Fetched Orders:", orders.length);

    return NextResponse.json({ orders });
  } catch (err) {
    console.error("Token decode error:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

// --- New endpoint for cleaning up old uniform images ---
export async function DELETE(req) {
  await connectDb();
  const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const oldOrders = await Order.find({ createdAt: { $lt: oneMonthAgo } }).lean();
  let deletedImages = [];
  let skipped = 0;

  for (const order of oldOrders) {
    if (!order.products) continue;
    for (const key in order.products) {
      const product = order.products[key];
      if (product && product.uniformNumberFormat && product.imageUrl) {
        // Extract publicId from imageUrl
        try {
          const urlParts = product.imageUrl.split('/');
          // Find the index of 'upload' and get everything after it
          const uploadIdx = urlParts.findIndex(part => part === 'upload');
          if (uploadIdx !== -1) {
            // Remove version if present (e.g., v123)
            let publicIdParts = urlParts.slice(uploadIdx + 1);
            if (publicIdParts[0].startsWith('v')) publicIdParts = publicIdParts.slice(1);
            // Remove file extension
            const last = publicIdParts[publicIdParts.length - 1];
            publicIdParts[publicIdParts.length - 1] = last.split('.')[0];
            const publicId = publicIdParts.join('/');
            // Delete from Cloudinary
            await cloudinary.uploader.destroy(publicId, { invalidate: true });
            deletedImages.push(publicId);
          } else {
            skipped++;
          }
        } catch (err) {
          console.error('Failed to delete image for product:', product.uniformNumberFormat, err);
          skipped++;
        }
      } else {
        skipped++;
      }
    }
  }
  return NextResponse.json({ success: true, deletedImages, skipped });
}
