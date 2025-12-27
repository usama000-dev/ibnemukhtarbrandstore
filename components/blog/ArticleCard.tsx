import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { getOptimizedCloudinaryUrl } from '@/services/api';

interface BlogAuthor {
  _id: string;
  name: string;
  email: string;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  author: BlogAuthor;
  featuredImage: {
    url: string;
    publicId: string;
  };
  content: string;
  tags: string[];
  likes: string[];
  createdAt: string;
}

interface ArticleCardProps {
  post: BlogPost;
}

export default function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 block">
        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-48 xl:h-56">
          <Image
            src={getOptimizedCloudinaryUrl(post.featuredImage.url)}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="flex flex-col flex-1 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 line-clamp-2">
          {post.title}
        </h2>
        <span className='text-sm text-gray-500 hidden md:block'>
          By {post.author.name || 'Unknown'}
        </span>
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mt-auto">
          <div className="flex items-center gap-2 sm:gap-4">
            <span className='block md:hidden'>
              By {post.author.name?.toUpperCase() || 'Unknown'}
            </span>
            <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <span>❤️ {post.likes.length}</span>
          </div>
        </div>
      </div>
    </article>
  );
} 