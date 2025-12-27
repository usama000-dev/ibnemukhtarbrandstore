"use client";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import BorderSection from "../atom/BorderSection";

const ChangePasswordForm = ({ tokenn }) => {
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") setPassword(value);
    if (name === "cpassword") setCpassword(value);

    // Real-time matching check
    if (name === "password" || name === "cpassword") {
      if (value !== (name === "password" ? cpassword : password)) {
        setError("Passwords do not match");
      } else {
        setError(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== cpassword) {
      toast.error("Passwords do not match", {
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }

    setLoading(true);

    try {
      let senddata = {
        password,
        cpassword,
        sendmail: false,
        token: tokenn.toString(),
      };
      console.log("token added in body", senddata.token);

      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(senddata),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      toast.success("Password resets successfully!", {
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setPassword("");
      setCpassword("");
      if (response.ok) {
      
      }
    } catch (err) {
      toast.error(err.message, {
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 bg-gray-50">
       <Head>
        <title> New Password - CHAMPION-CHOICE</title>
        <meta
          name="description"
          content="YOU CAN ADD HERE YOUR NEW PASSWORD FOR AGAIN LOGIN CREDENTIAL SAVE IN YOUR ACCOUNT FOR BETTER EXPERICNCE"
        />
      </Head>
      <ToastContainer
        position="bottom-left"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />{" "}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
          Reset your password
          <BorderSection />
        </h2>
        <p className="hidden md:block mt-2 text-center text-sm text-gray-500">
          CHAMPIONCHOICE
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              minLength="6"
            />
          </div>

          <div>
            <label
              htmlFor="cpassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="cpassword"
              name="cpassword"
              value={cpassword}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              minLength="6"
            />
          </div>

          {error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : (
            password &&
            cpassword && (
              <p className="text-green-500 text-sm">Passwords match ✅</p>
            )
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 hover:bg-black/90 transition duration-300 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Want more info? Check our{" "}
          <a
            href="/privacy-policy"
            className="font-semibold text-[#DD8560] hover:text-[#DD8560]/90"
          >
            privacy policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
