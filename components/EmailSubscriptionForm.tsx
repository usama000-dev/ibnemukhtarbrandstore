"use client";

import { useState } from "react";

interface EmailSubscriptionFormProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  className?: string;
  onSuccess?: (email: string) => void;
  onError?: (error: string) => void;
}

export default function EmailSubscriptionForm({
  title = "Stay Updated!",
  description = "Get notified about exclusive deals and flash sales",
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  className = "",
  onSuccess,
  onError,
}: EmailSubscriptionFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address");
      onError?.("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      onError?.("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/email/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "manual",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(
          "Successfully subscribed! Check your email for confirmation."
        );
        setEmail("");
        onSuccess?.(email);
      } else {
        setMessage(data.error || "Failed to subscribe. Please try again.");
        onError?.(data.error || "Failed to subscribe");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      onError?.("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white ${className}`}
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-blue-100">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            suppressHydrationWarning={true}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-4 py-3 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            disabled={loading}
          />
          <button
            suppressHydrationWarning={true}
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Subscribing..." : buttonText}
          </button>
        </div>

        {message && (
          <div
            className={`text-sm text-center p-2 rounded ${
              message.includes("Successfully")
                ? "bg-green-500 bg-opacity-20 text-green-100"
                : "bg-red-500 bg-opacity-20 text-red-100"
            }`}
          >
            {message}
          </div>
        )}

        <p className="text-xs text-blue-200 text-center">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </div>
  );
}
