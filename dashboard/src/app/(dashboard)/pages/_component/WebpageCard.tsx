import React from "react";
import {Edit, UserPlus, X} from "lucide-react";
import {useRouter} from "next/navigation";
import {getRoleByName, removeUserFromPageRole} from "@/utils/roleManagement";

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

interface Props {
  page: Webpage;
  formatDate: (dateString: string) => string;
  getStatusStyle: (status: string) => string;
  openAssignModal: (page: Webpage, role: "editor" | "verifier") => void;
  onUserRemoved: () => void; // Callback to refresh data
}

const WebpageCard: React.FC<Props> = ({
  page,
  formatDate,
  getStatusStyle,
  openAssignModal,
  onUserRemoved,
}) => {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = React.useState<{
    editor: boolean;
    verifier: boolean;
  }>({editor: false, verifier: false});

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
        onUserRemoved(); // Trigger refresh
      } else {
        console.error("Failed to remove user:", response.error);
        // You might want to show a toast notification here
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

  const renderRoleSection = (
    roleType: "editor" | "verifier",
    user?: User,
    bgColor: string
  ) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
          {roleType}
        </span>
        {!user ? (
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
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {user ? (
          <div
            className={`flex items-center ${bgColor} px-3 py-1.5 rounded-lg`}
          >
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
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
              page.status
            )}`}
          >
            {page.status?.replace("-", " ")}
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
          {renderRoleSection(
            "editor",
            page.editor,
            "bg-indigo-50 dark:bg-indigo-900/20"
          )}
          {renderRoleSection(
            "verifier",
            page.verifier,
            "bg-green-50 dark:bg-green-900/20"
          )}
        </div>

        <div className="mt-6 flex space-x-3">
          <button
            onClick={goToEditPage}
            className="flex-1 cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center"
          >
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
                d="M12 5v.01M12 12v.01M12 19v.01"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebpageCard;
