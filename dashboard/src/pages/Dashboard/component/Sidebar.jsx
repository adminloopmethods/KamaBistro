import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Activity,
  FileText,
  Users,
  Settings,ScrollText
} from "lucide-react";

const Sidebar = ({ }) => {
  const location = useLocation();

  const sidebarRoutes = [
    { name: "Dashboard", route: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Overview", route: "/overview", icon: <BarChart3 size={18} /> },
    { name: "Analytics", route: "/analytics", icon: <Activity size={18} /> },
    { name: "Pages", route: "/pages", icon: <FileText size={18} /> },
    { name: "Users", route: "/users", icon: <Users size={18} /> },
    { name: "Logs", route: "/logs", icon: <ScrollText size={18} /> },
  ];

  return (
    <div className="w-64  text-black p-4 bg-white dark:bg-gray-900 dark:text-white">
      <ul className="flex flex-col gap-2">
        {sidebarRoutes.map((element, i) => (
          <li key={i}>
            <Link
              to={element.route}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-stone-200 dark:hover:text-black transition ${location.pathname === element.route ? "bg-stone-200 dark:text-black" : ""
                }`}
            >
              {element.icon}
              {element.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
