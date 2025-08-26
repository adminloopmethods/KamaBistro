"use client";
import React, {useState, useEffect} from "react";
import {getUsersReq, assignPageRoleReq} from "@/functionality/fetch";
import {assignUserToPageRole} from "@/utils/roleManagement";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  image?: string;
  status: string;
}

interface Webpage {
  id: string;
  title: string;
}

interface AssignUserModalProps {
  show: boolean;
  currentPage: Webpage | null;
  assigningRole: "editor" | "verifier" | null;
  onClose: () => void;
  onAssign: (user: User) => void;
}

const AssignUserModal: React.FC<AssignUserModalProps> = ({
  show,
  currentPage,
  assigningRole,
  onClose,
  onAssign,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users when modal opens
  useEffect(() => {
    if (show) {
      fetchUsers();
    }
  }, [show]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUsersReq();

      if (response.ok) {
        // Filter only active users
        const activeUsers =
          response.users?.filter((user: User) => user.status === "active") ||
          [];
        setUsers(activeUsers);
      } else {
        setError(response.error || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignUser = async (user: User) => {
    if (!currentPage || !assigningRole) return;

    try {
      setAssigning(true);
      setError(null);

      // Import the role management utility at the top of your file
      // import { assignUserToPageRole } from "@/utils/roleManagement";

      const response = await assignUserToPageRole({
        webpageId: currentPage.id,
        userId: user.id,
        role: assigningRole,
      });

      if (response.ok) {
        // Call the parent component's onAssign function
        onAssign(user);
        onClose();
      } else {
        setError(response.error || "Failed to assign user");
      }
    } catch (err) {
      console.error("Error assigning user:", err);
      setError("Failed to assign user");
    } finally {
      setAssigning(false);
    }
  };

  if (!show || !currentPage || !assigningRole) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Assign {assigningRole === "editor" ? "Editor" : "Verifier"} to{" "}
              {currentPage.title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              disabled={assigning}
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

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                Loading users...
              </span>
            </div>
          ) : (
            /* User List */
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No active users found
                  </p>
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      assigning
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
                    }`}
                    onClick={() => !assigning && handleAssignUser(user)}
                  >
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium mr-3">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                        {assigning ? "Assigning..." : "Assign"}
                      </span>
                      {assigningRole && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                          as {assigningRole}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-3">
            <button
              onClick={onClose}
              disabled={assigning}
              className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-gray-800 dark:text-gray-300 font-medium"
            >
              Cancel
            </button>
            {error && (
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium"
              >
                {loading ? "Retrying..." : "Retry"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignUserModal;
