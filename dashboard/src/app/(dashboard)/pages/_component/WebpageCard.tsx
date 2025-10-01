"use client";
import React, {useState} from "react";
import {Edit, UserPlus, X, Power, PowerOff} from "lucide-react";
import {History} from "lucide-react";
import {useRouter} from "next/navigation";
import {getRoleByName, removeUserFromPageRole} from "@/utils/roleManagement";
import {useUser} from "@/Context/UserContext";
import VersionHistoryModal from "./VersionHistoryModal";
import {
  activateWebpageReq,
  deactivateWebpageReq,
  toggleWebpageStatusReq,
} from "@/functionality/fetch";

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
  status: "active" | "inactive" | "draft" | "published" | "needs-review";
  route: string;
  versionCount?: number;
  updatedAt?: string;
  name?: string;
  count?: number;
  Status?: boolean;
}

interface Props {
  page: Webpage;
  formatDate: (dateString: string) => string;
  getStatusStyle: (status: string) => string;
  openAssignModal: (page: Webpage, role: "editor" | "verifier") => void;
  onUserRemoved: () => void;
}

const WebpageCard: React.FC<Props> = ({
  page,
  formatDate,
  getStatusStyle,
  openAssignModal,
  onUserRemoved,
}) => {
  const router = useRouter();
  const {user: currentUser} = useUser();
  const [isRemoving, setIsRemoving] = useState<{
    editor: boolean;
    verifier: boolean;
  }>({editor: false, verifier: false});
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  const isAdmin = currentUser?.isSuperUser;

  const isActive =
    page.Status !== undefined
      ? page.Status
      : page.status === "active" || page.status === "published";

  const handleToggleStatus = async () => {
    try {
      setIsTogglingStatus(true);

      let response;
      if (page.Status !== undefined) {
        // Use toggle endpoint for simplicity
        response = await toggleWebpageStatusReq(page.id);
      } else {
        // Fallback to individual endpoints
        if (isActive) {
          response = await deactivateWebpageReq(page.id);
        } else {
          response = await activateWebpageReq(page.id);
        }
      }

      if (response.ok) {
        onUserRemoved();
      } else {
        console.error("Failed to toggle webpage status:", response.error);
        // You might want to show a toast notification here
      }
    } catch (error) {
      console.error("Error toggling webpage status:", error);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleRemoveUser = async (role: "editor" | "verifier") => {
    try {
      setIsRemoving((prev) => ({...prev, [role]: true}));

      const roleData = await getRoleByName(role);
      if (!roleData) {
        console.error(`Role ${role} not found`);
        return;
      }

      const response = await removeUserFromPageRole({
        webpageId: page.id,
        roleId: roleData.id,
      });

      if (response.ok) {
        onUserRemoved();
      } else {
        console.error("Failed to remove user:", response.error);
      }
    } catch (error) {
      console.error("Error removing user:", error);
    } finally {
      setIsRemoving((prev) => ({...prev, [role]: false}));
    }
  };

  const goToEditPage = () => {
    router.push(`/editor/${page.id}`);
  };

  const getCurrentWebpageData = () => {
    return {
      id: page.id,
      title: page.title,
      name: page.name || page.title,
    };
  };

  const handleRollbackSuccess = () => {
    onUserRemoved();
    setShowVersionHistory(false);
  };

  const renderRoleSection = (roleType: "editor" | "verifier", user?: User) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
          {roleType}
        </span>
        {isAdmin &&
          (!user ? (
            <button
              onClick={() => openAssignModal(page, roleType)}
              className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300 flex items-center gap-1"
            >
              <UserPlus className="w-3 h-3" />
              Assign
            </button>
          ) : (
            <button
              onClick={() => handleRemoveUser(roleType)}
              disabled={isRemoving[roleType]}
              className="text-xs bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 px-2 py-1 rounded-lg text-red-700 dark:text-red-400 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRemoving[roleType] ? (
                <>
                  <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <X className="w-3 h-3" />
                  Remove
                </>
              )}
            </button>
          ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {user ? (
          <div className={`flex items-center px-3 py-1.5 rounded-lg`}>
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-6 h-6 mr-2 flex items-center justify-center text-xs font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-700 dark:text-white">
              {user.name}
              <span
                className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                  roleType === "editor"
                    ? "bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200"
                    : "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200"
                }`}
              >
                {roleType}
              </span>
            </span>
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            No {roleType} assigned
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl">
            {page.icon}
          </div>

          <div className="flex items-center space-x-2">
            {/* Status badge with toggle button for admin */}
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isActive
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>

              {isAdmin && (
                <button
                  onClick={handleToggleStatus}
                  disabled={isTogglingStatus}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400"
                      : "bg-green-100 hover:bg-green-200 text-green-600 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={isActive ? "Deactivate Page" : "Activate Page"}
                >
                  {isTogglingStatus ? (
                    <div
                      className={`w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin`}
                    />
                  ) : isActive ? (
                    <PowerOff className="w-4 h-4" />
                  ) : (
                    <Power className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs">
              {page.count || 0} versions
            </span>
          </div>
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
          {renderRoleSection("editor", page.editor)}
          {/* {renderRoleSection("verifier", page.verifier)} */}
        </div>

        <div className="mt-6 flex space-x-3">
          <button
            onClick={goToEditPage}
            className="flex-1 cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center"
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit Content
          </button>

          {isAdmin && (
            <button
              onClick={() => setShowVersionHistory(true)}
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-2.5 rounded-xl"
              title="Version History"
            >
              <History className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          )}
        </div>
      </div>

      {/* Version History Modal */}
      <VersionHistoryModal
        show={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        webpage={getCurrentWebpageData()}
        onRollbackSuccess={handleRollbackSuccess}
      />
    </div>
  );
};

export default WebpageCard;
