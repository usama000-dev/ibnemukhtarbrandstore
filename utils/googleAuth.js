// lib/utils/googleAuth.js
import { signIn } from "next-auth/react";

/**
 * Reusable function to handle Google authentication
 * @returns {Promise<{success: boolean, error: string|null, data: object|null}>}
 */
export const continueWithGoogle = async () => {
  try {
    // Initiate Google authentication
    const result = await signIn("google", {
      redirect: false,
      callbackUrl: "/dashboard", // Change to your desired redirect URL
    });

    if (result?.error) {
      console.error("Google authentication error:", result.error);
      return {
        success: false,
        error: result.error,
        data: null,
      };
    }

    // If successful, result.url will contain the redirect URL
    if (result?.url) {
      // You can redirect here or let the component handle it
      return {
        success: true,
        error: null,
        data: { redirectUrl: result.url },
      };
    }

    // Fallback error
    return {
      success: false,
      error: "Authentication failed",
      data: null,
    };
  } catch (error) {
    console.error("Google auth unexpected error:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
      data: null,
    };
  }
};