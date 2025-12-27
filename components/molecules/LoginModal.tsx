// components/auth/LoginModal.tsx
"use client";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import LoginForm from "../atom/LoginForm";
import { IoClose } from "react-icons/io5";

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [showSignupFirst, setShowSignupFirst] = useState(false);

  useEffect(() => {
    if (open) {
      // Check if token exists
      const token = localStorage.getItem("token");
      if (!token) {
        // No token - show signup first
        setShowSignupFirst(false);
      } else {
        // Token exists but might be expired - show login first
        setShowSignupFirst(false);
      }
    }
  }, [open]);

  return (
    <Dialog as="div" className="relative z-50" open={open} onClose={onClose}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <IoClose className="w-6 h-6 text-gray-500" />
          </button>
      
          <LoginForm onSuccess={onClose} initialShowSignup={showSignupFirst} />
        </DialogPanel>
      </div>
    </Dialog>
  );
}
