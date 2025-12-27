import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/myaccount/'],
        },
        sitemap: 'https://www.champzones.com/sitemap.xml',
    };
}
