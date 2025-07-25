import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../Dashboard/elem-dashboard/InputField';
import SubmitButton from '../Dashboard/elem-dashboard/SubmitButton';

import { loginReq } from '../../app/fetch';
import getFingerPrint from '../../app/fingerprint';
import BackroundImage from './utils/WelcomeImages';
import { toast, Toaster } from 'sonner';
import { toastWithUpdate } from '../../Functionality/toastWithUpdate';

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    deviceId: '',
    otpOrigin: 'MFA_Login',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await toastWithUpdate(() => loginReq(formData), {
        loading: "Logging in...",
        success: "Login Successful!",
        error: (err) => err.message || "Login failed",
      });
      if (response?.ok && response.token && response.user) {
        localStorage.setItem("token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))
        navigate("/")
      } else {
        throw new Error(response)
      }
    } catch (error) {
      console.error('Login Failed:', error);
    }
  };

  useEffect(() => {
    async function FP() {
      const deviceId = await getFingerPrint();
      setFormData((prev) => {
        return { ...prev, deviceId };
      });
    }
    FP();
  }, []);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    navigate("/");
  }
}, []);


  return (
    <div className="min-h-screen h-screen bg-base-200 flex items-center justify-center bg-[#AE9060]">
      <BackroundImage />
      <div className="flex h-full justify-center w-full sm:w-3/5 md:w-3/5 lg:w-3/5 xl:w-2/5 sm:px-20 md:px-20 lg:px-24 bg-base-200 shadow-[-1px_0px_10px_#00000080]">
        <div className="w-[24rem] flex flex-col items-center justify-center gap-8">
          <h2 className="text-2xl font-semibold mb-4 text-center dark:text-stone-900">Sign in to Dashboard</h2>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4 relative flex flex-col gap-4">
              <InputField
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              <InputField
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="mt-4"
              />
            </div>
            <div className="text-right text-sm text-stone-500 hover:text-stone-700 dark:hover:text-stone-50 mb-3">
              <span className="hover:underline hover:cursor-pointer">Forgot Password?</span>
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
