import {getUserProfileReq} from "@/functionality/fetch";

export const isAdmin = (): boolean => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Token payload:", payload);

      return payload.isSuperUser === true;
    } catch (error) {
      console.error("Error parsing token:", error);
      return false;
    }
  }
  return false;
};

export const verifyAdminStatus = async (): Promise<boolean> => {
  try {
    const response = await getUserProfileReq();
    // const user = await response.json();
    console.log("User profile:", response);
    return response?.user?.isSuperUser === true;
  } catch (error) {
    console.error("Error verifying admin status:", error);
    return false;
  }
};
