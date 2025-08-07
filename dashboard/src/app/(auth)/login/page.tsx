"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getFingerPrint from "@/functionality/fingerprint";
import BackroundImage from "../utils/WelcomeImage";
import { toast, Toaster } from "sonner";
import InputField from "@/app/_common/InputField";
import SubmitButton from "@/app/_common/SubmitButton";
import { toastWithUpdate } from "@/functionality/ToastWithUpdate";
import { loginReq } from "@/functionality/fetch";

type FormData = {
  email: string;
  password: string;
  deviceId: string;
  otpOrigin: string;
};

const Login: React.FC = () => {
  const router = useRouter(); // replaces useNavigate
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    deviceId: "",
    otpOrigin: "MFA_Login",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      setFormData((prev) => ({ ...prev, deviceId }));
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
      <div className="flex h-full justify-center w-full sm:w-3/5 md:w-3/5 lg:w-3/5 xl:w-2/5 sm:px-20 md:px-20 lg:px-24 bg-base-200 shadow-[-1px_0px_10px_#00000080]">
        <div className="w-[24rem] flex flex-col items-center justify-center gap-8">
          <h2 className="text-2xl font-semibold mb-4 text-center dark:text-stone-900">
            Sign in to Dashboard
          </h2>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4 relative flex flex-col gap-4 text-sm text-[black]">
              <InputField
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                label="Email"
              />
              <InputField
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                label="Password"
                className="mt-4"
              />
            </div>
            <div className="text-right text-sm text-stone-500 hover:text-stone-700 dark:hover:text-stone-50 mb-3">
              <span className="hover:underline hover:cursor-pointer">
                Forgot Password?
              </span>
            </div>
            <SubmitButton
              label="Login"
              onClick={handleSubmit}
              className="rounded-md text-[1rem] w-full h-[2.3rem] btn-primary text-[white] bg-stone-700 hover:bg-[#661ae6] border-none"
            />
          </form>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default Login;
