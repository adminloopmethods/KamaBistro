import React, {useState} from "react";
import EditUserModal from "./EditUserForm";
import {toast} from "sonner";
import {
  activateUserReq,
  deactivateUserReq,
  deleteUserReq,
} from "@/functionality/fetch";
import {toastWithUpdate} from "@/functionality/ToastWithUpdate";

interface Location {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  image: string;
  email: string;
  isSuperUser: boolean;
  status: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  locationId: string;
  location: Location;
}

interface Pagination {
  totalUser: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

interface UserTableProps {
  data: {
    allUsers: User[];
    pagination: Pagination;
  };
  onPageChange: (page: number) => void;
  onCreateUser: () => void;
  refreshUsers: () => void;
  // isCurrentUserAdmin: boolean;
}

const UserTable: React.FC<UserTableProps> = ({
  data,
  onPageChange,
  onCreateUser,
  refreshUsers,
  // isCurrentUserAdmin,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isToggleStatusModalOpen, setIsToggleStatusModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());

  const handleEditClick = (user: User, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user: User, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleToggleClick = (user: User, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // if (!isCurrentUserAdmin) {
    //   toast.error("Only administrators can change user status");
    //   return;
    // }
    setUserToToggle(user);
    setIsToggleStatusModalOpen(true);
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    const userId = userToDelete.id;
    setUpdatingUsers((prev) => new Set(prev).add(userId)); // Add user to updating set

    try {
      await toastWithUpdate(() => deleteUserReq(userId), {
        loading: "Deleting user...",
        success: "User deleted successfully",
        error: (error) =>
          error instanceof Error ? error.message : "Failed to delete user",
      });

      refreshUsers();
    } catch (error) {
      // Error is already handled by toastWithUpdate
      console.error("Error deleting user:", error);
    } finally {
      setUpdatingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      }); // Remove user from updating set
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const confirmToggleStatus = async () => {
    if (!userToToggle) return;

    const userId = userToToggle.id;
    const isCurrentlyActive = userToToggle.status === "ACTIVE";
    setUpdatingUsers((prev) => new Set(prev).add(userId)); // Add user to updating set

    try {
      await toastWithUpdate(
        () =>
          isCurrentlyActive
            ? deactivateUserReq(userId)
            : activateUserReq(userId),
        {
          loading: isCurrentlyActive
            ? "Deactivating user..."
            : "Activating user...",
          success: `User ${
            isCurrentlyActive ? "deactivated" : "activated"
          } successfully`,
          error: (error) =>
            error instanceof Error
              ? error.message
              : `Failed to ${
                  isCurrentlyActive ? "deactivate" : "activate"
                } user`,
        }
      );

      refreshUsers();
    } catch (error) {
      console.error("Error toggling user status:", error);
    } finally {
      setUpdatingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      }); // Remove user from updating set
      setIsToggleStatusModalOpen(false);
      setUserToToggle(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Users
        </h2>
        <button
          onClick={onCreateUser}
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 极a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          New User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Contact
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Location
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Last Updated
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data?.allUsers.map((user) => (
              <tr
                key={user?.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td
                  className="px-6 py-4 whitespace-nowrap cursor-pointer"
                  onClick={() => handleRowClick(user)}
                >
                  <div className="flex items-center">
                    {user?.image ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={user?.image}
                        alt={user?.name}
                      />
                    ) : (
                      <div className="bg-gray-200 dark:bg-gray-600 border-2 border-dashed rounded-xl w-10 h-10" />
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.isSuperUser ? "Admin" : "Standard User"}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap cursor-pointer"
                  onClick={() => handleRowClick(user)}
                >
                  <div className="text-sm text-gray-900 dark:text-white">
                    {user?.email}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.phone || "No phone"}
                  </div>
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap cursor-pointer"
                  onClick={() => handleRowClick(user)}
                >
                  <div className="text-sm text-gray-900 dark:text-white">
                    {user?.location?.name || "No location"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.locationId}
                  </div>
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap cursor-pointer"
                  onClick={() => handleRowClick(user)}
                >
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      user.status === "ACTIVE"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {user?.status}
                  </span>
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 cursor-pointer"
                  onClick={() => handleRowClick(user)}
                >
                  {formatDate(user?.updatedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={(e) => handleEditClick(user, e)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                      disabled={updatingUsers.has(user.id)}
                      title="Edit user"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2极28l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>

                    <button
                      onClick={(e) => handleDeleteClick(user, e)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                      disabled={updatingUsers.has(user.id)}
                      title="Delete user"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* Toggle Switch */}

                    <label
                      className="relative inline-flex items-center cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleClick(user, e);
                      }}
                    >
                      <div
                        className={`w-11 h-6 bg-gray-200 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                        ${
                          user.status === "ACTIVE"
                            ? "bg-green-600 after:translate-x-full after:border-white"
                            : ""
                        } 
                        ${
                          updatingUsers.has(user.id)
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      ></div>
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUserUpdated={refreshUsers}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm shadow flex items-center justify-center z-10">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete user{" "}
              <span className="font-semibold">{userToDelete.name}</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setUserToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                disabled={updatingUsers.has(userToDelete.id)}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors flex items-center"
                disabled={updatingUsers.has(userToDelete.id)}
              >
                {updatingUsers.has(userToDelete.id) ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Status Confirmation Modal */}
      {isToggleStatusModalOpen && userToToggle && (
        <div className="fixed inset-0 backdrop-blur-sm shadow flex items-center justify-center z-10">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Confirm Status Change
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to{" "}
              {userToToggle.status === "ACTIVE" ? "deactivate" : "activate"}{" "}
              user <span className="font-semibold">{userToToggle.name}</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsToggleStatusModalOpen(false);
                  setUserToToggle(null);
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                disabled={updatingUsers.has(userToToggle.id)}
              >
                Cancel
              </button>
              <button
                onClick={confirmToggleStatus}
                className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                disabled={updatingUsers.has(userToToggle.id)}
              >
                {updatingUsers.has(userToToggle.id) ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {userToToggle.status === "ACTIVE"
                      ? "Deactivating..."
                      : "Activating..."}
                  </>
                ) : userToToggle.status === "ACTIVE" ? (
                  "Deactivate User"
                ) : (
                  "Activate User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {isDetailsModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  User Details
                </h3>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex flex-col items-center">
                  {selectedUser.image ? (
                    <img
                      className="h-32 w-32 rounded-full object-cover mb-4"
                      src={selectedUser.image}
                      alt={selectedUser.name}
                    />
                  ) : (
                    <div className="bg-gray-200 dark:bg-gray-600 border-2 border-dashed rounded-full w-32 h-32 flex items-center justify-center mb-4">
                      <svg
                        className="w-16 h-16 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                    ${
                      selectedUser.status === "ACTIVE"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {selectedUser.status}
                  </span>
                </div>

                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Full Name
                      </h4>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedUser.name}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Email Address
                      </h4>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedUser.email}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Phone Number
                      </h4>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedUser.phone || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        User Role
                      </h4>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedUser.isSuperUser
                          ? "Administrator"
                          : "Standard User"}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Location
                      </h4>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedUser.location?.name || "Not assigned"}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Location ID
                      </h4>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedUser.locationId || "N/A"}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Account Created
                      </h4>
                      <p className="mt-1 text-sm text-gray极00 dark:text-white">
                        {formatDate(selectedUser.createdAt)}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Last Updated
                      </h4>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {formatDate(selectedUser.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg极ite dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                disabled={data?.pagination?.currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${
                  data?.pagination?.currentPage === 1
                    ? "text-gray-300 dark:text-gray-500 cursor-not-allowed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    : "text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                }`}
              >
                <span className="sr-only">Previous</span>
                &larr;
              </button>

              {Array.from(
                {length: data?.pagination?.totalPages},
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === data?.pagination?.currentPage
                      ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900 dark:border-indigo-700 dark:text-indigo-200"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={
                  data?.pagination?.currentPage === data?.pagination?.totalPages
                }
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${
                  data?.pagination?.currentPage === data?.pagination?.totalPages
                    ? "text-gray-300 dark:text-gray-500 cursor-not-allowed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    : "text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                }`}
              >
                <span className="sr-only">Next</span>
                &rarr;
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
