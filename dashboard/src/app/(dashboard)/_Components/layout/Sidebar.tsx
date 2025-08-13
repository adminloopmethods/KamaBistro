// sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Activity,
  FileText,
  Users,
  Settings,
  ScrollText,
} from "lucide-react";

type SidebarRoute = {
  name: string;
  route: string;
  icon: React.ReactNode;
};

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const sidebarRoutes: SidebarRoute[] = [
    {name: "Dashboard", route: "/", icon: <LayoutDashboard size={20} />},
    {
      name: "Overview",
      route: "/overview",
      icon: <BarChart3 size={20} />,
    },
    {
      name: "Analytics",
      route: "/analytics",
      icon: <Activity size={20} />,
    },
    {name: "Pages", route: "/pages", icon: <FileText size={20} />},
    {name: "Users", route: "/users", icon: <Users size={20} />},
    {name: "Logs", route: "/logs", icon: <ScrollText size={20} />},
    {name: "Settings", route: "/settings", icon: <Settings size={20} />},
  ];

  return (
    <div className="w-64 flex flex-col text-white p-6 bg-gradient-to-b from-indigo-900 to-purple-900 rounded-xl shadow-lg">
      <ul className="flex flex-col gap-1 flex-1">
        {sidebarRoutes.map((element, i) => {
          // Fixed active state detection
          const isActive =
            element.route === "/"
              ? pathname === "/"
              : pathname.startsWith(element.route);

          return (
            <li key={i}>
              <Link
                href={element.route}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-white/20 backdrop-blur-sm shadow-inner"
                    : "hover:bg-white/10"
                }`}
              >
                <span
                  className={`${isActive ? "text-white" : "text-indigo-200"}`}
                >
                  {element.icon}
                </span>
                <span className="font-medium">{element.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
