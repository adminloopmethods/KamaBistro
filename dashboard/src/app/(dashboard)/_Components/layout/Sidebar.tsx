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
    {name: "Dashboard", route: "/", icon: <LayoutDashboard size={18} />},
    {
      name: "Overview",
      route: "/overview",
      icon: <BarChart3 size={18} />,
    },
    {
      name: "Analytics",
      route: "/analytics",
      icon: <Activity size={18} />,
    },
    {name: "Pages", route: "/pages", icon: <FileText size={18} />},
    {name: "Users", route: "/users", icon: <Users size={18} />},
    {name: "Logs", route: "/logs", icon: <ScrollText size={18} />},
  ];

  return (
    <div className="w-64 h-full flex flex-col text-black p-4 m-1 shadow rounded-lg bg-white dark:bg-gray-900 dark:text-white">
      <ul className="flex flex-col gap-2 flex-1">
        {sidebarRoutes.map((element, i) => (
          <li key={i}>
            <Link
              href={element.route}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-stone-200 dark:hover:text-black transition ${
                pathname.startsWith(element.route)
                  ? "bg-stone-200 dark:text-black"
                  : ""
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
