'use client';
import { useState } from 'react';
import VideoFeed from './components/VideoFeed';
import CreationModal from './components/CreationModal';
import { FaPlus } from 'react-icons/fa';

export default function StreamPage() {
    const [activeTab, setActiveTab] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const tabs = [
        { id: 'all', label: 'For You' },
        { id: 'poomsae', label: 'Poomsae' },
        { id: 'kyorugi', label: 'Fighter' },
        { id: 'fitness', label: 'Training' }
    ];

    return (
        <div className="flex justify-center bg-black min-h-screen">
            <div className="w-full scrollbar-hide max-w-md bg-black relative shadow-2xl overflow-hidden h-screen">

                {/* Top Left Creation FAB */}
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="absolute opacity-0 bottom-24 right-4 z-40 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-all active:scale-95"
                >
                    <FaPlus size={20} />
                </button>

                {/* Floating Category Header */}
                <div className="absolute top-4 left-0 right-0 z-30 flex justify-center gap-4 pt-safe-top pointer-events-none">
                    <div className="pointer-events-auto flex gap-4">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`text-sm font-bold drop-shadow-md transition-all ${activeTab === tab.id ? 'text-white border-b-2 border-white pb-1' : 'text-white/60 hover:text-white/90'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Video Feed */}
                <VideoFeed category={activeTab} />

                {/* Creation Modal */}
                {showCreateModal && <CreationModal onClose={() => setShowCreateModal(false)} />}

            </div>
        </div>
    );
}
