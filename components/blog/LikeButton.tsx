"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import LoginModal from "../molecules/LoginModal";
import { set } from "lodash";

interface Props {
  postId: string;
  initialLikes: String[];
}

export default function LikeButton({ postId, initialLikes }: Props) {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialLikes.includes(user?._id)) {
      setIsLiked(true);
    }
  }, [initialLikes]);

  const handleLike = async () => {
    // console.log('button is clicked!');
    if (!user) {
      toast.warn("Please login to like a post", {
        autoClose: 1000,
        position: "bottom-left",
        closeOnClick: true,
        pauseOnHover: true,
      });
      setShowLogin(true);
    }
    if (isLiked || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/blog/${postId}/like`, {
        method: "POST",
        body: JSON.stringify({ userId: user?._id }),
      });

      if (!response.ok) {
        throw new Error("Failed to like post");
      }

      const data = await response.json();
      setLikes(data.likes.length);
      setIsLiked(true);
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <button
        onClick={handleLike}
        disabled={isLoading || isLiked}
        className={`flex items-center cursor-pointer gap-2 px-4 py-2 transition-colors ${
          isLiked ? "text-red-600" : "text-gray-600"
        }`}
      >
        <svg
          className={`w-5 h-5 ${isLiked ? "fill-current" : "stroke-current"}`}
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span>{(!isLoading && likes?.length) || 0}</span>
      </button>
    </>
  );
}
