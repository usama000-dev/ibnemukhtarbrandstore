import { StreamPost } from '@/app/features/video-stream/models/StreamPost';
import { connectDb } from '@/middleware/mongodb';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// SEO Metadata
type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
    await connectDb();
    const { id } = await params;
    const video = await StreamPost.findOne({ platformId: id });
    if (!video) return { title: 'Download Video' };

    return {
        title: `Download ${video.title} - Champion Choice`,
        description: `Download ${video.title} for free. Watch more Taekwondo training videos on Champion Choice.`
    };
}

export default async function DownloadPage({ params }: Props) {
    await connectDb();
    const { id } = await params;
    const video = await StreamPost.findOne({ platformId: id });

    if (!video) return notFound();

    // Construct SaveFrom URL (Safe 3rd Party)
    // SaveFrom URL format: https://en.savefrom.net/1-youtube-video-downloader-360/?url={EncodedVideoURL}
    const targetUrl = `https://en.savefrom.net/1-youtube-video-downloader-360/?url=${encodeURIComponent(video.url)}`;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
                <h1 className="text-2xl font-black mb-6 text-gray-900">Download Video</h1>

                {/* Video Info */}
                <div className="mb-8">
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 shadow-md bg-gray-200">
                        {video.meta?.thumbnailUrl && (
                            <Image
                                src={video.meta.thumbnailUrl}
                                alt={video.title}
                                fill
                                className="object-cover"
                            />
                        )}
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 line-clamp-2">{video.title}</h2>
                    <p className="text-sm text-gray-500 mt-2">{video.description?.substring(0, 100)}...</p>
                </div>

                {/* AD SLOT START */}
                <div className="my-6 p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-xs text-gray-400 mb-2">ADVERTISEMENT</p>
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-400 font-bold">
                        Google AdSense Slot
                    </div>
                </div>
                {/* AD SLOT END */}

                {/* Download Action */}
                <p className="text-sm text-gray-600 mb-4">
                    Click below to open the secure download server.
                </p>

                <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 animate-pulse"
                >
                    🚀 Proceed to Download
                </a>

                <Link href="/stream" className="block mt-6 text-gray-500 text-sm hover:underline">
                    &larr; Back to Stream
                </Link>
            </div>

            <div className="mt-8 text-xs text-gray-400 text-center max-w-md">
                Disclaimer: Champion Choice does not host these files. You will be redirected to a third-party service (SaveFrom) to complete the download. Please respect copyright laws.
            </div>
        </div>
    );
}
