"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "@/hooks/useAuth";

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { user } = useAuth()
  
  const id = user._id
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match", {
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/update-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": id, // TODO: Replace with real user id from auth/session

        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      toast.success("Password changed successfully!", {
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.message, {
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500";
  const iconClass =
    "absolute right-3 top-2/3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div className="relative">
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Current Password
        </label>
        <input
          type={showCurrent ? "text" : "password"}
          id="currentPassword"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          className={inputClass}
          required
        />
        <span
          className={iconClass}
          onClick={() => setShowCurrent((v) => !v)}
          tabIndex={0}
        >
          {showCurrent ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
        </span>
      </div>

      <div className="relative">
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          New Password
        </label>
        <input
          type={showNew ? "text" : "password"}
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          className={inputClass}
          required
          minLength="6"
        />
        <span
          className={iconClass}
          onClick={() => setShowNew((v) => !v)}
          tabIndex={0}
        >
          {showNew ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
        </span>
      </div>

      <div className="relative">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Confirm New Password
        </label>
        <input
          type={showConfirm ? "text" : "password"}
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={inputClass}
          required
          minLength="6"
        />
        <span
          className={iconClass}
          onClick={() => setShowConfirm((v) => !v)}
          tabIndex={0}
        >
          {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
        </span>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-black text-white shadow-sm text-sm font-medium hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
