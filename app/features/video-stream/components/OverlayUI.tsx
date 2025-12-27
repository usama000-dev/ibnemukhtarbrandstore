'use client';
import Link from 'next/link';
import { useState } from 'react';

interface OverlayUIProps {
    video: any;
    onLike: () => void;
    onShare: () => void;
    isMuted: boolean;
    toggleMute: () => void;
}

export default function OverlayUI({ video, onLike, onShare, isMuted, toggleMute }: OverlayUIProps) {
    const [liked, setLiked] = useState(false);
    const isAd = video.source === 'ad';

    const handleLike = () => {
        setLiked(!liked);
        onLike();
    };

    const handleAdClick = () => {
        // Track ad click API here
        fetch('/api/stream/interaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'ad_click', videoId: video._id })
        }).catch(err => console.error('Tracking error', err));
    };

    return (
        <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 pb-20 md:pb-4">
            {/* Top Bar (Mute Toggle + Sponsored Badge) */}
            <div className="flex justify-between items-start pt-2">
                <div className={`px-3 py-1 backdrop-blur-sm rounded-full text-xs font-bold border border-white/20 uppercase ${isAd ? 'bg-yellow-500/80 text-black' : 'bg-black/30 text-white'}`}>
                    {isAd ? 'Sponsored' : video.category}
                </div>
                <button
                    onClick={toggleMute}
                    className="pointer-events-auto p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition"
                >
                    {isMuted ? '🔇' : '🔊'}
                </button>
            </div>

            {/* Right Sidebar Actions (Hide for Ads or Limit?) */}
            {!isAd && (
                <div className="absolute right-2 bottom-24 flex flex-col gap-6 items-center">
                    <button
                        onClick={handleLike}
                        className="pointer-events-auto flex flex-col items-center gap-1 group"
                    >
                        <div className={`p-3 rounded-full bg-black/40 backdrop-blur-sm transition-transform group-active:scale-90 ${liked ? 'text-red-500' : 'text-white'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 fill-current" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={liked ? 0 : 2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <span className="text-white text-xs font-bold shadow-black drop-shadow-md">{video.stats?.likes + (liked ? 1 : 0) || 0}</span>
                    </button>

                    <button
                        onClick={onShare}
                        className="pointer-events-auto flex flex-col items-center gap-1 group"
                    >
                        <div className="p-3 rounded-full bg-black/40 backdrop-blur-sm text-white transition-transform group-active:scale-90">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                        </div>
                        <span className="text-white text-xs font-bold shadow-black drop-shadow-md">Share</span>
                    </button>

                    {video.source === 'upload' && (
                        <a
                            href={video.url}
                            download
                            target="_blank"
                            className="pointer-events-auto flex flex-col items-center gap-1 group"
                        >
                            <div className="p-3 rounded-full bg-black/40 backdrop-blur-sm text-white transition-transform group-active:scale-90">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </div>
                            <span className="text-white text-xs font-bold shadow-black drop-shadow-md">Save</span>
                        </a>
                    )}
                </div>
            )}

            {/* Bottom Content Area */}
            <div className="pointer-events-auto w-[85%]">
                <h3 className="text-white font-bold text-lg drop-shadow-md line-clamp-2">{video.title}</h3>
                {!isAd && <p className="text-gray-200 text-sm drop-shadow-sm line-clamp-2 mt-1 opacity-90">{video.description}</p>}

                {/* AD CTA Button */}
                {isAd && (
                    <div className="mt-4 animate-bounce-slow">
                        <a
                            href={video.ctaType === 'call' ? `tel:${video.ctaLink}` : video.ctaLink}
                            target={video.ctaType === 'link' ? '_blank' : '_self'}
                            onClick={handleAdClick}
                            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3 px-6 rounded-full shadow-lg transition-transform active:scale-95 w-fit"
                        >
                            <span>{video.ctaText}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                )}

                {/* Product Widget Pill (Only Not Ad) */}
                {!isAd && video.products && video.products.length > 0 && (
                    <div className="mt-3 animate-bounce-slow">
                        <Link href={`/product/${video.products[0].slug}`} className="flex items-center gap-3 bg-white/90 backdrop-blur p-2 pr-4 rounded-xl shadow-lg border border-white/50 w-fit hover:scale-105 transition-transform active:scale-95">
                            <div className="w-10 h-10 rounded-lg bg-gray-200 bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${video.products[0].images?.[0] || '/placeholder.jpg'})` }}></div>
                            <div>
                                <div className="text-xs font-bold text-gray-900 line-clamp-1">{video.products[0].title}</div>
                                <div className="text-xs font-black text-red-600">PKR {video.products[0].price} <span className="text-gray-500 font-normal ml-1">Shop Now &rarr;</span></div>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
