"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, Chip, Avatar, Grid } from "@mui/material";
import { IconHeart, IconEye, IconMessage } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { cancelPendingRequests } from "@/services/api";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  featuredImage: {
    url: string;
  };
  likesCount: number;
  viewsCount?: number;
  commentsCount: number;
  authorName: string;
  authorEmail: string;
  createdAt: string;
}

interface TopBlogsData {
  mostLiked: Blog[];
  mostViewed: Blog[];
}

const TopBlogs = () => {
  const [blogsData, setBlogsData] = useState<TopBlogsData>({ mostLiked: [], mostViewed: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'liked' | 'viewed'>('liked');

  useEffect(() => {
    fetchTopBlogs();
    return () => {
      cancelPendingRequests();
    };
  }, []);

  const fetchTopBlogs = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/blog/top-blogs`);
      const data = await response.json();
      
      if (response.ok) {
        setBlogsData(data);
      } else {
        console.error('Failed to fetch top blogs:', data.error);
      }
    } catch (error) {
      console.error('Error fetching top blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateTitle = (title: string, maxLength: number = 50) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top Blogs
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Typography>Loading...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const currentBlogs = activeTab === 'liked' ? blogsData.mostLiked : blogsData.mostViewed;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Top Blogs
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label="Most Liked"
              color={activeTab === 'liked' ? 'primary' : 'default'}
              onClick={() => setActiveTab('liked')}
              size="small"
            />
            <Chip
              label="Most Viewed"
              color={activeTab === 'viewed' ? 'primary' : 'default'}
              onClick={() => setActiveTab('viewed')}
              size="small"
            />
          </Box>
        </Box>

        {currentBlogs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="textSecondary">
              No blogs found
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {currentBlogs.map((blog, index) => (
              <Box
                key={blog._id}
                sx={{
                  display: 'flex',
                  gap: 2,
                  p: 2,
                  borderBottom: index < currentBlogs.length - 1 ? '1px solid #e0e0e0' : 'none',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                  }
                }}
              >
                {/* Blog Image */}
                <Box sx={{ position: 'relative', minWidth: 80, height: 60 }}>
                  {blog.featuredImage?.url ? (
                    <Image
                      src={blog.featuredImage.url}
                      alt={blog.title}
                      fill
                      style={{ objectFit: 'cover', borderRadius: 8 }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#e0e0e0',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="caption" color="textSecondary">
                        No Image
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Blog Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Link href={`/blog/${blog.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        cursor: 'pointer',
                        '&:hover': {
                          color: 'primary.main'
                        }
                      }}
                    >
                      {truncateTitle(blog.title)}
                    </Typography>
                  </Link>
                  
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                    By {blog.authorName || 'Unknown'} • {formatDate(blog.createdAt)}
                  </Typography>

                  {/* Stats */}
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconHeart size={14} color="#e91e63" />
                      <Typography variant="caption" color="textSecondary">
                        {blog.likesCount}
                      </Typography>
                    </Box>
                    
                    {activeTab === 'viewed' && blog.viewsCount !== undefined && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconEye size={14} color="#2196f3" />
                        <Typography variant="caption" color="textSecondary">
                          {blog.viewsCount}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconMessage size={14} color="#4caf50" />
                      <Typography variant="caption" color="textSecondary">
                        {blog.commentsCount}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Rank Badge */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: index < 3 ? '#ffd700' : '#e0e0e0',
                    color: index < 3 ? '#000' : '#666',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {index + 1}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TopBlogs; 