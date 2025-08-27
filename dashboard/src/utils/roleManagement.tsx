// utils/roleManagement.ts
import {assignPageRoleReq} from "@/functionality/fetch";

export interface AssignRoleData {
  webpageId: string;
  userId: string;
  roleId: string;
}

export const assignUserToPageRole = async (data: AssignRoleData) => {
  return await assignPageRoleReq(data);
};
