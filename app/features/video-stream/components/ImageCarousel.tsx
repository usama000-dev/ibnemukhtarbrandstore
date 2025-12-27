'use client';
import { useState } from 'react';
import Image from 'next/image';

interface ImageCarouselProps {
    post: any;
    isActive: boolean;
}

export default function ImageCarousel({ post, isActive }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const media = post.media || [{ url: post.url }]; // Fallback for single image legacy

    const handleNext = (e: any) => {
        e.stopPropagation();
        if (currentIndex < media.length - 1) setCurrentIndex(prev => prev + 1);
    };

    const handlePrev = (e: any) => {
        e.stopPropagation();
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    return (
        <div className="relative w-full h-full bg-black flex items-center justify-center">
            {/* Image */}
            <div className="relative w-full h-full">
                <Image
                    src={media[currentIndex].url}
                    alt={post.title}
                    fill
                    className="object-contain"
                    priority={isActive}
                />
            </div>

            {/* Navigation Dots/Arrows */}
            {media.length > 1 && (
                <>
                    {/* Dots */}
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {media.map((_: any, idx: number) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>

                    {/* Areas for tap navigation (Instagram style edges) */}
                    <div className="absolute inset-y-0 left-0 w-1/4 z-10" onClick={handlePrev}></div>
                    <div className="absolute inset-y-0 right-0 w-1/4 z-10" onClick={handleNext}></div>
                </>
            )}
        </div>
    );
}
