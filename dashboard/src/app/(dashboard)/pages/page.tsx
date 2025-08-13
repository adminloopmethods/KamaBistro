"use client";
import React, {useState} from "react";
import {
  Edit,
  UserPlus,
  LayoutDashboard,
  Users,
  FileText,
  Contact,
  ShoppingCart,
  Settings,
  BarChart2,
  ArrowRight,
} from "lucide-react";

// Types
interface User {
  id: string;
  name: string;
  role: "editor" | "verifier";
  avatar: string;
}

interface Webpage {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  lastEdited: string;
  editor?: User;
  verifier?: User;
  status: "draft" | "published" | "needs-review";
}

const CMSDashboard = () => {
  const [users] = useState<User[]>([
    {id: "1", name: "Alex Johnson", role: "editor", avatar: "/user1.jpg"},
    {id: "2", name: "Maria Garcia", role: "verifier", avatar: "/user2.jpg"},
    {id: "3", name: "Sam Wilson", role: "editor", avatar: "/user3.jpg"},
    {id: "4", name: "Priya Patel", role: "verifier", avatar: "/user4.jpg"},
  ]);

  const [webpages, setWebpages] = useState<Webpage[]>([
    {
      id: "home",
      title: "Home Page",
      description: "Main landing page with featured content",
      icon: <LayoutDashboard className="w-6 h-6 text-indigo-500" />,
      lastEdited: "2023-10-15",
      editor: {
        id: "1",
        name: "Alex Johnson",
        role: "editor",
        avatar: "/user1.jpg",
      },
      verifier: {
        id: "2",
        name: "Maria Garcia",
        role: "verifier",
        avatar: "/user2.jpg",
      },
      status: "published",
    },
    {
      id: "about",
      title: "About Us",
      description: "Company history and team information",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      lastEdited: "2023-10-18",
      verifier: {
        id: "4",
        name: "Priya Patel",
        role: "verifier",
        avatar: "/user4.jpg",
      },
      status: "published",
    },
    {
      id: "services",
      title: "Services",
      description: "Overview of services we provide",
      icon: <Settings className="w-6 h-6 text-amber-500" />,
      lastEdited: "2023-10-12",
      editor: {
        id: "3",
        name: "Sam Wilson",
        role: "editor",
        avatar: "/user3.jpg",
      },
      status: "needs-review",
    },
    {
      id: "contact",
      title: "Contact",
      description: "Contact information and inquiry form",
      icon: <Contact className="w-6 h-6 text-emerald-500" />,
      lastEdited: "2023-10-10",
      status: "published",
    },
    {
      id: "blog",
      title: "Blog",
      description: "Latest articles and company updates",
      icon: <FileText className="w-6 h-6 text-rose-500" />,
      lastEdited: "2023-10-05",
      editor: {
        id: "1",
        name: "Alex Johnson",
        role: "editor",
        avatar: "/user1.jpg",
      },
      verifier: {
        id: "4",
        name: "Priya Patel",
        role: "verifier",
        avatar: "/user4.jpg",
      },
      status: "draft",
    },
    {
      id: "products",
      title: "Products",
      description: "Our product catalog and descriptions",
      icon: <ShoppingCart className="w-6 h-6 text-violet-500" />,
      lastEdited: "2023-10-20",
      status: "published",
    },
  ]);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<Webpage | null>(null);
  const [assigningRole, setAssigningRole] = useState<
    "editor" | "verifier" | null
  >(null);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Status badge styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "needs-review":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Open assign user modal
  const openAssignModal = (page: Webpage, role: "editor" | "verifier") => {
    setCurrentPage(page);
    setAssigningRole(role);
    setShowAssignModal(true);
  };

  // Assign a user to the page
  const assignUser = (user: User) => {
    if (!currentPage || !assigningRole) return;

    const updatedPages = webpages.map((page) => {
      if (page.id === currentPage.id) {
        return {
          ...page,
          [assigningRole]: user,
        };
      }
      return page;
    });

    setWebpages(updatedPages);
    setShowAssignModal(false);
    setAssigningRole(null);
  };

  // Remove assigned user
  const removeUser = (pageId: string, role: "editor" | "verifier") => {
    const updatedPages = webpages.map((page) => {
      if (page.id === pageId) {
        return {
          ...page,
          [role]: undefined,
        };
      }
      return page;
    });

    setWebpages(updatedPages);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br dark:bg-gray-800 p-6">
      {/* Header */}
      <div className=" mx-auto mb-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Content Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your website content and assign team members
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search pages..."
                className="pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl flex items-center">
              <BarChart2 className="w-5 h-5 mr-2" />
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Webpage Cards Grid */}
      <div className=" mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {webpages.map((page) => (
          <div
            key={page.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl">
                  {page.icon}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                    page.status
                  )}`}
                >
                  {page.status.replace("-", " ")}
                </span>
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {page.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  Last edited: {formatDate(page.lastEdited)}
                </p>
              </div>

              <div className="mt-6">
                {/* Editor Assignment */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Editor
                    </span>
                    {!page.editor ? (
                      <button
                        onClick={() => openAssignModal(page, "editor")}
                        className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300"
                      >
                        <UserPlus className="inline w-4 h-4 mr-1" />
                        Assign
                      </button>
                    ) : (
                      <button
                        onClick={() => removeUser(page.id, "editor")}
                        className="text-xs bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 px-2 py-1 rounded-lg text-red-700 dark:text-red-400"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {page.editor ? (
                      <div className="flex items-center bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-6 h-6 mr-2" />
                        <span className="text-sm text-gray-700 dark:text-white">
                          {page.editor.name}
                          <span className="ml-2 text-xs bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded-full">
                            Editor
                          </span>
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                        No editor assigned
                      </div>
                    )}
                  </div>
                </div>

                {/* Verifier Assignment */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Verifier
                    </span>
                    {!page.verifier ? (
                      <button
                        onClick={() => openAssignModal(page, "verifier")}
                        className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300"
                      >
                        <UserPlus className="inline w-4 h-4 mr-1" />
                        Assign
                      </button>
                    ) : (
                      <button
                        onClick={() => removeUser(page.id, "verifier")}
                        className="text-xs bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 px-2 py-1 rounded-lg text-red-700 dark:text-red-400"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {page.verifier ? (
                      <div className="flex items-center bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-6 h-6 mr-2" />
                        <span className="text-sm text-gray-700 dark:text-white">
                          {page.verifier.name}
                          <span className="ml-2 text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full">
                            Verifier
                          </span>
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                        No verifier assigned
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center">
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Content
                </button>
                <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-2.5 rounded-xl">
                  <svg
                    className="w-5 h-5 text-gray-700 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assign User Modal */}
      {showAssignModal && currentPage && assigningRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Assign {assigningRole === "editor" ? "Editor" : "Verifier"} to{" "}
                  {currentPage.title}
                </h3>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {users
                  .filter((user) => user.role === assigningRole)
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => assignUser(user)}
                    >
                      <div className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.role === "editor" ? "Editor" : "Verifier"}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-indigo-600 dark:text-indigo-400">
                        Assign
                      </span>
                    </div>
                  ))}
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-gray-800 dark:text-gray-300 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSDashboard;
