"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LatestBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch("/api/blogs?limit=3");
                const data = await res.json();
                setBlogs(data.blogs || []);
            } catch (error) {
                console.error("Error fetching blogs:", error);
                setBlogs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    if (loading) {
        return (
            <section className="py-8 md:py-12 bg-white px-4">
                <div className="container mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800">
                        Latest from Our Blog
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
                                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                                <div className="bg-gray-200 h-3 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!blogs || blogs.length === 0) {
        return null; // Don't show section if no blogs
    }

    return (
        <section className="py-8 md:py-12 bg-white px-4">
            <div className="container mx-auto">
                <div className="text-center mb-6 md:mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
                        Latest from Our Blog
                    </h2>
                    <p className="text-sm md:text-base text-gray-600">
                        Tips, trends, and style guides for winter fashion
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                    {blogs.slice(0, 3).map((blog) => (
                        <Link
                            key={blog._id}
                            href={`/blog/${blog.slug}`}
                            className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                        >
                            {/* Blog Image */}
                            <div className="relative h-48 md:h-56 overflow-hidden bg-gray-200">
                                {blog.image ? (
                                    <Image
                                        src={blog.image}
                                        alt={blog.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                                        <span className="text-4xl">📝</span>
                                    </div>
                                )}
                            </div>

                            {/* Blog Content */}
                            <div className="p-4">
                                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {blog.title}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">
                                    {blog.metaDescription || blog.excerpt || "Read more..."}
                                </p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>
                                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>
                                    <span className="text-blue-600 group-hover:underline">
                                        Read More →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View All Link */}
                <div className="text-center mt-6 md:mt-8">
                    <Link
                        href="/blog"
                        className="inline-block text-sm md:text-base text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                        View All Blog Posts →
                    </Link>
                </div>
            </div>
        </section>
    );
}
