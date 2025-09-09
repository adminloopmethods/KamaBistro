"use client";

import React, {useState, useEffect} from "react";
import {toast} from "sonner";
import InputField from "@/app/_common/InputField";
import SubmitButton from "@/app/_common/SubmitButton";
import {
  forgotPasswordReq,
  forgotPasswordVerifyReq,
  forgotPasswordUpdateReq,
} from "@/functionality/fetch";
import getFingerPrint from "@/functionality/fingerprint";

const ForgotPassword: React.FC<{
  initialEmail: string;
  onBackToLogin: () => void;
}> = ({initialEmail, onBackToLogin}) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0); // Add cooldown state
  const [formData, setFormData] = useState({
    email: initialEmail,
    otp: "",
    new_password: "",
    repeat_password: "",
  });

  // Get device fingerprint
  React.useEffect(() => {
    const getDeviceId = async () => {
      const id = await getFingerPrint();
      setDeviceId(id);
    };
    getDeviceId();
  }, []);

  // Timer for resend cooldown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  // Function to check password strength
  const isPasswordStrong = (password: string): boolean => {
    // At least 8 characters, one uppercase, one lowercase, one number, and one special character
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  // Step 1: Send OTP to email
  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const response = await forgotPasswordReq({
        email: formData.email,
        deviceId,
        otpOrigin: "forgot_Pass",
      });

      if (response.ok) {
        toast.success("OTP sent to your email");
        setStep(2);
        setResendCooldown(60); // Start 60-second cooldown
      } else {
        throw new Error(response.message || "Failed to send OTP");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await forgotPasswordVerifyReq({
        email: formData.email,
        deviceId,
        otp: formData.otp,
        otpOrigin: "forgot_Pass",
      });

      if (response.ok) {
        toast.success("OTP verified successfully");
        setStep(3);
      } else {
        throw new Error(response.error || "OTP verification failed");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Update password
  const handleUpdatePassword = async () => {
    if (formData.new_password !== formData.repeat_password) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.new_password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    // Check password strength
    if (!isPasswordStrong(formData.new_password)) {
      toast.error(
        "Password is not strong enough. It must contain at least 8 characters, including uppercase, lowercase, number, and special character."
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await forgotPasswordUpdateReq({
        email: formData.email,
        deviceId,
        otpOrigin: "forgot_Pass",
        new_password: formData.new_password,
        repeat_password: formData.repeat_password,
      });

      if (response.ok) {
        toast.success("Password updated successfully!");
        setTimeout(() => onBackToLogin(), 2000);
      } else {
        throw new Error(response.message || "Password update failed");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800">
          {step === 1
            ? "Reset Your Password"
            : step === 2
            ? "Verify Your Identity"
            : "Create New Password"}
        </h1>
        <p className="text-gray-600 mt-2">
          {step === 1
            ? "Enter your email to receive a verification code"
            : step === 2
            ? "Check your email for the 6-digit code"
            : "Create a strong, new password"}
        </p>
      </div>

      {/* Step 1: Email Input */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border text-gray-700 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#AE9060]/50 focus:border-transparent transition-all shadow-sm"
            />
          </div>

          <SubmitButton
            isLoading={isLoading}
            onClick={handleSendOtp}
            label="Send Verification Code"
          />
        </div>
      )}

      {/* Step 2: OTP Verification */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Verification Code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              value={formData.otp}
              onChange={handleChange}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="w-full px-4 py-3 border text-gray-700 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#AE9060]/50 focus:border-transparent transition-all shadow-sm text-center text-lg font-semibold"
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back to Email
            </button>
            {resendCooldown > 0 ? (
              <span className="text-sm text-gray-500">
                Resend in {resendCooldown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-sm text-[#AE9060] hover:text-[#8a6e4b] transition-colors"
              >
                Resend Code
              </button>
            )}
          </div>

          <SubmitButton
            isLoading={isLoading}
            onClick={handleVerifyOtp}
            label="Verify Code"
          />
        </div>
      )}

      {/* Step 3: Password Update */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="relative">
            <label
              htmlFor="new_password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              id="new_password"
              name="new_password"
              type={showNewPassword ? "text" : "password"}
              value={formData.new_password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full px-4 py-3 border text-gray-700 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#AE9060]/50 focus:border-transparent transition-all shadow-sm pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 极a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 极11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w极.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                    clipRule="evenodd"
                  />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 8 characters with uppercase, lowercase, number,
              and special character
            </p>
          </div>

          <div className="relative">
            <label
              htmlFor="repeat_password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="repeat_password"
              name="repeat_password"
              type={showRepeatPassword ? "text" : "password"}
              value={formData.repeat_password}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 border text-gray-700 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#AE9060]/50 focus:border-transparent transition-all shadow-sm pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
            >
              {showRepeatPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4极" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14极14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 极a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                    clipRule="evenodd"
                  />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back to Verification
            </button>
          </div>

          <SubmitButton
            isLoading={isLoading}
            onClick={handleUpdatePassword}
            label="Update Password"
          />
        </div>
      )}

      <div className="mt-6 pt-5 border-t border-gray-100">
        <button
          onClick={onBackToLogin}
          className="w-full text-center text-sm text-[#AE9060] hover:text-[#8a6e4b] transition-colors"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
