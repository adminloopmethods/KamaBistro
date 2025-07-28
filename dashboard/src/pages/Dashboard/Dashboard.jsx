// src/pages/Dashboard/DashboardLayout.jsx
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './component/Sidebar';

import Header from './component/Header';

const DashboardLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen h-screen px-4 pt-6 font-poppins bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 flex flex-col">
      <Header brand={"KAMA"} />

      <div className="flex flex-1 h-[100%] items-stretch overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-y-auto p-6 bg-stone-100 dark:bg-stone-900 text-black dark:text-white">
          <Outlet />
        </div>
      </div>
    </div>

  );
};

export default DashboardLayout;
