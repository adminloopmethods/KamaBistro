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
import {getAllWebpagesReq} from "@/functionality/fetch";
import WebpageCard from "./_component/WebpageCard";
import AssignUserModal from "./_component/AssignUserModal";
import Link from "next/link";
import {Skeleton} from "@/components/ui/skeleton";

interface User {
  id: string;
  name: string;
  email: string;
  role?: "editor" | "verifier";
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

const icons: Record<string, React.ReactNode> = {
  home: <LayoutDashboard className="w-6 h-6 text-indigo-500" />,
  about: <Users className="w-6 h-6 text-indigo-500" />,
  career: <FileText className="w-6 h-6 text-indigo-500" />,
  services: <Settings className="w-6 h-6 text-indigo-500" />,
  contact: <Contact className="w-6 h-6 text-indigo-500" />,
  blog: <FileText className="w-6 h-6 text-indigo-500" />,
  products: <ShoppingCart className="w-6 h-6 text-indigo-500" />,
};

const CMSDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [webpages, setWebpages] = useState<Webpage[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<Webpage | null>(null);
  const [assigningRole, setAssigningRole] = useState<
    "editor" | "verifier" | null
  >(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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

  const openAssignModal = (page: Webpage, role: "editor" | "verifier") => {
    setCurrentPage(page);
    setAssigningRole(role);
    setShowAssignModal(true);
  };

  const fetchWebpages = async () => {
    try {
      setIsLoading(true);
      const response = await getAllWebpagesReq();

      console.log("Webpages API response:", response); // Debug log

      if (response.ok && response.webpages) {
        console.log("Raw webpage data:", response.webpages); // Debug log

        const mappedWebpages = response.webpages.map((webpage: any) => {
          console.log(`Webpage ${webpage.name}:`, {
            editorId: webpage.editorId,
            editor: webpage.editor?.name,
            verifierId: webpage.verifierId,
            verifier: webpage.verifier?.name,
          }); // Debug log

          // Extract editor and verifier information correctly
          const editor =
            webpage.editorId || webpage.editor
              ? {
                  id: webpage.editorId || webpage.editor?.id,
                  name: webpage.editor?.name || "Unknown Editor",
                  email: webpage.editor?.email || "",
                  role: "editor" as const,
                }
              : undefined;

          const verifier =
            webpage.verifierId || webpage.verifier
              ? {
                  id: webpage.verifierId || webpage.verifier?.id,
                  name: webpage.verifier?.name || "Unknown Verifier",
                  email: webpage.verifier?.email || "",
                  role: "verifier" as const,
                }
              : undefined;

          return {
            id: webpage.id,
            title: webpage.name,
            icon: icons[webpage.route] || icons.home,
            lastEdited: webpage.updatedAt,
            editor,
            verifier,
            status: webpage.status,
            route: webpage.route,
          };
        });

        setWebpages(mappedWebpages);
      }
    } catch (err) {
      console.error("Failed to fetch webpages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWebpages();
  }, []);

  const handleUserAssigned = () => {
    fetchWebpages(); // Refresh the data after assignment
  };

  const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="py-3 rounded-xl">
            <Skeleton className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600" />
          </div>
          <Skeleton className="w-20 h-6 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>

        <div className="mt-4">
          <Skeleton className="w-3/4 h-6 mb-2 bg-gray-300 dark:bg-gray-600" />
          <Skeleton className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700" />
        </div>

        <div className="mt-6">
          {[1, 2].map((i) => (
            <div key={i} className="mb-4">
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
          ))}
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
      <div className="mx-auto mb-10">
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
            <Link
              href="/editor"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Page
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({length: 6}).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : webpages.map((page) => (
              <WebpageCard
                key={page.id}
                page={page}
                formatDate={formatDate}
                getStatusStyle={getStatusStyle}
                openAssignModal={openAssignModal}
                onUserRemoved={handleUserAssigned}
              />
            ))}
      </div>

      <AssignUserModal
        show={showAssignModal}
        currentPage={currentPage}
        assigningRole={assigningRole}
        onClose={() => {
          setShowAssignModal(false);
          setCurrentPage(null);
          setAssigningRole(null);
        }}
        onAssign={handleUserAssigned}
      />
    </div>
  );
};

export default CMSDashboard;
