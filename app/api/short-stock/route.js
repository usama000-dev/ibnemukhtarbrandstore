import { Product } from '@/models/Product';
import { Uniform } from '@/models/uniform.models';
import connectDb from '@/middleware/mongoose';
import sendStockAlertEmail from '@/utils/sendStockAlertEmail';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDb();

    // 1. Products: Find all with availability < 10
    const shortStockProducts = await Product.find({ availability: { $lt: 10 } })
      .select('title availability')
      .lean();

    // 2. Uniforms: Flat list of {size, category, stock} where stock < 10 or missing
    const uniforms = await Uniform.find({}).lean();
    let shortStockUniforms = [];
    uniforms.forEach(u => {
      if (u.size && u.category && (u.stock === undefined || u.stock < 10)) {
        shortStockUniforms.push({
          size: u.size,
          category: u.category,
          stock: u.stock ?? 'Missing',
        });
      }
    });

    // 3. Send email if any short stock found (clean, readable list)
    if (shortStockProducts.length > 0 || shortStockUniforms.length > 0) {
      const emailUniforms = shortStockUniforms.map(u => `${u.size}cm ${u.category} = ${u.stock}`);
      const emailProducts = shortStockProducts.map(p => `Product: ${p.title} = ${p.availability}`);
      const message = [
        ...(emailUniforms.length ? ["Short Stock Uniforms:", ...emailUniforms] : []),
        ...(emailProducts.length ? ["Short Stock Products:", ...emailProducts] : []),
      ].join('\n');
      await sendStockAlertEmail([{ name: 'Short Stock Alert', stock: message }]);
    }

    return NextResponse.json({
      uniforms: shortStockUniforms,
      products: shortStockProducts,
      totalShortStock: shortStockProducts.length + shortStockUniforms.length,
    });
  } catch (error) {
    console.error('Short stock API error:', error);
    return NextResponse.json({ error: 'Failed to fetch short stock' }, { status: 500 });
  }
} 
