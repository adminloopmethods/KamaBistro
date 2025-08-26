// utils/roleManagement.ts

// Define your role IDs - these should match your backend role IDs
export const ROLE_IDS = {
  editor: "cme2mjacj0000oi6p5oz5mroh", // Replace with actual editor role ID
  verifier: "cme2mjacj0000oi6p5oz5mroh", // Replace with actual verifier role ID
} as const;

export type RoleType = keyof typeof ROLE_IDS;

// Helper function to get role ID
export const getRoleId = (role: RoleType): string => {
  return ROLE_IDS[role];
};

// Helper function to get role display name
export const getRoleDisplayName = (role: RoleType): string => {
  return role.charAt(0).toUpperCase() + role.slice(1);
};

// API functions for role management
import {assignPageRoleReq} from "@/functionality/fetch";

export interface AssignRoleData {
  webpageId: string;
  userId: string;
  role: RoleType;
}

export const assignUserToPageRole = async (data: AssignRoleData) => {
  const roleId = getRoleId(data.role);

  const assignmentData = {
    webpageId: data.webpageId,
    userId: data.userId,
    roleId: roleId,
  };

  return await assignPageRoleReq(assignmentData);
};

// If you need to implement a remove role function
export const removeUserFromPageRole = async (
  webpageId: string,
  userId: string,
  role: RoleType
) => {
  // This would need to be implemented based on your API
  // For now, return a success response
  return {ok: true};
};
