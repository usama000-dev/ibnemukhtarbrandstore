'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { SearchResponse, SystemProduct } from '../features/ai-agent/types';
import ShoppingResultCard from '../features/ai-agent/components/ShoppingResultCard';

function AIShoppingContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    const [results, setResults] = useState<SystemProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;

            setLoading(true);
            setError('');

            try {
                const res = await fetch(`/api/ai/search?q=${encodeURIComponent(query)}`);
                if (!res.ok) throw new Error('Search failed');

                const data: SearchResponse = await res.json();
                setResults(data.results);
            } catch (err) {
                console.error(err);
                setError('Failed to find products. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center">
                    <span className="text-blue-500 font-bold tracking-widest text-sm uppercase">AI Assistant</span>
                    <h1 className="text-3xl md:text-5xl font-extrabold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        {query ? `Here's what I found for "${query}"` : 'How can I help you today?'}
                    </h1>
                </header>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-square bg-white/10 rounded-2xl"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center text-red-400 p-8 border border-red-500/20 rounded-2xl bg-red-900/10">
                        {error}
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {results.map((product) => (
                            <ShoppingResultCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : query ? (
                    <div className="text-center text-gray-400 py-20">
                        <p className="text-xl">I couldn't find anything matching that description.</p>
                        <p className="mt-2 text-sm">Try asking for "Taekwondo Uniform" or "Boxing Gloves"</p>
                    </div>
                ) : (
                    <div className="text-center text-gray-400 py-20">
                        <p className="text-xl">Tap the microphone to start shopping.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AIShoppingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <AIShoppingContent />
        </Suspense>
    );
}
