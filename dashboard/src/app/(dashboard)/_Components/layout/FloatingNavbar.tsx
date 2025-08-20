"use client";
import React from "react";
// import {Home, Bell, Settings, HelpCircle, Shield, User} from "lucide-react";
import {
  LayoutDashboard,
  BarChart3,
  Activity,
  FileText,
  Users,
  Settings,
  ScrollText,
  Logs,
} from "lucide-react";
import {ExpandedTabs} from "@/components/ui/expanded-tabs";
const tabs = [
  {title: "Dashboard", path: "/", icon: LayoutDashboard},
  // {title: "Overview", path: "overview", icon: BarChart3},
  // {type: "separator" as const},
  // {title: "Analytics", path: "/analytics", icon: Activity},
  {title: "Users", path: "/users", icon: Users},
  {title: "Pages", path: "/pages", icon: FileText},
  {title: "Logs", path: "/logs", icon: Logs},
  // {title: "Settings", path: "/settings", icon: Settings},
];

const FloatingNavbar = () => {
  return (
    <div>
      {" "}
      <ExpandedTabs tabs={tabs} />
    </div>
  );
};

export default FloatingNavbar;
