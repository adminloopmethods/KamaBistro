"use client";

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import getFingerPrint from "@/functionality/fingerprint";
import BackroundImage from "../utils/WelcomeImage";
import {toast, Toaster} from "sonner";
import InputField from "@/app/_common/InputField";
import SubmitButton from "@/app/_common/SubmitButton";
import {toastWithUpdate} from "@/functionality/ToastWithUpdate";
import {loginReq} from "@/functionality/fetch";
import ForgotPassword from "../forgotPassword/page";

type FormData = {
  email: string;
  password: string;
  deviceId: string;
  otpOrigin: string;
};

const Login: React.FC = () => {
  const router = useRouter(); // replaces useNavigate
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    deviceId: "",
    otpOrigin: "MFA_Login",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const response = await toastWithUpdate(() => loginReq(formData), {
        loading: "Logging in...",
        success: "Login Successful!",
        error: (err: any) => err?.message || "Login failed",
      });

      if (response?.ok && response.token && response.user) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        setTimeout(() => {
          router.push("/"); // Next.js navigation
        }, 1000);
      } else {
        console.error("Unexpected login response:", response);
        throw new Error(response?.error || "Login failed");
      }
    } catch (error) {
      console.error("Login Failed:", error);
    }
  };

  useEffect(() => {
    const setDeviceId = async () => {
      const deviceId = await getFingerPrint();
      setFormData((prev) => ({...prev, deviceId}));
    };
    setDeviceId();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/"); // Next.js navigation
    }
  }, [router]);

  return (
    <div className="min-h-screen h-screen bg-base-200 flex items-center justify-center bg-[#AE9060] ">
      <BackroundImage />
      {/* Form Section - Center aligned */}
      <div className=" w-[40%] flex items-center justify-center p-4 lg:p-8">
        {showForgotPassword ? (
          <ForgotPassword
            initialEmail={formData.email}
            onBackToLogin={() => setShowForgotPassword(false)}
          />
        ) : (
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all duration-300">
            <div className="mb-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-[#AE9060]/10 p-3 rounded-full">
                  <div className="bg-[#AE9060]/20 p-2 rounded-full">
                    <div className="bg-[#AE9060] p-2 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Sign in to Dashboard
              </h1>
              <p className="text-gray-600">
                Access your personalized workspace
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#AE9060]/50 focus:border-transparent transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border text-gray-700 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#AE9060]/50 focus:border-transparent transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end items-center">
                {/* <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#AE9060] focus:ring-[#AE9060] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div> */}

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm font-medium text-[#AE9060] hover:text-[#8a6e4b] transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 bg-[#AE9060] text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:ring-2 focus:ring-[#AE9060]/50 focus:ring-offset-2 ${
                  isLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-[#9c7d52]"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <div className="mt-8 pt-5 border-t border-gray-100">
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  className="font-medium text-[#AE9060] hover:text-[#8a6e4b] transition-colors"
                  onClick={() =>
                    toast.info("Contact admin to create an account")
                  }
                >
                  Request access
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default Login;
