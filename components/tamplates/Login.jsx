"use client";
import BorderSection from "@/components/atom/BorderSection";
import { LoadingButton } from "@mui/lab";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    if (e.target.name == "email") {
      setEmail(e.target.value.toLowerCase());
    } else if (e.target.name == "password") {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = { email, password };
    // console.log(data);

    try {
      // console.log("enter try block");

      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      // console.log(result, "result");

      // Check for response status
      if (!res.ok || result.error) {
        setLoading(false);
        toast.error(result.message || "Sorry! Some error occurred. Try again.");
        return; // stop here
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("email", result.email);
      toast.success(`Welcome! Back ${result.name.toUpperCase()}. `, {
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      // Reset input
      setEmail("");
      setPassword("");
      setLoading(false);
      if (result.roll == "user") {
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else if (result.roll == "admin") {
        router.push("/admin");
      }
    } catch (error) {
      console.error("login error:", error);
      toast.error("Sorry! Some Enternle error", {
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setLoading(false);
    }
    setLoading(false);
  };

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 relative">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#DD8560] focus:ring-offset-2"
        aria-label="Close login form"
      >
        <IoClose size={24} className="text-gray-600" />
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
          Sign in to your account{" "}
        </h2>
        <p className=" text-center text-sm/6 text-gray-500">
          or
          <Link
            href="/signup"
            className="font-semibold text-[#DD8560] hover:text-[#DD8560]/90"
          >
            {" "}
            sign up
          </Link>
        </p>{" "}
        <BorderSection className="pt-3" />
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
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
                placeholder="usama@gmail.com"
                name="email"
                id="email"
                autoComplete="email"
                required
                className="block w-full border-b border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#DD8560] sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <Link
                  href={"/forgot"}
                  className="font-semibold text-[#DD8560] hover:text-[#DD8560]/90"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2 relative">
              <input
                onChange={handleChange}
                value={password}
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                autoComplete="current-password"
                required
                className="block w-full border-b border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#DD8560] sm:text-sm/6"
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
            <LoadingButton
              variant="contained"
              loading={loading}
              type="submit"
              className="!w-full !bg-[#DD8560] !px-3 !py-1.5 !text-sm !font-semibold !text-white hover:!bg-[#DD8560]/90 focus-visible:!outline-[#DD8560]"
            >
              LOGIN
            </LoadingButton>
          </div>
        </form>
        <p className="mt-6 mb-2 text-start text-sm/6 text-gray-500">
          or create account
        </p>
        <div>
          <LoadingButton
            href="/signup"
            variant="contained"
            loading={loading}
            className="!w-full !bg-[#DD8560] !px-3 !py-1.5 !text-sm !font-semibold !text-white hover:!bg-[#DD8560]/90 focus-visible:!outline-[#DD8560]"
          >
            CREATE ACCOUNT
          </LoadingButton>
        </div>
        <p className="mt-10 text-center text-sm/6 text-gray-500">
          if you want more detail this site then you chek our
          <a
            href="#"
            className="font-semibold text-[#DD8560] hover:[#DD8560]/90"
          >
            {" "}
            pricay policy
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
