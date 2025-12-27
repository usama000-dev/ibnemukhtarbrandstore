import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Martial Arts & Taekwondo Blog | Champion Choice',
  description: 'Read our latest articles, tips, and guides on martial arts, taekwondo uniforms, and fighting gear. Stay updated with Champion Choice.',
  keywords: 'martial arts blog, taekwondo tips, fighting gear guide, champion choice blog',
  openGraph: {
    title: 'Martial Arts & Taekwondo Blog | Champion Choice',
    description: 'Read our latest articles, tips, and guides on martial arts, taekwondo uniforms, and fighting gear.',
    type: 'website',
    url: 'https://www.champzones.com/blog',
    siteName: 'Champion Choice',
    locale: 'en_US',
    images: [
      {
        url: 'https://www.champzones.com/images/championchoice-logo.png',
        width: 1200,
        height: 630,
        alt: 'Champion Choice Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Martial Arts & Taekwondo Blog | Champion Choice',
    description: 'Read our latest articles, tips, and guides on martial arts, taekwondo uniforms, and fighting gear.',
    images: ['https://www.champzones.com/images/championchoice-logo.png'],
    site: '@championchoice',
    creator: '@championchoice',
  },
  alternates: {
    canonical: 'https://www.champzones.com/blog',
  },
};

import BlogPageClient from './BlogPageClient';

export default function BlogPage() {
  return <BlogPageClient />;
}