import React, { useState } from "react";
import { Moon, SunMedium, BellRing, UserCircle, ChevronDown } from "lucide-react";
import { useTheme } from "../../../Context/ThemeContext";

const Header = ({ brand }) => {
    const { theme, toggleTheme } = useTheme();
    const [dropDown, setDropDown] = useState(false);

    // You can replace these with actual user data from props or context
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
    };

    return (
        <header className="rounded-[16px_16px_0px_0px] px-4 py-5 bg-white dark:bg-gray-900 flex items-center justify-between">
            <h1 className="text-xl font-bold gradient-clipped pl-8">{brand} CMS</h1>

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
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <UserCircle className="w-8 h-8 text-gray-600 dark:text-white" />
                    <div className="text-sm leading-tight">
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                    <span>
                        <ChevronDown className="w-5 text-gray-600 dark:text-white" />
                    </span>
                    <div style={{ display: dropDown ? "block" : "none" }}
                        className={""}
                    >

                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
