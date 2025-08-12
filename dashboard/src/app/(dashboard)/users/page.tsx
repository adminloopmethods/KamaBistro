import React, {useEffect, useState} from "react";
import UserTable from "./UserTable";
import {getUsersReq} from "@/functionality/fetch";

// This would typically come from API
const mockUserData = {
  message: "user fetched successfully",
  users: {
    allUsers: [
      {
        id: "cme2qwnru0001oiqkemmdvp4v",
        name: "Deepanshu R. Kataria",
        image: "",
        email: "dkataria576@gmail.com",
        password:
          "$2b$10$rAbGrtH/8eIfO2hK6MUHKeF.LYgtkt26vZblJYP2Hb4mh154VW6Q2",
        isSuperUser: false,
        status: "ACTIVE",
        phone: "8307690758",
        createdAt: "2025-08-08T11:31:28.986Z",
        updatedAt: "2025-08-11T06:05:29.891Z",
        locationId: "31c52913-62dd-4269-88f8-b61486ca82d5",
        location: {
          id: "31c52913-62dd-4269-88f8-b61486ca82d5",
          name: "Location1",
        },
      },
      {
        id: "cme6mnlgq0000oi0wfvpjus2s",
        name: "Bhavnesh Sharma",
        image: "",
        email: "bhavnesh@sharma.com",
        password:
          "$2b$10$42tlTcHlbvHqb4qz9DD4ZOBoHqTlrzALywJkHYLdJ7JwmJ6xks1ny",
        isSuperUser: false,
        status: "ACTIVE",
        phone: "4528247855",
        createdAt: "2025-08-11T04:43:32.331Z",
        updatedAt: "2025-08-11T04:43:32.331Z",
        locationId: "31c52913-62dd-4269-88f8-b61486ca82d5",
        location: {
          id: "31c52913-62dd-4269-88f8-b61486ca82d5",
          name: "Location1",
        },
      },
    ],
    pagination: {
      totalUser: 2,
      totalPages: 1,
      currentPage: 1,
      limit: 20,
    },
  },
};

const UsersPage: React.FC = () => {
  // const [userData, setUserData] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await getUsersReq();

  //       if (response.ok) {
  //         setUserData(response.users); // Adjust based on your actual API response structure
  //       } else {
  //         setError(response.error || "Failed to fetch users");
  //       }
  //     } catch (err) {
  //       setError("An unexpected error occurred");
  //       console.error("Error fetching users:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUsers();
  // }, []);

  return (
    <div className="container mx-auto p-4">
      {/* <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <p className="text-gray-600">
          Manage application users and permissions
        </p>
      </div> */}

      <UserTable data={mockUserData} />
    </div>
  );
};

export default UsersPage;
