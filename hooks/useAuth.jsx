"use client";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoginModal from "../components/molecules/LoginModal";
import { cancelPendingRequests } from "@/services/api";
import { signOut } from "next-auth/react";

// Step 1: Create Context
const AuthContext = createContext();

// Step 2: AuthProvider with logout
function AuthProvider({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(undefined); // undefined means loading
  const [user, setUser] = useState(null);
  const [localToken, setLocalToken] = useState({ value: null });
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Pages where we SHOULD show login popup
  const allowedPages = ["/", "/admin", "/myaccount"];

  // Check if current page should show login popup
  const shouldShowLoginPopup = () => {
    // For home page, check exact match
    if (pathname === "/") {
      return true;
    }
    // For other pages, check if they start with allowed pages
    return allowedPages.some(
      (page) => pathname.startsWith(page) && page !== "/"
    );
  };

  useEffect(() => {
    console.log("useAuth useEffect started _____________");
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Error: (404) token not found");
      setIsAdmin(false);
      // Only show login modal on allowed pages after 10 seconds
      if (shouldShowLoginPopup()) {
        const timer = setTimeout(() => {
          setShowLoginModal(true);
        }, 10000);
        return () => clearTimeout(timer);
      }
      return;
    }
    console.log("useAuth say token founded _____________");

    setLocalToken({ value: token });
    console.log("useAuth say token set by localtoken _____________");

    const fetchUserRoll = async () => {
      console.log("useAuth say user fetching start _____________");

      try {
        const res = await fetch("/api/get-user", {
          method: "POST",
          body: JSON.stringify({ token }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await res.json();
        console.log("useAuth say user fetched _____________   ", result);
        if (result.error && result.error !== "Token expired") {
          toast.warn("Please login", {
            autoClose: 1000,
            position: "bottom-left",
            closeOnClick: true,
            pauseOnHover: true,
          });
          // Only show login modal on allowed pages after 10 seconds
          if (shouldShowLoginPopup()) {
            const timer = setTimeout(() => {
              setShowLoginModal(true);
            }, 10000);
            return () => clearTimeout(timer);
          }
          return;
        }
        if (result.error === "Token expired") {
          setIsAdmin(false);
          // Only show login modal on allowed pages after 10 seconds
          if (shouldShowLoginPopup()) {
            const timer = setTimeout(() => {
              setShowLoginModal(true);
            }, 10000);
            return () => clearTimeout(timer);
          }
          return;
        }
        if (result.user.roll !== "admin") {
          setIsAdmin(false);
        }
        setUser(result.user);
        if (result.user.roll == "admin") {
          setIsAdmin(true);
        }
        // Hide login modal if user is authenticated
        setShowLoginModal(false);
      } catch (error) {
        toast.error("Some internal error occour :", {
          position: "bottom-left",
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
        });
        // console.error("faild to fetch use roll", error);
        setIsAdmin(false);
        // Only show login modal on allowed pages after 10 seconds
        if (shouldShowLoginPopup()) {
          const timer = setTimeout(() => {
            setShowLoginModal(true);
          }, 10000);
          return () => clearTimeout(timer);
        }
      }
    };
    fetchUserRoll();
    console.log("useAuth say user fetching end _____________");

    return () => {
      cancelPendingRequests();
    };
  }, [pathname]);

  // ✅ Logout Function

  const logout = () => {
    // Clear local storage
    localStorage.clear();
    setLocalToken({ value: null });
  
    // Clear NextAuth session completely
    signOut({
      redirect: true,       // force NextAuth to kill session
      callbackUrl: "/",     // after logout redirect
    });
  
    toast.success("Logout Successfully!", {
      position: "bottom-left",
      autoClose: 1000,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };
  // Function to show login modal manually
  const showLogin = () => {
    setShowLoginModal(true);
  };

  // Function to hide login modal
  const hideLogin = () => {
    setShowLoginModal(false);
  };

  return (
    <AuthContext.Provider
      value={{
        localToken,
        logout,
        isAdmin,
        user,
        setUser,
        showLogin,
        hideLogin,
      }}
    >
      {children}
      <LoginModal open={showLoginModal} onClose={hideLogin} />
    </AuthContext.Provider>
  );
}

export default AuthProvider;

// Step 3: Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
