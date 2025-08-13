"use client";
import React from "react";
import {Users, FileText, BarChart3, Settings, Plus} from "lucide-react";

const DashboardCards = () => {
  const cards = [
    {
      id: 1,
      title: "User Management",
      icon: <Users className="w-8 h-8 text-indigo-500" />,
      count: 42,
      description: "Manage all users and their permissions",
      buttonText: "Assign User",
      buttonIcon: <Plus className="w-4 h-4" />,
      color: "from-indigo-50 to-indigo-100",
      border: "border-indigo-200",
    },
    {
      id: 2,
      title: "Content Pages",
      icon: <FileText className="w-8 h-8 text-purple-500" />,
      count: 18,
      description: "Create and manage your website content",
      buttonText: "Create Page",
      buttonIcon: <Plus className="w-4 h-4" />,
      color: "from-purple-50 to-purple-100",
      border: "border-purple-200",
    },
    {
      id: 3,
      title: "Analytics",
      icon: <BarChart3 className="w-8 h-8 text-teal-500" />,
      count: null,
      description: "Track engagement and user behavior",
      buttonText: "View Reports",
      buttonIcon: null,
      color: "from-teal-50 to-teal-100",
      border: "border-teal-200",
    },
    {
      id: 4,
      title: "System Settings",
      icon: <Settings className="w-8 h-8 text-amber-500" />,
      count: null,
      description: "Configure your CMS preferences",
      buttonText: "Configure",
      buttonIcon: null,
      color: "from-amber-50 to-amber-100",
      border: "border-amber-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your content and users efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`bg-gradient-to-br ${card.color} dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border ${card.border} dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-xl inline-block shadow-sm">
                      {card.icon}
                    </div>
                  </div>
                  {card.count !== null && (
                    <div className="bg-white dark:bg-gray-700 px-3 py-1 rounded-full">
                      <span className="font-bold text-gray-800 dark:text-white">
                        {card.count}
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6">
                  {card.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2 min-h-[50px]">
                  {card.description}
                </p>

                <button
                  className={`mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl ${
                    card.id === 1
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                      : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600"
                  } transition-all duration-200 shadow-md hover:shadow-lg`}
                >
                  {card.buttonIcon}
                  <span className="font-medium">{card.buttonText}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            System Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-700 rounded-xl border border-indigo-200 dark:border-gray-600">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                42
              </div>
              <div className="text-gray-600 dark:text-gray-300 mt-1">
                Active Users
              </div>
            </div>
            <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 rounded-xl border border-purple-200 dark:border-gray-600">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                18
              </div>
              <div className="text-gray-600 dark:text-gray-300 mt-1">
                Published Pages
              </div>
            </div>
            <div className="p-5 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-gray-700 rounded-xl border border-teal-200 dark:border-gray-600">
              <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                3.2K
              </div>
              <div className="text-gray-600 dark:text-gray-300 mt-1">
                Monthly Visits
              </div>
            </div>
            <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-700 rounded-xl border border-amber-200 dark:border-gray-600">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                94%
              </div>
              <div className="text-gray-600 dark:text-gray-300 mt-1">
                System Uptime
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
