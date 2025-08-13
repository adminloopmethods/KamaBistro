import React from "react";

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

interface UsersData {
  message: string;
  users: {
    allUsers: User[];
    pagination: Pagination;
  };
}

const UserTable: React.FC<{data: UsersData}> = ({data}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Users
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {data.users.allUsers.length} of{" "}
          {data.users.pagination.totalUser} users
        </div>
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
            {data.users.allUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.image ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={user.image}
                        alt={user.name}
                      />
                    ) : (
                      <div className="bg-gray-200 dark:bg-gray-600 border-2 border-dashed rounded-xl w-10 h-10" />
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.isSuperUser ? "Admin" : "Standard User"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {user.email}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {user.phone || "No phone"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {user.location?.name || "No location"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user.locationId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      user.status === "ACTIVE"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(user.updatedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing{" "}
              <span className="font-medium">{data.users.pagination.limit}</span>{" "}
              of{" "}
              <span className="font-medium">
                {data.users.pagination.totalUser}
              </span>{" "}
              results
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                disabled={data.users.pagination.currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${
                  data.users.pagination.currentPage === 1
                    ? "text-gray-300 dark:text-gray-500 cursor-not-allowed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    : "text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                }`}
              >
                <span className="sr-only">Previous</span>
                &larr;
              </button>

              {Array.from(
                {length: data.users.pagination.totalPages},
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === data.users.pagination.currentPage
                      ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900 dark:border-indigo-700 dark:text-indigo-200"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={
                  data.users.pagination.currentPage ===
                  data.users.pagination.totalPages
                }
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${
                  data.users.pagination.currentPage ===
                  data.users.pagination.totalPages
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
