"use client";
import BorderSection from "@/components/atom/BorderSection";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") setEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let senddata = {
        sendmail: true,
        email,
      };
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(senddata),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed sent email ");
      }

      toast.success("email sent successfully! ", {
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setTimeout(() => {
        toast.success("Please check your email", {
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }, 1000);
      setEmail("");
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
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
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
        <h2 className="hidden md:block my-4 text-center text-xl font-bold tracking-tight text-gray-400">
          Chmapion-Choice{" "}
        </h2>
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Forgot your password <BorderSection newStyle={"w-[100px]"} />
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit} method="POST">
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
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                placeholder="usama@gmail.com"
                required
                className="block w-full border border-gray-200 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center bg-black px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-black/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              {" "}
              {loading ? "sending..." : "send email"}
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

export default ForgotPage;
