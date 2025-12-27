// hooks/useGoogleAuth.js
import { useState } from "react";
import { signIn } from "next-auth/react";

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signIn('google', { 
        redirect: false,
        callbackUrl: '/dashboard' 
      });
      
      if (result?.error) {
        setError(result.error);
        return {
          success: false,
          error: result.error,
          data: null,
        };
      }

      // If successful, result.url will contain the redirect URL
      if (result?.url) {
        return {
          success: true,
          error: null,
          data: { redirectUrl: result.url },
        };
      }

      // Fallback error
      setError("Authentication failed");
      return {
        success: false,
        error: "Authentication failed",
        data: null,
      };
    } catch (err) {
      const errorMsg = err.message || "Failed to authenticate with Google";
      setError(errorMsg);
      return {
        success: false,
        error: errorMsg,
        data: null,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    signInWithGoogle,
    loading,
    error,
  };
};