"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function FakePurchaseNotifications() {
  const { isAdmin } = useAuth()

  const timeoutRef = useRef(null);
  const activityTimerRef = useRef(null);
  const isActiveRef = useRef(true);
  const isAdminRef = useRef(false);

  const fakePurchases = [
    {
      name: "Ahmed from Karachi",
      product: "Taekwondo Uniform",
      time: "1 minute ago",
      emoji: "🥋"
    },
    {
      name: "Fatima from Lahore",
      product: "Taekwondo Hogos",
      time: "2 minutes ago",
      emoji: "🥋"
    },
    {
      name: "Muhammad from Islamabad",
      product: "MMA Gloves",
      time: "2 minutes ago",
      emoji: "🥊"
    },
    {
      name: "Ayesha from Faisalabad",
      product: "Hoodie",
      time: "3 minutes ago",
      emoji: "👕"
    },
    {
      name: "Usman from Multan",
      product: "T-Shirt",
      time: "3 minutes ago",
      emoji: "👕"
    },
    {
      name: "Sara from Peshawar",
      product: "Taekwondo Uniform",
      time: "4 minutes ago",
      emoji: "🥋"
    },
    {
      name: "Ali from Quetta",
      product: "Karate Belt",
      time: "4 minutes ago",
      emoji: "🥋"
    },
    {
      name: "Hina from Sialkot",
      product: "Mug",
      time: "5 minutes ago",
      emoji: "☕"
    },
    {
      name: "Bilal from Gujranwala",
      product: "Stickers",
      time: "5 minutes ago",
      emoji: "🏷️"
    },
    {
      name: "Nadia from Rawalpindi",
      product: "Hoodie",
      time: "6 minutes ago",
      emoji: "👕"
    },
    {
      name: "Zain from Hyderabad",
      product: "Taekwondo Gears",
      time: "1 minute ago",
      emoji: "🥊"
    },
    {
      name: "Aisha from Sukkur",
      product: "Taekwondo Uniform",
      time: "2 minutes ago",
      emoji: "🥋"
    },
    {
      name: "Hassan from Bahawalpur",
      product: "Karate Belt",
      time: "2 minutes ago",
      emoji: "🥋"
    },
    {
      name: "Mariam from Abbottabad",
      product: "T-Shirt",
      time: "3 minutes ago",
      emoji: "👕"
    },
    {
      name: "Omar from Jhang",
      product: "Hoodie",
      time: "3 minutes ago",
      emoji: "👕"
    },
    {
      name: "Layla from Sahiwal",
      product: "Taekwondo Mug",
      time: "4 minutes ago",
      emoji: "☕"
    },
    {
      name: "Khalid from Okara",
      product: "Stickers",
      time: "4 minutes ago",
      emoji: "🏷️"
    },
    {
      name: "Yasmin from Rahim Yar Khan",
      product: "Taekwondo Uniform",
      time: "5 minutes ago",
      emoji: "🥋"
    },
    {
      name: "Tariq from Dera Ghazi Khan",
      product: "Taekwondo Uniforms",
      time: "5 minutes ago",
      emoji: "🥋"
    },
    {
      name: "Noor from Sargodha",
      product: "Taekwondo Shirts",
      time: "6 minutes ago",
      emoji: "🥋"
    }
  ];

  // Check if user is admin
  const checkIfAdmin = () => {
    isAdminRef.current = isAdmin;
    return isAdmin;
  };

  // Reset activity timer
  const resetActivityTimer = () => {
    if (activityTimerRef.current) {
      clearTimeout(activityTimerRef.current);
    }

    // Set user as active
    isActiveRef.current = true;

    // Set timer for 20 seconds of inactivity (reduced from 30)
    activityTimerRef.current = setTimeout(() => {
      isActiveRef.current = false;
      pauseNotifications();
    }, 20000); // 20 seconds
  };

  // Pause notifications
  const pauseNotifications = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Resume notifications
  const resumeNotifications = () => {
    if (isActiveRef.current && !isAdminRef.current) {
      scheduleNextNotification();
    }
  };

  // Show notification
  const showNotification = () => {
    // Don't show if user is admin or inactive
    if (isAdminRef.current || !isActiveRef.current) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * fakePurchases.length);
    const purchase = fakePurchases[randomIndex];

    toast.success(
      <div className="flex items-center gap-3">
        <div className="text-2xl">{purchase.emoji}</div>
        <div className="flex-1">
          <div className="font-semibold text-sm text-gray-800">
            {purchase.name} just bought {purchase.product}
          </div>
          <div className="text-xs text-gray-500 mt-1">{purchase.time}</div>
        </div>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      </div>,
      {
        position: "top-center",
        autoClose: 1000, // Increased from 4000
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        style: {
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          color: "black",
          border: "2px solid #10b981",
          borderRadius: "12px",
          boxShadow: "0 8px 25px rgba(16, 185, 129, 0.2)",
          minWidth: "320px",
          fontSize: "14px",
          fontWeight: "500"
        }
      }
    );

    // Schedule next notification
    scheduleNextNotification();
  };

  // Schedule next notification
  const scheduleNextNotification = () => {
    if (isAdminRef.current || !isActiveRef.current) {
      return;
    }

    // Random delay between 8-15 seconds (reduced from 15-30)
    const randomDelay = Math.random() * 10000 + 20000; // 20–30 seconds
    timeoutRef.current = setTimeout(showNotification, randomDelay);
  };

  useEffect(() => {
    // Check if user is admin
    checkIfAdmin();

    // Don't start notifications if user is admin
    if (isAdminRef.current) {
      return;
    }

    // Set up page visibility detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched tabs - pause notifications
        pauseNotifications();
      } else {
        // User came back - resume notifications
        resetActivityTimer();
        resumeNotifications();
      }
    };

    // Set up user activity detection
    const handleUserActivity = () => {
      resetActivityTimer();
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('mousemove', handleUserActivity);
    document.addEventListener('click', handleUserActivity);
    document.addEventListener('scroll', handleUserActivity);
    document.addEventListener('keydown', handleUserActivity);

    // Start activity timer
    resetActivityTimer();

    // Show first notification after 5 seconds (reduced from 10)
    timeoutRef.current = setTimeout(showNotification, 5000);

    // Cleanup function
    return () => {
      // Remove event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('mousemove', handleUserActivity);
      document.removeEventListener('click', handleUserActivity);
      document.removeEventListener('scroll', handleUserActivity);
      document.removeEventListener('keydown', handleUserActivity);

      // Clear timers
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
      }
    };
  }, [checkIfAdmin, resetActivityTimer, resumeNotifications, showNotification]);

  return null; // This component doesn't render anything visible
} 