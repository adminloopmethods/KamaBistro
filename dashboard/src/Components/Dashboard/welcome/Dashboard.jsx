import { useEffect } from "react"
// import { useTheme } from "../context/ThemeContext";
import { useTheme } from "../../../Context/ThemeContext";


function Dashboard() {
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        // const token = localStorage.getItem("token")
    }, [])
    return (
        <div className="bg-stone-400 dark:bg-stone-800">
            <h1>Dashboard</h1>
            <button onClick={toggleTheme} className="p-2 border rounded bg-gray-200 dark:bg-gray-800 dark:text-white">{theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}</button>
        </div>
    )
}

export default Dashboard