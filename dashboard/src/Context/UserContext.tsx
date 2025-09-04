// contexts/UserContext.tsx
"use client";
import {getUserProfileReq} from "@/functionality/fetch";
import React, {createContext, useContext, useEffect, useState} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  isSuperUser: boolean;
  status: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loading: true,
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // console.log(user, "user in context");

  useEffect(() => {
    // Fetch user data on component mount
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // You might want to verify the token and fetch user data from your API
          // For now, we'll just set a mock user
          // In a real app, you would make an API call to get user info
          const userData = await getUserProfileReq(); // Implement this function
          // console.log(userData, "fetched user data");
          setUser({
            id: userData?.user?.id,
            name: userData?.user?.name,
            email: userData?.user?.email,
            isSuperUser: userData?.user?.isSuperUser,
            status: userData?.user?.status,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{user, setUser, loading}}>
      {children}
    </UserContext.Provider>
  );
};
