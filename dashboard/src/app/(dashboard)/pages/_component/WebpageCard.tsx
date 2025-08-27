import React, {MouseEventHandler} from "react";
import {Edit, UserPlus} from "lucide-react";
import {useRouter} from "next/navigation";
import {useMyContext} from "@/Context/EditorContext";
import {removePageRoleReq} from "@/functionality/fetch";

interface User {
  id: string;
  name: string;
  role: "editor" | "verifier";
  // avatar: string;
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
  removeUser: (pageId: string, role: "editor" | "verifier") => void;
}

const WebpageCard: React.FC<Props> = ({
  page,
  formatDate,
  getStatusStyle,
  openAssignModal,
  removeUser,
}) => {
  const router = useRouter();

  const handleRemoveUser = async (
    pageId: string,
    role: "editor" | "verifier"
  ) => {
    try {
      // Call API to remove role assignment
      const response = await removePageRoleReq({
        webpageId: pageId,
        role: role.toUpperCase(), // Adjust based on your API requirements
      });

      if (response.ok) {
        // Update local state
        removeUser(pageId, role);
      } else {
        console.error("Failed to remove user:", response.error);
      }
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const goToEditPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(`/editor/${page.id}`);
  };

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
          <button
            onClick={goToEditPage}
            type="button"
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
