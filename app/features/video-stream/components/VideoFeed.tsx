'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import VideoPlayer from './VideoPlayer';
import ImageCarousel from './ImageCarousel';
import PollCard from './PollCard';
import OverlayUI from './OverlayUI';
import ShareModal from './ShareModal';
import { toast } from 'react-toastify';

export default function VideoFeed({ category }: { category: string }) {
    const [videos, setVideos] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);

    // Share Modal State
    const [shareVideo, setShareVideo] = useState<any | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Initial Fetch
    useEffect(() => {
        setVideos([]);
        setPage(1);
        setHasMore(true);
        fetchVideos(1, true);
    }, [category]);

    const fetchVideos = async (pageNum: number, isReset = false) => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/stream/feed?category=${category}&page=${pageNum}&limit=10`);
            const data = await res.json();

            if (data.success) {
                setVideos(prev => isReset ? data.videos : [...prev, ...data.videos]);
                setHasMore(data.hasMore);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load videos');
        } finally {
            setLoading(false);
        }
    };

    // Intersection Observer for Auto-play and Pagination
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.6 // Video must be 60% visible to play
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.getAttribute('data-index') || '0');
                    setCurrentVideoIndex(index);

                    // Analytics Tracking
                    const video = videos[index];
                    if (video) {
                        // Track View
                        const type = video.source === 'ad' ? 'ad_impression' : 'view';
                        fetch('/api/stream/interaction', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ type, videoId: video._id })
                        }).catch(err => console.error('Tracking error', err));
                    }

                    // Preload next page if near end
                    if (index >= videos.length - 2 && hasMore && !loading) {
                        setPage(prev => {
                            const nextPage = prev + 1;
                            fetchVideos(nextPage);
                            return nextPage;
                        });
                    }
                }
            });
        }, options);

        const videoElements = document.querySelectorAll('.video-card');
        videoElements.forEach(el => observerRef.current?.observe(el));

        return () => observerRef.current?.disconnect();
    }, [videos, hasMore, loading]);

    const toggleMute = () => setIsMuted(!isMuted);

    const handleVideoEnd = () => {
        // Scroll to next video
        if (currentVideoIndex < videos.length - 1) {
            const nextIndex = currentVideoIndex + 1;
            const nextElement = document.querySelector(`[data-index="${nextIndex}"]`);
            nextElement?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full h-[calc(100vh-60px)] md:h-[calc(100vh-80px)] overflow-y-scroll snap-y snap-mandatory scroll-smooth scrollbar-hide bg-black">
            {videos.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-white">
                    <div className="text-xl font-bold mb-2">No videos found 🥋</div>
                    <p className="text-gray-400">Try a different category or verify the cron fetcher.</p>
                </div>
            )}

            {videos.map((video, index) => (
                <div
                    key={`${video._id}-${index}`}
                    data-index={index}
                    className="video-card w-full h-full snap-start relative flex items-center justify-center bg-gray-900 border-b border-gray-800"
                >
                    {video.type === 'video' || !video.type ? (
                        <VideoPlayer
                            video={video}
                            isActive={currentVideoIndex === index}
                            isMuted={isMuted}
                            toggleMute={toggleMute}
                            onEnded={handleVideoEnd}
                        />
                    ) : video.type === 'image' ? (
                        <ImageCarousel post={video} isActive={currentVideoIndex === index} />
                    ) : video.type === 'poll' ? (
                        <PollCard post={video} isActive={currentVideoIndex === index} />
                    ) : null}
                    <OverlayUI
                        video={video}
                        onLike={() => toast.success('Liked! ❤️')}
                        onShare={() => setShareVideo(video)}
                        isMuted={isMuted}
                        toggleMute={toggleMute}
                    />
                </div>
            ))}

            {loading && (
                <div className="w-full h-20 flex items-center justify-center text-white snap-start">
                    Loading more kicks... 🦶
                </div>
            )}

            {/* Share Modal */}
            {shareVideo && (
                <ShareModal
                    url={`${window.location.origin}/stream/${shareVideo.platformId}`}
                    title={shareVideo.title}
                    videoId={shareVideo.platformId}
                    onClose={() => setShareVideo(null)}
                />
            )}
        </div>
    );
}
