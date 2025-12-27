"use client";
import BorderSection from "@/components/atom/BorderSection";
import LoadingComponent from "@/components/atom/LoadingComponent";
import ChangePasswordForm from "@/components/organism/ChangePasswordForm";
import NotificationsTab from "@/components/organism/NotificationsTab";
import OrdersTab from "@/components/organism/OrderTab";
import ProfileTab from "@/components/organism/ProfileTab";
import SettingsTab from "@/components/organism/SettingsTab";
// New Import
import StudioTab from "@/components/organism/StudioTab";

import { useAuth } from "@/hooks/useAuth";
import { cancelPendingRequests } from "@/services/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiBell,
  FiLogOut,
  FiSettings,
  FiShoppingBag,
  FiUser,
  FiVideo, // Imported Icon
} from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

const MyAccountPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Fetch user profile
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );
        if (userRes.error) router.push("/login");
        if (!userRes.ok) throw new Error("Failed to fetch user data");
        const userData = await userRes.json();
        setUser(userData.user);

        // Fetch orders
        const ordersRes = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/get-orders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData.orders || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    } else {
      router.push("/login");
    }
    return () => {
      cancelPendingRequests();
    };
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading || !user) {
    return <LoadingComponent />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab user={user} setUser={setUser} />;
      case "studio": // New Case
        return <StudioTab />;
      case "orders":
        return <OrdersTab orders={orders} />;
      case "notifications":
        return <NotificationsTab />;
      case "settings":
        return <SettingsTab />;
      case "ChangePasswordForm":
        return <ChangePasswordForm />;
      default:
        return;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl text-center font-normal text-gray-900 mb-8">
          My Account
        </h1>
        <BorderSection className="-mt-4" />
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow p-4 h-fit">
            <div className="flex flex-row md:flex-col items-center gap-3 mb-6 p-2 border-b pb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <FiUser className=" text-gray-600 text-xl" />
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-left ${activeTab === "profile"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <FiUser className="text-lg" />
                <span>Profile</span>
              </button>

              {/* New Studio Button */}
              <button
                onClick={() => setActiveTab("studio")}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-left ${activeTab === "studio"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <FiVideo className="text-lg" />
                <span>My Studio</span>
              </button>

              <button
                onClick={() => setActiveTab("ChangePasswordForm")}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-left ${activeTab === "ChangePasswordForm"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <FiSettings className="text-lg" />
                <span>Reset Password</span>
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-left ${activeTab === "orders"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <FiShoppingBag className="text-lg" />
                <span>My Orders</span>
                {orders.length > 0 && (
                  <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {orders.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-left ${activeTab === "notifications"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <FiBell className="text-lg" />
                <span>Notifications</span>
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-left ${activeTab === "settings"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <FiSettings className="text-lg" />
                <span>Settings</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-left text-[#DD8560] hover:bg-[#DD8560] hover:text-white mt-4"
              >
                <FiLogOut className="text-lg" />
                <span>Logout</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
