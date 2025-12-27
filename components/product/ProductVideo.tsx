'use client';
import { getYouTubeEmbedUrl } from '@/utils/youtube';

interface ProductVideoProps {
    videoUrl?: string | null;
    autoplay?: boolean;
    className?: string;
}

export default function ProductVideo({ videoUrl, autoplay = true, className = '' }: ProductVideoProps) {
    if (!videoUrl) return null;

    const embedUrl = getYouTubeEmbedUrl(videoUrl, {
        autoplay,
        mute: true, // Required for autoplay
        loop: true,
        controls: false,
        modestbranding: true,
    });

    if (!embedUrl) return null;

    return (
        <div className={`relative w-full overflow-hidden rounded-lg ${className}`} style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
            <iframe
                src={embedUrl}
                className="absolute top-0 left-0 w-full h-full border-0"
                title="Product Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
            />
        </div>
    );
}
