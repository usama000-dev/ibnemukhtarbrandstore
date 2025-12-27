'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TiptapEditor from '@/components/TiptapEditor';
import { Tag } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { cancelPendingRequests } from '@/services/api';

interface Tag {
  id: string;
  text: string;
}

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  featuredImage: {
    url: string;
    publicId: string;
  };
}

export default function EditBlogPost({ params }: { params: { slug: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      const { slug } = await params;
      try {
        const response = await fetch(`/api/blog/${slug}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        const data = await response.json();
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
        setTags(data.tags.map((text: string) => ({
          id: Math.random().toString(36).substr(2, 9),
          text
        })));
        setImagePreview(data.featuredImage?.url || '');
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    return () => {
      cancelPendingRequests();
    };
  }, [params]);

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = {
        id: Math.random().toString(36).substr(2, 9),
        text: tagInput.trim(),
      };
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const removeTag = (id: string) => {
    setTags(tags.filter(tag => tag.id !== id));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      if (!(file instanceof Blob)) {
        return reject(new Error("Provided value is not a file or blob"));
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (!title.trim()) throw new Error('Title is required');
      if (!content.trim()) throw new Error('Content is required');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);

      // Always include tags (empty string if no tags)
      formData.append('tags', tags.map(tag => tag.text).join(','));

      // Only append file if it's a new image
      if (featuredImage && featuredImage instanceof File) {
        formData.append('featuredImage', featuredImage);
      }

      // console.log('Submitting form data:');
      for (const [key, value] of formData.entries()) {
        // console.log(key, value instanceof File ? `${value.name} (${value.size} bytes)` : value);
      }
      const entries = Array.from(formData.entries());
      // console.log('Form data entries:');
      entries.forEach(([key, value]) => {
        // console.log(key, value instanceof File ? `${value.name} (${value.size} bytes)` : value);
      });

      const { slug } = await params;
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update blog post');
      }

      toast.success('Post updated successfully');
      router.push('/admin/blog');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      toast.error(err instanceof Error ? err.message : 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!post) {
    return <div className="flex justify-center items-center min-h-screen">Post not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter blog post title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <div className="border border-gray-300 rounded-lg">
            <TiptapEditor
              content={content}
              onChange={setContent}
            />
          </div>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {tag.text}
                <button
                  type="button"
                  onClick={() => removeTag(tag.id)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInput}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type a tag and press Enter"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto h-32 w-auto object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFeaturedImage(null);
                      setImagePreview('');
                    }}
                    className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <Tag className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 