import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/models/Product';
import { Uniform } from '@/models/uniform.models';
import { connectDb } from '@/middleware/mongodb';
import CalculatePrice from '@/utils/priceCalculator';
import { Types } from 'mongoose';

// TypeScript interfaces for Mongoose models
interface IProduct {
    _id: Types.ObjectId;
    title: string;
    slug: string;
    disc: string;
    size?: string;
    category: string;
    color?: string;
    price: number;
    availability: number;
    productFor?: string;
    images: string[];
    featured?: boolean;
    popular?: boolean;
    rating?: number;
    flashPrice?: number | null;
    flashStart?: Date | null;
    flashEnd?: Date | null;
    discountPercent?: number;
    bogo?: {
        triggerQty: number;
        freeProductId: Types.ObjectId;
    } | null;
    views?: number;
    tags?: string[];
    videoUrl?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IUniform {
    _id: Types.ObjectId;
    name?: string;
    company: string;
    size: string;
    category: 'a' | 'a+' | 'b' | 'c' | 'd';
    upperColor?: string;
    trowserColor?: string;
    seneiority?: string;
    imageUrl?: string;
    style?: string;
    uniformNumberFormat: string;
    neckStyle?: string;
    poomseOrNot?: string;
    videoUrl?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

// Force dynamic to prevent caching of search results
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json({ success: false, results: [] });
        }

        await connectDb();

        const searchRegex = new RegExp(query, 'i');

        // Parallel search
        const [products, uniforms] = await Promise.all([
            Product.find({
                $or: [
                    { title: searchRegex },
                    { disc: searchRegex },
                    { category: searchRegex },
                    { tags: searchRegex }
                ]
            }).lean<IProduct[]>().limit(10),

            Uniform.find({
                $or: [
                    { name: searchRegex },
                    { category: searchRegex },
                    { company: searchRegex }
                ]
            }).lean<IUniform[]>().limit(10)
        ]);

        // Normalize Data
        const normalizedProducts = products.map(p => ({
            id: p._id.toString(),
            title: p.title,
            description: p.disc, // Ensure text is stripped on frontend if needed
            price: p.price,
            image: p.images?.[0] || 'https://www.champzones.com/images/championchoice-logo.png',
            link: `/product/${p.slug}`,
            type: 'product'
        }));

        const normalizedUniforms = uniforms.map(u => ({
            id: u._id.toString(),
            title: `${u.company} ${u.name || 'Dobok'}`, // Construct a display title
            description: u.category ? `Category ${u.category.toUpperCase()} Uniform` : 'Martial Arts Uniform',
            price: CalculatePrice(u), // Use utility to calculate price
            image: u.imageUrl || 'https://www.champzones.com/images/championchoice-logo.png',
            link: `/product/${u._id}`,
            type: 'uniform'
        }));

        const combinedResults = [...normalizedProducts, ...normalizedUniforms];

        return NextResponse.json({
            success: true,
            results: combinedResults,
            meta: {
                query,
                count: combinedResults.length
            }
        });

    } catch (error) {
        console.error('AI Search API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
