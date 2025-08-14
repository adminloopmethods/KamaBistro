"use client";
import React from "react";

interface User {
  id: string;
  name: string;
  role: "editor" | "verifier";
  avatar: string;
}

interface Webpage {
  id: string;
  title: string;
}

interface AssignUserModalProps {
  show: boolean;
  currentPage: Webpage | null;
  assigningRole: "editor" | "verifier" | null;
  users: User[];
  onClose: () => void;
  onAssign: (user: User) => void;
}

const AssignUserModal: React.FC<AssignUserModalProps> = ({
  show,
  currentPage,
  assigningRole,
  users,
  onClose,
  onAssign,
}) => {
  if (!show || !currentPage || !assigningRole) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
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

          {/* User List */}
          <div className="space-y-4">
            {users
              .filter((user) => user.role === assigningRole)
              .map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => onAssign(user)}
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

          {/* Close Button */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-gray-800 dark:text-gray-300 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignUserModal;
