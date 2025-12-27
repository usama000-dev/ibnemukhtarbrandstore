"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import { useAuth } from "../../hooks/useAuth";

const DropDownMenue = () => {
  const { logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex w-full justify-center gap-x-1.5 rounded-full bg-white px-2 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
          id="menu-button"
        >
          <MdAccountCircle size={20} />
        </button>
      </div>
      {isOpen && (
        <div
          className=" absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
          role="menu"
        >
          <div className="" role="none">
            <Link
              href="/myaccount"
              className="block px-4 pt-3 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              My Account
            </Link>
            <Link
              href="/orders"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              My Orders
            </Link>
            {isAdmin === "admin" && (
              <Link
                href="/admin"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Dashboard
              </Link>
            )}
            <button
              type="button"
              className="block w-full px-4 pb-3 text-left text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              onClick={logout}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default DropDownMenue;
