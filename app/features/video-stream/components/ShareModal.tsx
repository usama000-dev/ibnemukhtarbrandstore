'use client';
import { useState, useEffect } from 'react';
import { FaWhatsapp, FaFacebook, FaLink, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Link from 'next/link';

interface ShareModalProps {
    url: string;
    title: string;
    videoId: string;
    onClose: () => void;
}

export default function ShareModal({ url, title, videoId, onClose }: ShareModalProps) {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300); // Animation duration
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        toast.success('Link copied! 🔗');
        handleClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
        >
            <div
                className={`bg-white w-full md:w-96 rounded-t-2xl md:rounded-2xl p-6 pb-10 md:pb-6 transition-transform duration-300 ${isClosing ? 'translate-y-full' : 'translate-y-0'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-gray-900">Share to</h3>
                    <button onClick={handleClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                    {/* WhatsApp */}
                    <a
                        href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-xl group-hover:scale-110 transition">
                            <FaWhatsapp />
                        </div>
                        <span className="text-xs text-gray-600">WhatsApp</span>
                    </a>

                    {/* Facebook */}
                    <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl group-hover:scale-110 transition">
                            <FaFacebook />
                        </div>
                        <span className="text-xs text-gray-600">Facebook</span>
                    </a>

                    {/* Copy Link */}
                    <button onClick={copyToClipboard} className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-xl group-hover:scale-110 transition">
                            <FaLink />
                        </div>
                        <span className="text-xs text-gray-600">Copy Link</span>
                    </button>

                    {/* Download */}
                    <Link href={`/stream/download/${videoId}`} className="flex flex-col items-center gap-2 group">
                        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white text-xl group-hover:scale-110 transition">
                            <FaDownload />
                        </div>
                        <span className="text-xs text-gray-600">Download</span>
                    </Link>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border text-xs text-gray-500 text-center">
                    Share this video with your friends to support us! 🥋
                </div>
            </div>
        </div>
    );
}
