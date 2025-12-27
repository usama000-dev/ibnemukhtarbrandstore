'use client';
import { useEffect, useRef, useState } from 'react';
import { FaSync, FaClock } from 'react-icons/fa';

interface VideoPlayerProps {
    video: any;
    isActive: boolean;
    isMuted: boolean;
    toggleMute: () => void;
    onEnded?: () => void;
}

export default function VideoPlayer({ video, isActive, isMuted, toggleMute, onEnded }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Learning Tools State
    // Loop removed as per request - always auto-scroll
    const [playbackRate, setPlaybackRate] = useState(1.0);

    // Handle Play/Pause based on isActive
    useEffect(() => {
        if (isActive) {
            playVideo();
        } else {
            pauseVideo();
        }
    }, [isActive]);

    // Apply Playback Rate
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackRate;
        }
        if (iframeRef.current && video.source === 'youtube') {
            iframeRef.current.contentWindow?.postMessage(
                JSON.stringify({ event: 'command', func: 'setPlaybackRate', args: [playbackRate] }),
                '*'
            );
        }
    }, [playbackRate, isActive]);

    // Handle YouTube Events (End, etc.)
    useEffect(() => {
        if (video.source !== 'youtube') return;

        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== "https://www.youtube.com") return;
            try {
                const data = JSON.parse(event.data);
                // infoDelivery sends player state updates
                // state = 0 (Ended), 1 (Playing)
                if (data.event === 'infoDelivery' && data.info) {
                    if (data.info.playerState === 0) { // ENDED
                        onEnded && onEnded();
                    }
                }
            } catch (e) {
                // Ignore parse errors
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [video.source, onEnded]);


    const playVideo = () => {
        setIsPlaying(true);
        if ((video.source === 'upload' || video.source === 'ad') && videoRef.current) {
            videoRef.current.play().catch(e => console.log('Autoplay blocked', e));
        } else if (video.source === 'youtube' && iframeRef.current) {
            iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        }
    };

    const pauseVideo = () => {
        setIsPlaying(false);
        if ((video.source === 'upload' || video.source === 'ad') && videoRef.current) {
            videoRef.current.pause();
        } else if (video.source === 'youtube' && iframeRef.current) {
            iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
    };

    const togglePlay = () => {
        if (isPlaying) pauseVideo();
        else playVideo();
    };

    const toggleSpeed = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newRate = playbackRate === 1.0 ? 0.5 : 1.0;
        setPlaybackRate(newRate);
    };

    const LearningControls = () => (
        <div className="absolute top-16 right-4 z-30 flex flex-col gap-3">
            <button
                onClick={toggleSpeed}
                className={`flex flex-col items-center justify-center w-10 h-10 rounded-full backdrop-blur-md transition-all ${playbackRate < 1 ? 'bg-red-600 text-white' : 'bg-black/30 text-white'}`}
            >
                <span className="text-[10px] font-bold">{playbackRate}x</span>
            </button>
            {/* Loop button removed */}
        </div>
    );

    if (video.source === 'youtube') {
        return (
            <div className="relative w-full h-full bg-black">
                <iframe
                    ref={iframeRef}
                    className="w-full h-full object-cover pointer-events-none"
                    // Removed autoplay=${isActive} to prevent reload on scroll. Controlled via postMessage.
                    src={`https://www.youtube.com/embed/${video.platformId}?enablejsapi=1&mute=${isMuted ? 1 : 0}&controls=0&loop=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ pointerEvents: 'none' }} // Ensure clicks hit overlay
                />

                {/* Controls Overlay */}
                <LearningControls />

                {/* Interaction Overlay */}
                <div
                    className="absolute inset-0 z-10"
                    onClick={togglePlay}
                />
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <div className="bg-black/40 p-4 rounded-full">
                            <svg className="w-12 h-12 text-white fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative w-full h-full bg-black" onClick={togglePlay}>
            {/* Controls Overlay */}
            <LearningControls />

            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src={video.url || `https://res.cloudinary.com/do58gkhav/video/upload/${video.platformId}`}
                playsInline
                muted={isMuted}
                poster={video.meta?.thumbnailUrl}
                onEnded={() => {
                    if (onEnded) onEnded();
                }}
            />
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <div className="bg-black/40 p-4 rounded-full">
                        <svg className="w-12 h-12 text-white fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                </div>
            )}
        </div>
    );
}
