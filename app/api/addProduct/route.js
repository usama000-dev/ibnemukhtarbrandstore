import connectDb from '../../../middleware/mongoose';
import { Product } from '../../../models/Product';

export async function POST(req) {
  try {
    await connectDb();

    const formData = await req.json();
    const {
      title, slug, disc, size, category, color, price, availability, images,
      flashPrice, flashStart, flashEnd, discountPercent, tagsRaw, videoUrl,
      // New e-commerce fields
      trackingLink, weight, dimensionLength, dimensionWidth, dimensionHeight,
      brand, material, careInstructions, warranty, sku, condition
    } = formData;
    let tags = [];
    try {
      tags = typeof tagsRaw === 'string' ? JSON.parse(tagsRaw) : [];
    } catch (err) {
      tags = tagsRaw.split(',').map((tag) => tag.trim()).filter(Boolean);
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return new Response(JSON.stringify({ error: "At least 1 image is required!" }), {
        status: 400,
      });
    }

    // images is now an array of URLs from frontend (already uploaded)
    const imageUrls = images;

    const product = new Product({
      title,
      slug,
      disc,
      size,
      category,
      color,
      price,
      availability,
      images: imageUrls,
      flashPrice: isNaN(flashPrice) ? null : flashPrice,
      flashStart,
      flashEnd,
      discountPercent: isNaN(discountPercent) ? 0 : discountPercent,
      tags,
      videoUrl: videoUrl && videoUrl.trim() !== '' ? videoUrl.trim() : null,
      // New e-commerce fields
      trackingLink: trackingLink || null,
      weight: weight ? Number(weight) : null,
      dimensions: {
        length: dimensionLength ? Number(dimensionLength) : null,
        width: dimensionWidth ? Number(dimensionWidth) : null,
        height: dimensionHeight ? Number(dimensionHeight) : null,
      },
      brand: brand || 'Ibnemukhtar',
      material: material || null,
      careInstructions: careInstructions || null,
      warranty: warranty || null,
      sku: sku || null,
      condition: condition || 'New',
    });

    await product.save();

    return new Response(JSON.stringify({ message: "Product added!", imageUrls }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error uploading product:", error);
    return new Response(JSON.stringify({ error: "Upload failed!" }), {
      status: 500,
    });
  }
}
