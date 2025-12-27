'use client';

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { toast, ToastContainer } from 'react-toastify';
import LoginModal from '../molecules/LoginModal';
import { cancelPendingRequests } from '@/services/api';

interface Comment {
  _id: string;
  name: string;
  email: string;
  userId: string;
  comment: string;
  createdAt: string;
}

interface Props {
  postId: string;
}

export default function CommentSection({ postId }: Props) {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: '',
    userId: user?._id,
  });

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/blog/${postId}/comments`);
      const data = await response.json();
      console.log("data: ",data);
      
      setComments(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
    return () => {
      cancelPendingRequests();
    };
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setShowLogin(true);
      toast.error('Please login to post a comment', {
        autoClose: 1000,
        position: "bottom-left",
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
   
  if (user) {
    setLoading(true);
    try {
      const response = await fetch(`/api/blog/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        toast.error('Failed to post comment');
        setLoading(false);
        throw new Error('Failed to post comment');
      }

      const newComment = await response.json();
      toast.success('Comment posted successfully');
      setComments(prev => [newComment, ...prev]);
      setFormData({ name: '', email: '', comment: '', userId: user?._id || '' });
      setError(null);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to post comment');
      setError('Failed to post comment');
      setLoading(false);
    }
  }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading comments...</div>;
  }

  return (
    <div className="mt-12">
      <ToastContainer />
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      <div className="space-y-6 mb-4">
        {comments.map(comment => (
          <div key={comment._id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{comment.name}</div>
              <div className="text-sm text-gray-500">
                {format(new Date(comment.createdAt), 'MMM d, yyyy')}
              </div>
            </div>
            <p className="text-gray-700">{comment.comment}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-b-2 border-gray-300 focus:border-[#DD8560] focus:outline-none focus:border-b-1"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-b-2 border-gray-300 focus:border-[#DD8560] focus:outline-none focus:border-b-1"
          />
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
            Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 block w-full border-b-2 border-gray-300 focus:border-[#DD8560] focus:outline-none focus:border-b-1"
          />
        </div>

        <button
        disabled={loading || !formData.name || !formData.email || !formData.comment}
          type="submit"
          className="bg-black text-white font-[100] px-6 py-2 hover:bg-[#DD8560] cursor-pointer ease-in-out duration-300"
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      
    </div>
  );
} 