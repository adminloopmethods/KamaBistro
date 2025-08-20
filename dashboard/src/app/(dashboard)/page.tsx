"use client";
import React from "react";
import {
  Users,
  FileText,
  BarChart3,
  Settings,
  Plus,
  ChevronRight,
  Eye,
  Activity,
  Server,
} from "lucide-react";

const DashboardCards = () => {
  const cards = [
    {
      id: 1,
      title: "User Management",
      icon: <Users className="w-6 h-6" />,
      count: 42,
      description: "Manage all users and their permissions",
      buttonText: "Assign User",
      buttonIcon: <Plus className="w-4 h-4" />,
      color: "bg-gradient-to-r from-indigo-500 to-indigo-700",
      lightColor: "bg-indigo-100 dark:bg-indigo-900/30",
      textColor: "text-indigo-700 dark:text-indigo-300",
    },
    {
      id: 2,
      title: "Content Pages",
      icon: <FileText className="w-6 h-6" />,
      count: 18,
      description: "Create and manage your website content",
      buttonText: "Create Page",
      buttonIcon: <Plus className="w-4 h-4" />,
      color: "bg-gradient-to-r from-purple-500 to-purple-700",
      lightColor: "bg-purple-100 dark:bg-purple-900/30",
      textColor: "text-purple-700 dark:text-purple-300",
    },
    {
      id: 3,
      title: "Analytics",
      icon: <BarChart3 className="w-6 h-6" />,
      count: null,
      description: "Track engagement and user behavior",
      buttonText: "View Reports",
      buttonIcon: <Activity className="w-4 h-4" />,
      color: "bg-gradient-to-r from-teal-500 to-teal-700",
      lightColor: "bg-teal-100 dark:bg-teal-900/30",
      textColor: "text-teal-700 dark:text-teal-300",
    },
    {
      id: 4,
      title: "System Settings",
      icon: <Settings className="w-6 h-6" />,
      count: null,
      description: "Configure your CMS preferences",
      buttonText: "Configure",
      buttonIcon: <Settings className="w-4 h-4" />,
      color: "bg-gradient-to-r from-amber-500 to-amber-600",
      lightColor: "bg-amber-100 dark:bg-amber-900/30",
      textColor: "text-amber-700 dark:text-amber-300",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-800 p-6">
      <div className=" mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your content and users efficiently
          </p>
        </div>

        {/* Main Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600/50 overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col"
            >
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-lg ${card.lightColor}`}>
                    <div
                      className={`${card.color} p-2 rounded-md text-white flex items-center justify-center`}
                    >
                      {card.icon}
                    </div>
                  </div>
                  {card.count !== null && (
                    <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full flex items-center justify-center h-8">
                      <span className="font-bold text-gray-800 dark:text-white text-sm">
                        {card.count}
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-5 flex-1">
                  {card.description}
                </p>

                <button
                  className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group 
                    ${
                      card.id === 1 || card.id === 2
                        ? `${card.color} text-white hover:shadow-lg`
                        : `bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600`
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {card.buttonIcon}
                    <span>{card.buttonText}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-10 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              System Overview
            </h2>
            <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1">
              View detailed stats <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg border border-gray-100 dark:border-gray-600/30 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Active Users
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                42
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  +4.5%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  from last week
                </span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg border border-gray-100 dark:border-gray-600/30 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Published Pages
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                18
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  +2
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  this month
                </span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg border border-gray-100 dark:border-gray-600/30 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/40 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Monthly Visits
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                3.2K
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  +12.3%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  from last month
                </span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg border border-gray-100 dark:border-gray-600/30 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex items-center justify-center">
                  <Server className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  System Uptime
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                94%
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  +2.1%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  from last quarter
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
