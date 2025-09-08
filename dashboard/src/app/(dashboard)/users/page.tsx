"use client";
import React, {useEffect, useState} from "react";
import {getUsersReq} from "@/functionality/fetch";
import {toast} from "react-toastify";
import UserTable from "./UserTable";
import AddUserModal from "./CreateNewUser";

const UsersPage: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  console.log(userData, "userData");

  const fetchUsers = async (page: number = 1) => {
    try {
      setLoading(true);
      // const response = await getUsersReq(page);
      const response = await getUsersReq();

      if (response.ok) {
        setUserData(response);
      } else {
        setError(response.error || "Failed to fetch users");
        toast.error(response.error || "Failed to fetch users");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = () => {
    fetchUsers(currentPage);
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUserCreated = () => {
    fetchUsers(currentPage); // Refresh the user list
  };

  return (
    <div className="container mx-auto ">
      {loading && !userData ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <>
          <UserTable
            data={userData?.users}
            onPageChange={handlePageChange}
            onCreateUser={() => setIsModalOpen(true)}
            refreshUsers={refreshUsers}
            // isCurrentUserAdmin={true} // Pass the required property
          />

          <AddUserModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onUserCreated={handleUserCreated}
          />
        </>
      )}
    </div>
  );
};

export default UsersPage;
