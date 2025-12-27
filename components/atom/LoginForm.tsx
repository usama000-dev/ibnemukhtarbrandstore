"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import GoogleSignInButton from "./google/GoogleSignInButton";

export default function LoginForm({
  onSuccess,
  initialShowSignup = false,
}: {
  onSuccess?: () => void;
  initialShowSignup?: boolean;
}) {
  const [isSignup, setIsSignup] = useState(initialShowSignup);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "email" ? value.toLowerCase() : value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const result = await res.json();

      if (!res.ok || result.error) {
        toast.error(result.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("email", result.email); 
      toast.success(`Welcome back ${result.name.toUpperCase()}!`);
      onSuccess?.();
    } catch (err) {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();

      if (!res.ok || result.error) {
        toast.error(result.message || "Signup failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", result.token);
      toast.success("Account created successfully!");
      onSuccess?.();
    } catch (err) {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center px-6 py-2 lg:px-8">
      <div className="sm:mx-auto min-h-[100px] sm:w-full sm:max-w-sm">
        <h2 className="hidden md:block my-4 text-center text-sm font-bold tracking-tight text-gray-400">
          CHAMPIONCHOICE
        </h2>
        <h2 className="mt-1 text-center text-2xl/9 font-normal tracking-tight text-gray-900">
          {isSignup ? "Create your account" : "Sign in to your account"}
        </h2>
        <p className="text-center text-sm/6 text-gray-500">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="font-semibold text-[#DD8560] hover:text-[#DD8560]/90"
          >
            {isSignup ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          onSubmit={isSignup ? handleSignup : handleLogin}
          className="space-y-2"
        >
          {isSignup && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                FULL NAME
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="block w-full border-b border-gray-200 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#DD8560] sm:text-sm/6"
                />
              </div>
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="your@gmail.com"
                required
                className="block w-full border-b border-gray-200 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#DD8560] sm:text-sm/6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Password
            </label>
            <div className="mt-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password || ""}
                onChange={handleChange}
                title="Try defult password: 12345678"
                placeholder="12345678"
                required
                className="block w-full border-b border-gray-200 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#DD8560] sm:text-sm/6"
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {/* placeholder="••••••••" */}

                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </span>
            </div>
            {isSignup && (
              <p className="text-xs text-[#DD8560] mt-1">
                • Password must be at least 8 characters
              </p>
            )}
            {!isSignup && (
             <p className="text-xs text-[#DD8560] mt-1">
             • Try defult password: 12345678
           </p>
            )}
           {" "}
            <p className="text-xs text-[#DD8560] mt-1">
              • Don&apos;t share your Password
            </p>
          </div>
          <div>
            <LoadingButton
              suppressHydrationWarning={true}
              type="submit"
              loading={loading}
              className="!w-full !bg-[#DD8560] !text-white !py-1 !rounded-md !shadow-xs hover:!bg-[#DD8560] focus-visible:!outline-2 focus-visible:!outline-offset-2 focus-visible:!outline-[#DD8560]"
              variant="contained"
            >
              {isSignup ? "Sign up" : "Login"}
            </LoadingButton>
          </div>
          <p className="text-xs text-gray-500 text-center mt-1 p-0">or</p>
          <GoogleSignInButton />
        </form>

        {isSignup && (
          <p className="mt-10 text-center text-sm/6 text-gray-500">
            By signing up, you agree to our{" "}
            <Link
              href="/privacy-policy"
              className="font-semibold text-[#DD8560] hover:text-[#DD8560]/90"
            >
              privacy policy
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
