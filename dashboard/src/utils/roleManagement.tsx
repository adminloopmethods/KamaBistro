// roleManagement.ts
import {
  assignPageRoleReq,
  removePageRoleReq,
  getRolesReq,
} from "@/functionality/fetch";

export interface RoleAssignmentData {
  webpageId: string;
  userId: string;
  roleId: string;
}

export interface RoleRemovalData {
  webpageId: string;
  roleId: string;
}

export interface Role {
  id: string;
  name: string;
}

export const assignUserToPageRole = async (data: RoleAssignmentData) => {
  try {
    const response = await assignPageRoleReq(data);
    return response;
  } catch (error) {
    console.error("Error assigning user to page role:", error);
    return {ok: false, error: "Failed to assign user"};
  }
};

export const removeUserFromPageRole = async (data: RoleRemovalData) => {
  try {
    const response = await removePageRoleReq(data);
    return response;
  } catch (error) {
    console.error("Error removing user from page role:", error);
    return {ok: false, error: "Failed to remove user"};
  }
};

export const getRoleByName = async (roleName: string): Promise<Role | null> => {
  try {
    const rolesResponse = await getRolesReq();

    if (!rolesResponse.ok) {
      console.error("Failed to fetch roles:", rolesResponse.error);
      return null;
    }

    // Handle different response structures
    const roles = rolesResponse.roles || rolesResponse.data || [];

    const role = roles.find(
      (r: any) => r.name.toUpperCase() === roleName.toUpperCase()
    );

    return role || null;
  } catch (error) {
    console.error("Error fetching role:", error);
    return null;
  }
};

export const getAllRoles = async (): Promise<Role[]> => {
  try {
    const rolesResponse = await getRolesReq();

    if (!rolesResponse.ok) {
      console.error("Failed to fetch roles:", rolesResponse.error);
      return [];
    }

    // Handle different response structures
    return rolesResponse.roles || rolesResponse.data || [];
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
};
