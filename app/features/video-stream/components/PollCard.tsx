'use client';
import { useState } from 'react';

interface PollCardProps {
    post: any;
    isActive: boolean;
}

export default function PollCard({ post, isActive }: PollCardProps) {
    const [votedOption, setVotedOption] = useState<number | null>(null);
    const [options, setOptions] = useState(post.poll.options);
    const [totalVotes, setTotalVotes] = useState(post.poll.totalVotes || 0);

    const handleVote = (index: number) => {
        if (votedOption !== null) return; // Already voted locally

        // Optimistic Update
        const newOptions = [...options];
        newOptions[index].votes += 1;
        setOptions(newOptions);
        setTotalVotes((prev: number) => prev + 1);
        setVotedOption(index);

        // API Call
        // fetch('/api/stream/vote', ...)
    };

    return (
        <div className="relative w-full h-full bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
                <div className="mb-6">
                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Poll</span>
                    <h2 className="text-2xl font-bold text-white mt-2 leading-tight">{post.poll.question}</h2>
                    <p className="text-gray-400 text-sm mt-1">{totalVotes} votes • Ends in 2 days</p>
                </div>

                <div className="flex flex-col gap-3">
                    {options.map((option: any, idx: number) => {
                        const percent = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                        const isSelected = votedOption === idx;

                        return (
                            <button
                                key={idx}
                                disabled={votedOption !== null}
                                onClick={() => handleVote(idx)}
                                className={`relative w-full h-14 rounded-xl overflow-hidden border transition-all active:scale-95 ${isSelected ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-white/10 hover:bg-white/5'}`}
                            >
                                {/* Progress Bar Background */}
                                {votedOption !== null && (
                                    <div
                                        className={`absolute inset-y-0 left-0 bg-blue-500/30 transition-all duration-1000 ease-out`}
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                )}

                                {/* Text Content */}
                                <div className="absolute inset-0 flex items-center justify-between px-4">
                                    <span className="text-white font-medium z-10">{option.text}</span>
                                    {votedOption !== null && (
                                        <span className="text-white font-bold z-10">{percent}%</span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
