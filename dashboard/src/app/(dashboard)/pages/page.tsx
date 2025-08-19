"use client";
import React, {useEffect, useState} from "react";
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
  Plus,
} from "lucide-react";
import {getAllWebpagesReq, getWebpageReq} from "@/functionality/fetch";
import WebpageCard from "./_component/WebpageCard";
import AssignUserModal from "./_component/AssignUserModal";
import Link from "next/link";
import {Skeleton} from "@/components/ui/skeleton";

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
  description?: string;
  icon: React.ReactNode;
  lastEdited: string;
  editor?: User;
  verifier?: User;
  status: "draft" | "published" | "needs-review";
  route: string;
}

const icons: Record<any, any> = {
  home: <LayoutDashboard className="w-6 h-6 text-indigo-500" />,
  about: <LayoutDashboard className="w-6 h-6 text-indigo-500" />,
  career: <LayoutDashboard className="w-6 h-6 text-indigo-500" />,
  services: <LayoutDashboard className="w-6 h-6 text-indigo-500" />,
  contact: <LayoutDashboard className="w-6 h-6 text-indigo-500" />,
  blog: <LayoutDashboard className="w-6 h-6 text-indigo-500" />,
  products: <LayoutDashboard className="w-6 h-6 text-indigo-500" />,
};

const CMSDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users] = useState<User[]>([
    // { id: "1", name: "Alex Johnson", role: "editor", avatar: "/user1.jpg" },
    // { id: "2", name: "Maria Garcia", role: "verifier", avatar: "/user2.jpg" },
    // { id: "3", name: "Sam Wilson", role: "editor", avatar: "/user3.jpg" },
    // { id: "4", name: "Priya Patel", role: "verifier", avatar: "/user4.jpg" },
  ]);

  const [webpages, setWebpages] = useState<Webpage[]>([
    // {
    //   id: "home",
    //   title: "Home Page",
    //   description: "Main landing page with featured content",
    //   icon: <LayoutDashboard className="w-6 h-6 text-indigo-500" />,
    //   lastEdited: "2023-10-15",
    //   editor: {
    //     id: "1",
    //     name: "Alex Johnson",
    //     role: "editor",
    //     avatar: "/user1.jpg",
    //   },
    //   verifier: {
    //     id: "2",
    //     name: "Maria Garcia",
    //     role: "verifier",
    //     avatar: "/user2.jpg",
    //   },
    //   status: "published",
    //   route: "/home",
    // },
    // {
    //   id: "about",
    //   title: "About Us",
    //   description: "Company history and team information",
    //   icon: <Users className="w-6 h-6 text-blue-500" />,
    //   lastEdited: "2023-10-18",
    //   verifier: {
    //     id: "4",
    //     name: "Priya Patel",
    //     role: "verifier",
    //     avatar: "/user4.jpg",
    //   },
    //   route: "/home",
    //   status: "published",
    // },
    // {
    //   id: "services",
    //   title: "Services",
    //   description: "Overview of services we provide",
    //   icon: <Settings className="w-6 h-6 text-amber-500" />,
    //   lastEdited: "2023-10-12",
    //   editor: {
    //     id: "3",
    //     name: "Sam Wilson",
    //     role: "editor",
    //     avatar: "/user3.jpg",
    //   },
    //   status: "needs-review",
    //   route: "/home",
    // },
    // {
    //   id: "contact",
    //   title: "Contact",
    //   description: "Contact information and inquiry form",
    //   icon: <Contact className="w-6 h-6 text-emerald-500" />,
    //   lastEdited: "2023-10-10",
    //   status: "published",
    //   route: "/home",
    // },
    // {
    //   id: "blog",
    //   title: "Blog",
    //   description: "Latest articles and company updates",
    //   icon: <FileText className="w-6 h-6 text-rose-500" />,
    //   lastEdited: "2023-10-05",
    //   editor: {
    //     id: "1",
    //     name: "Alex Johnson",
    //     role: "editor",
    //     avatar: "/user1.jpg",
    //   },
    //   verifier: {
    //     id: "4",
    //     name: "Priya Patel",
    //     role: "verifier",
    //     avatar: "/user4.jpg",
    //   },
    //   status: "draft",
    //   route: "/home",
    // },
    // {
    //   id: "products",
    //   title: "Products",
    //   description: "Our product catalog and descriptions",
    //   icon: <ShoppingCart className="w-6 h-6 text-violet-500" />,
    //   lastEdited: "2023-10-20",
    //   status: "published",
    //   route: "/home",
    // },
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

  useEffect(() => {
    async function getAllpages() {
      try {
        setIsLoading(true);
        const response = await getAllWebpagesReq();
        // console.log(response)
        if (response.ok) {
          setWebpages(() => {
            return response.webpages.map((e: any, i: number) => {
              return {
                id: e.id,
                title: e.name,
                // description: "",
                icon: icons[e.route],
                lastEdited: e.updatedAt,
                editor: e?.editor,
                verifier: e?.verifier,
                status: e.status,
                route: e.route,
              };
            });
          });
        }
      } catch (err) {
        console.error("Failed to fetch webpages:", err);
      } finally {
        setIsLoading(false);
      }
    }
    getAllpages();
  }, []);

  //skeleton loader
  const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className=" py-3 rounded-xl">
            <Skeleton className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600" />
          </div>
          <Skeleton className="w-20 h-6 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>

        <div className="mt-4">
          <Skeleton className="w-3/4 h-6 mb-2 bg-gray-300 dark:bg-gray-600" />
          <Skeleton className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700" />
        </div>

        <div className="mt-6">
          {/* Editor Assignment Skeleton */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="w-16 h-4 bg-gray-300 dark:bg-gray-600" />
              <Skeleton className="w-16 h-6 rounded-lg bg-gray-300 dark:bg-gray-600" />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center w-full  px-3 py-1.5 rounded-lg">
                <Skeleton className="w-6 h-6 rounded-full mr-2 bg-gray-300 dark:bg-gray-600" />
                <Skeleton className="w-24 h-4 bg-gray-300 dark:bg-gray-600" />
              </div>
            </div>
          </div>

          {/* Verifier Assignment Skeleton */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="w-16 h-4 bg-gray-300 dark:bg-gray-600" />
              <Skeleton className="w-16 h-6 rounded-lg bg-gray-300 dark:bg-gray-600" />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center w-full px-3 py-1.5 rounded-lg">
                <Skeleton className="w-6 h-6 rounded-full mr-2 bg-gray-300 dark:bg-gray-600" />
                <Skeleton className="w-24 h-4 bg-gray-300 dark:bg-gray-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <Skeleton className="flex-1 h-10 rounded-xl bg-gray-300 dark:bg-gray-600" />
          <Skeleton className="w-10 h-10 rounded-xl bg-gray-300 dark:bg-gray-600" />
        </div>
      </div>
    </div>
  );

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
            <Link
              href={"/editor"}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Page
            </Link>
          </div>
        </div>
      </div>

      {/* Webpage Cards Grid */}
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({length: 3}).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : webpages.map((page) => (
              <WebpageCard
                key={page.id}
                page={page}
                formatDate={formatDate}
                getStatusStyle={getStatusStyle}
                openAssignModal={openAssignModal}
                removeUser={removeUser}
              />
            ))}
      </div>
      {/* </div> */}

      {/* Assign User Modal */}
      <AssignUserModal
        show={showAssignModal}
        currentPage={currentPage}
        assigningRole={assigningRole}
        users={users}
        onClose={() => setShowAssignModal(false)}
        onAssign={assignUser}
      />
    </div>
  );
};

export default CMSDashboard;
