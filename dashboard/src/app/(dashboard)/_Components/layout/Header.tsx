"use client";
import React, {useEffect, useState, useRef} from "react";
import {
  Moon,
  SunMedium,
  BellRing,
  UserCircle,
  ChevronDown,
  Search,
} from "lucide-react";
import {useRouter} from "next/navigation";
import {ThemeToggleButton} from "@/components/ui/theme-toggle-button";
import {Router} from "next/router";
import Image from "next/image";
import logo from "@/assets/brand/kamalogo.png";
// import {useTheme} from "@/Context/ThemeContext";
// import ThemeToggleButton from "@/components/ui/theme-toggle-button";
// import ThemeToggleButton from "@components/ui/theme-toggle-button";

type User = {
  name: string;
  email: string;
};

type HeaderProps = {
  brand: string;
};

const Header: React.FC<HeaderProps> = ({brand}) => {
  const router = useRouter();
  // const {theme, toggleTheme} = useTheme();
  const [dropDown, setDropDown] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.clear();
        router.push("/login");
      }
    } else {
      localStorage.clear();
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 rounded-b-xl px-6 py-4 bg-white dark:bg-gray-800 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-6">
        {/* <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {brand} CMS

        </h1> */}
        <Image src={logo} width={150} alt="kama_logo" />

        {/* <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-full text-sm bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
          />
        </div> */}
      </div>

      <div className="flex items-center gap-4">
        {/* Theme toggle */}

        <ThemeToggleButton
          variant="circle"
          //  start="top-left"
          // showLabel={false}
        />

        {/* Notifications */}
        <button
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition relative"
          aria-label="Notifications"
        >
          <BellRing className="text-gray-700 dark:text-gray-300 w-5 h-5" />
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </button>

        {/* Profile section */}
        <div
          ref={profileRef}
          className="relative flex items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
          onClick={() => setDropDown((prev) => !prev)}
        >
          <div className="bg-indigo-500 w-9 h-9 rounded-full flex items-center justify-center text-white font-medium">
            {user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("") || "U"}
          </div>
          {/* <div className="text-sm leading-tight hidden lg:block">
            <p className="font-medium text-gray-900 dark:text-white">
              {user?.name}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {user?.email}
            </p>
          </div> */}
          <ChevronDown
            className={`w-5 text-gray-600 dark:text-gray-300 transition-transform ${
              dropDown ? "rotate-180" : ""
            }`}
          />

          {/* Dropdown */}
          {dropDown && (
            <div className="absolute right-0 top-14 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <p className="font-medium text-gray-900 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => router.push("/profile")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Profile Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Notification Settings
                </button>
              </div>
              <div className="py-1 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
