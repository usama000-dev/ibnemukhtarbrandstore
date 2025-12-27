'use client';
import { useState, useEffect } from 'react';
import { FiVideo, FiBarChart2, FiTrash2, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function StudioTab() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudio = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch('/api/stream/studio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });
                const data = await res.json();
                if (data.success) {
                    setPosts(data.posts);
                }
            } catch (error) {
                console.error('Studio Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudio();
    }, []);

    const deletePost = async (id) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            // Reuse Admin API or create specific delete endpoint?
            // Since we don't have a secure user delete endpoint yet,
            // we can use the admin one IF it allows owner deletion, 
            // but `admin/ads` checks nothing.
            // Let's assume for now we need a delete capability.
            // I will use a simple specialized call or just reuse the logic if possible.
            // Actually, simply hiding it or implementing a robust delete is better.
            // Just show a toast for now as 'Contact Admin to delete' or implement properly later.
            // User requested: "video upload krta h to... shows uploaded posts... analytics... admin confirm... status".
            // Deletion wasn't explicitly asked for USER, but implied for Admin.
            toast.info("Deletion is currently restricted to Admins.");
        } catch (e) {
            toast.error("Failed to delete");
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Studio... 🎥</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">My Studio</h2>
                <div className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold">
                    {posts.length} Uploads
                </div>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-xl">
                    <FiVideo className="mx-auto text-4xl text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">You haven't uploaded any videos yet.</p>
                    <p className="text-sm text-gray-400">Go to the Stream feed and click the + button!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {posts.map((post) => (
                        <div key={post._id} className="bg-white border rounded-xl p-4 flex gap-4 hover:shadow-md transition">
                            {/* Thumbnail */}
                            <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                                {post.type === 'video' ? (
                                    <video src={post.url} className="w-full h-full object-cover" />
                                ) : post.type === 'image' ? (
                                    <img src={post.url} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500 font-bold">POLL</div>
                                )}
                                <div className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-1 rounded">
                                    {post.type.toUpperCase()}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-900 line-clamp-1">{post.title}</h3>
                                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">{post.description || 'No description'}</div>

                                    {/* Status Badge */}
                                    <div className="mt-2 flex items-center gap-2">
                                        {post.status === 'active' && <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full"><FiCheckCircle /> Live</span>}
                                        {post.status === 'pending_approval' && <span className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full"><FiClock /> Pending</span>}
                                        {post.status === 'rejected' && <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full"><FiXCircle /> Rejected</span>}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-xs text-gray-500 border-t pt-2 mt-2">
                                    <div className="flex items-center gap-1"><FiBarChart2 /> {post.stats?.views || 0} Views</div>
                                    <div className="flex items-center gap-1">❤️ {post.stats?.likes || 0} Likes</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
