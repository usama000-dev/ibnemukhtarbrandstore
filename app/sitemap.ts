import { MetadataRoute } from 'next';
import { Product } from '@/models/Product';
import BlogPost from '@/models/BlogPost';
import { connectDb } from '@/middleware/mongodb';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.champzones.com';

    // Standard routes
    const routes = [
        '',
        '/about',
        '/products',
        '/blog',
        '/contact-us',
        '/login',
        '/signup',
        '/all-products',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    try {
        await connectDb();

        // Fetch Products
        const products = await Product.find({}, 'slug updatedAt').lean();
        const productUrls = products.map((product) => ({
            url: `${baseUrl}/product/${product.slug}`,
            lastModified: new Date(product.updatedAt || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }));

        // Fetch Blog Posts
        const blogPosts = await BlogPost.find({}, 'slug updatedAt').lean();
        const blogUrls = blogPosts.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.updatedAt || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        return [...routes, ...productUrls, ...blogUrls];

    } catch (error) {
        console.error('Sitemap generation error:', error);
        return routes;
    }
}
