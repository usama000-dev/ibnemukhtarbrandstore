import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME_TWO,
  api_key: process.env.CLOUDINARY_API_KEY_TWO,
  api_secret: process.env.CLOUDINARY_API_SECRET_TWO,
});
// console.log("🔧 Cloudinary config:", {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME_TWO,
//   api_key: process.env.CLOUDINARY_API_KEY_TWO,
//   api_secret: process.env.CLOUDINARY_API_SECRET_TWO,
// });
export async function POST(req) {
  try {
    let { publicId } = await req.json();
    // console.log("🗑️ Destroy API called for publicId:", publicId);
   
    if (!publicId) {
      console.error("❌ No publicId provided");
      return NextResponse.json({ error: 'publicId is required' }, { status: 400 });
    }
    // console.log("🔄 Attempting to destroy image from Cloudinary...");
    const result = await cloudinary.uploader.destroy(publicId);
    // console.log("✅ Image destroyed successfully:", result);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error destroying image:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 