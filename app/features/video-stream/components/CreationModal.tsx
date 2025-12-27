'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import VideoUploader from '@/components/atom/VideoUploader';

export default function CreationModal({ onClose }: { onClose: () => void }) {
    const [activeTab, setActiveTab] = useState<'post' | 'stream' | 'poll'>('post');
    const [draft, setDraft] = useState<any>(null);

    // Form States
    const [caption, setCaption] = useState('');
    const [files, setFiles] = useState<any[]>([]); // { url, id, type }
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load Draft on Mount
    useEffect(() => {
        const savedDraft = localStorage.getItem('social_draft');
        if (savedDraft) {
            if (confirm('Restore unsaved draft?')) {
                const parsed = JSON.parse(savedDraft);
                setActiveTab(parsed.type);
                setCaption(parsed.caption || '');
                setPollQuestion(parsed.pollQuestion || '');
                setPollOptions(parsed.pollOptions || ['', '']);
                setDraft(parsed);
            }
        }
    }, []);

    // Save Draft on Close/Change
    const saveDraft = () => {
        if (caption || files.length > 0 || pollQuestion) {
            localStorage.setItem('social_draft', JSON.stringify({
                type: activeTab,
                caption,
                pollQuestion,
                pollOptions
            }));
            toast.info('Draft saved locally 💾');
        }
    };

    const handleClose = () => {
        saveDraft();
        onClose();
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to post!');
            setIsSubmitting(false);
            return;
        }

        let payload: any = {
            token,
            title: caption, // Using caption as title
            type: activeTab === 'stream' ? 'video' : activeTab === 'post' ? 'image' : 'poll',
            source: 'upload',
            category: 'other' // Default, user can't select yet or auto-detect
        };

        if (activeTab === 'stream') {
            if (files.length === 0) return toast.error('Please upload a video');
            payload.url = files[0].url;
            payload.platformId = files[0].id || 'vid_' + Date.now();
        } else if (activeTab === 'post') {
            if (files.length === 0) return toast.error('Please upload an image');
            payload.url = files[0].url; // Main thumbnail
            payload.media = files.map(f => ({ type: 'image', url: f.url }));
            payload.platformId = 'img_' + Date.now();
            payload.type = 'image';
        } else if (activeTab === 'poll') {
            if (!pollQuestion || pollOptions.filter(o => o).length < 2) return toast.error('Invalid Poll');
            payload.title = pollQuestion; // Question is title for Polls
            payload.poll = {
                question: pollQuestion,
                options: pollOptions.filter(o => o).map(text => ({ text, votes: 0 }))
            };
            payload.url = '#';
            payload.platformId = 'poll_' + Date.now();
            payload.type = 'poll';
        }

        try {
            const res = await fetch('/api/stream/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (data.success) {
                toast.success('Posted successfully! Waiting for approval. 🕒');
                localStorage.removeItem('social_draft');
                onClose();
            } else {
                toast.error(data.error || 'Failed to post');
            }
        } catch (error) {
            console.error(error);
            toast.error('Network Error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-bold text-lg">Create New</h2>
                    <button onClick={handleClose} className="text-gray-500 hover:text-red-500">✕</button>
                </div>

                {/* Tabs */}
                <div className="flex border-b">
                    {['post', 'stream', 'poll'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-1 py-3 text-sm font-bold uppercase transition-colors ${activeTab === tab ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 h-[400px] overflow-y-auto">
                    {activeTab === 'post' && (
                        <div className="space-y-4">
                            <VideoUploader
                                maxVideos={5}
                                onChange={setFiles}
                                folder="stream-images"
                                label="Upload Images"
                                acceptType="image/*"
                            />
                            <textarea
                                placeholder="Write a caption..."
                                className="w-full p-3 border rounded-xl"
                                rows={3}
                                value={caption}
                                onChange={e => setCaption(e.target.value)}
                            />
                        </div>
                    )}

                    {activeTab === 'stream' && (
                        <div className="space-y-4">
                            <VideoUploader
                                maxVideos={1}
                                onChange={setFiles}
                                folder="stream-videos"
                                label="Upload Video (9:16)"
                                acceptType="video/*"
                            />
                            <textarea
                                placeholder="Describe your video..."
                                className="w-full p-3 border rounded-xl"
                                rows={2}
                                value={caption}
                                onChange={e => setCaption(e.target.value)}
                            />
                        </div>
                    )}

                    {activeTab === 'poll' && (
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Ask a question..."
                                className="w-full p-4 text-lg font-bold border rounded-xl"
                                value={pollQuestion}
                                onChange={e => setPollQuestion(e.target.value)}
                            />
                            {pollOptions.map((opt, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    placeholder={`Option ${i + 1}`}
                                    className="w-full p-3 border rounded-xl"
                                    value={opt}
                                    onChange={e => {
                                        const newOpts = [...pollOptions];
                                        newOpts[i] = e.target.value;
                                        setPollOptions(newOpts);
                                    }}
                                />
                            ))}
                            <button
                                onClick={() => setPollOptions([...pollOptions, ''])}
                                className="text-blue-500 text-sm font-bold"
                            >
                                + Add Option
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t flex justify-end gap-3">
                    <button onClick={handleClose} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg">Draft & Exit</button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </div>
        </div>
    );
}
