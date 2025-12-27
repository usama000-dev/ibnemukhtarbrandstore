// components/GoogleSignInButton.js
"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function GoogleSignInButton() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signIn("google", { redirect: false });
    } catch (err) {
      console.error("❌ Google Sign-In Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.accessToken) {
      // Save token in localStorage
      localStorage.setItem("token", session.user.accessToken);
      localStorage.setItem("email", session.user.email);

      // Redirect based on role
      if (session.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    }
  }, [session]);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed w-full"
      >
        {loading ? (
          <span className="animate-spin h-5 w-5 border-2 border-t-transparent border-red-500 rounded-full"></span>
        ) : (
          <>
            <Image
              src="/images/google-icon.png"
              alt="Google"
              width={20}
              height={20}
            />
            <span className="text-xs">Continue with Google</span>
          </>
        )}
      </button>
    </div>
  );
}
