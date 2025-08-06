"use client"

import {
    createContext,
    useEffect,
    useState,
    useContext,
    ReactNode,
} from "react";

// Define the shape of the context
type ThemeContextType = {
    theme: "light" | "dark";
    toggleTheme: () => void;
};

// Create the context with an undefined default
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Define the props for the provider
type ThemeProviderProps = {
    children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("theme");
            return stored === "dark" ? "dark" : "light";
        }
        return "light";
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Custom hook to access the theme context
export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}