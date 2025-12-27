"use client";
import BorderSection from "@/components/atom/BorderSection";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignupPage() {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/");
    }
  }, [router]);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleChange = (e) => {
    if (e.target.name == "name") {
      setName(e.target.value);
    } else if (e.target.name == "email") {
      setEmail(e.target.value.toLowerCase());
    } else if (e.target.name == "password") {
      setPassword(e.target.value);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { name, email, password };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      localStorage.setItem("token", result.token);
      // console.log("Server response:", result);
      // Check for response status
      if (!res.ok || result.error) {
        toast.error(
          result.message || "Sorry! Some error occurred. Try again.",
          {
            autoClose: 1000,
            closeOnClick: true,
            pauseOnHover: true,
          }
        );
        return; // stop here
      }
      toast.success("Congrates! Your Account has been created", {
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      // Reset input fields
      setEmail("");
      setName("");
      setPassword("");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Sorry! Some Enternle error", {
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  const handleClose = () => {
    router.back(); // Go back to previous page
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 relative">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        aria-label="Close signup"
      >
        <IoClose className="w-6 h-6 text-gray-500" />
      </button>

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
      />
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="hidden md:block my-4 text-center text-xl font-bold tracking-tight text-gray-400">
          CHAMPIONCHOICE{" "}
        </h2>
        <h2 className="mt-10 text-center text-2xl/9 font-normal tracking-tight text-gray-900">
          <span>Sign in to your account</span>{" "}
        </h2>
        <p className=" text-center text-sm/6 text-gray-500">
          or
          <Link
            href="/login"
            className="font-semibold text-[#DD8560] hover:text-[#DD8560]/90"
          >
            {" "}
            log in
          </Link>
        </p>{" "}
        <BorderSection className="pt-3" />
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm/6 font-medium text-gray-900"
            >
              FULL NAME
            </label>
            <div className="mt-2">
              <input
                onChange={handleChange}
                value={name}
                type="name"
                name="name"
                id="name"
                placeholder="Usama"
                autoComplete="name"
                required
                className="block w-full border-b border-gray-200 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#DD8560] sm:text-sm/6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                onChange={handleChange}
                value={email}
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                placeholder="usama@gmail.com"
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
                onChange={handleChange}
                value={password}
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                className="block w-full border-b border-gray-200 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#DD8560] sm:text-sm/6"
              />
               <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </span>
            </div>
            
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-[#DD8560] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-[#DD8560] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DD8560]"
            >
              Sign up
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          if you want more detail this site then you chek our
          <a
            href="/privacy-policy"
            className="font-semibold text-[#DD8560] hover:text-[#DD8560]/90"
          >
            {" "}
            pricay policy
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
