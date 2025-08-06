"use client"

import React, { useEffect, useState, useRef } from "react";
import {
    Moon,
    SunMedium,
    BellRing,
    UserCircle,
    ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/Context/ThemeContext";

type User = {
    name: string;
    email: string;
};

type HeaderProps = {
    brand: string;
};

const Header: React.FC<HeaderProps> = ({ brand }) => {
    const router = useRouter()
    const { theme, toggleTheme } = useTheme();
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
                // localStorage.clear();
                // router.push("/login");
            }
        } else {
            // localStorage.clear();
            // router.push("/login");
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
        // router.push("/login");
    };

    return (
        <header className="rounded-[16px_16px_0px_0px] px-4 py-5 bg-stone-200 dark:bg-gray-900 flex items-center justify-between">
            <h1 className="text-xl dark:text-white font-bold gradient-clipped pl-8">{brand} CMS</h1>

            <div className="flex items-center gap-4">
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    aria-label="Toggle Theme"
                >
                    {theme === "light" ? (
                        <Moon className="text-gray-800" />
                    ) : (
                        <SunMedium className="text-white" />
                    )}
                </button>

                {/* Notifications */}
                <button
                    className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    aria-label="Notifications"
                >
                    <BellRing className="text-gray-800 dark:text-white" />
                </button>

                {/* Profile section */}
                <div
                    ref={profileRef}
                    className="relative flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition max-w-[298px] cursor-pointer"
                    onClick={() => setDropDown((prev) => !prev)}
                >
                    <UserCircle className="w-8 h-8 text-gray-600 dark:text-white" />
                    <div className="text-sm leading-tight">
                        <p className="font-medium text-gray-900 dark:text-white">
                            {user?.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            {user?.email}
                        </p>
                    </div>
                    <ChevronDown className="w-5 text-gray-600 dark:text-white" />

                    {/* Dropdown */}
                    {dropDown && (
                        <div className="absolute right-0 top-[60px] w-40 bg-white dark:bg-gray-800 shadow-[1px_1px_5px_#80808080] rounded-md py-2 z-50">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default React.memo(Header);
