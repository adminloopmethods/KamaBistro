import endpoint from "@/utils/endpoints";
import {json} from "stream/consumers";

type methods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OTPTIONS";

// Interface for generic response

export interface AuditLog {
  id: string;
  action_performed: string;
  actionType: string;
  entity: string;
  entityId: string;
  oldValue: any;
  newValue: any;
  ipAddress: string;
  browserInfo: string;
  outcome: string;
  timestamp: string;
  metadata: any;
  user: {
    auditLogId: string;
    userId: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      image: string;
      email: string;
      password: string;
      isSuperUser: boolean;
      status: string;
      phone: string;
      createdAt: string;
      updatedAt: string;
      locationId: string | null;
    };
  };
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: {
    totalLogs: number;
    totalPages: number;
    currentPage: number;
    limitNum: number;
  };
}

interface ApiResponse<T = any> {
  ok: boolean;
  error?: string;
  [key: string]: any;
}

interface ForgotPasswordInitRequest {
  email: string;
  deviceId: string;
  otpOrigin: string;
}

interface ForgotPasswordVerifyRequest extends ForgotPasswordInitRequest {
  otp: string;
}

interface ForgotPasswordUpdateRequest {
  email: string;
  deviceId: string;
  otpOrigin: string;
  new_password: string;
  repeat_password: string;
}

export interface UploadMediaResponse {
  ok: boolean;
  message?: string;
  imageUrl?: string;
  [key: string]: any;
}

export interface FetchAllImagesQuery {
  [key: string]: string | number | boolean | undefined;
}

// Check if JWT token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

// Clear all storage except theme and redirect
const clearSession = (): void => {
  const theme = localStorage.getItem("theme");
  localStorage.clear();
  if (theme) localStorage.setItem("theme", theme);
  window.location.href = "/auth";
};

// Headers type
type HeadersType = Record<string, string>;

// Core fetch logic
const makerequest = async (
  uri: string,
  method: string = "GET",
  body?: string | FormData,
  headers: HeadersType = {},
  cookie: boolean = false,
  timeout: number = 10000
): Promise<ApiResponse> => {
  const token = localStorage.getItem("token");

  if (token && isTokenExpired(token)) {
    clearSession();
    return {error: "Session expired. Please log in again.", ok: false};
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const finalHeaders: HeadersType = {
    ...headers,
    ...(token ? {Authorization: `Bearer ${token}`} : {}),
  };

  const options: RequestInit = {
    method: method.toUpperCase(),
    headers: finalHeaders,
    credentials: cookie ? "include" : "same-origin",
    signal: controller.signal,
    ...(body && method.toUpperCase() !== "GET" ? {body} : {}),
  };

  let result: ApiResponse = {ok: false, error: "Unknown error"};

  try {
    const response = await fetch(uri, options);

    if (response.status === 555) {
      clearSession();
      return {error: "Critical session error. Please log in again.", ok: false};
    }

    if (!response.ok) {
      const err = await response.json();
      throw err;
    }

    result = await response.json();
    result.ok = true;
  } catch (err: any) {
    if (err.name === "AbortError") {
      result = {error: "Request timed out", ok: false};
    } else {
      result = {...err, ok: false};
    }
  } finally {
    clearTimeout(timeoutId);
    return result;
  }
};

// Content-Type presets
const ContentType = {
  json: {"Content-Type": "application/json"},
};

// API Calls

// Auth login
export async function loginReq(
  data: Record<string, any>
): Promise<ApiResponse> {
  return await makerequest(
    endpoint.route("login"),
    "POST",
    JSON.stringify(data),
    ContentType.json
  );
}

// Forgot password
// Forgot Password - Step 1: Initiate
export async function forgotPasswordReq(
  data: ForgotPasswordInitRequest
): Promise<ApiResponse> {
  return await makerequest(
    endpoint.route("forgotPassword"),
    "POST",
    JSON.stringify(data),
    ContentType.json
  );
}

// Forgot Password - Step 2: Verify OTP
export async function forgotPasswordVerifyReq(
  data: ForgotPasswordVerifyRequest
): Promise<ApiResponse> {
  return await makerequest(
    endpoint.route("forgotPasswordVerify"),
    "POST",
    JSON.stringify(data),
    ContentType.json
  );
}

// Forgot Password - Step 3: Update Password
export async function forgotPasswordUpdateReq(
  data: ForgotPasswordUpdateRequest
): Promise<ApiResponse> {
  return await makerequest(
    endpoint.route("forgotPasswordUpdate"),
    "POST",
    JSON.stringify(data),
    ContentType.json
  );
}

// Get all users
export async function getUsersReq(): Promise<ApiResponse> {
  return await makerequest(endpoint.route("getUsers"), "GET");
}

export async function getUserProfileReq(): Promise<ApiResponse> {
  return await makerequest(endpoint.route("getUserProfile"), "GET");
}

export async function getLocationsReq(): Promise<ApiResponse> {
  return await makerequest(endpoint.route("getLocations"), "GET");
}

//delete user
export async function deleteUserReq(id: string): Promise<ApiResponse> {
  return await makerequest(endpoint.route("deleteUser") + id, "DELETE");
}

//get audit logs
export async function getAuditLogsReq(): Promise<
  ApiResponse<AuditLogsResponse>
> {
  return await makerequest(endpoint.route("getAuditLogs"), "GET");
}

export async function activateUserReq(id: string): Promise<ApiResponse> {
  return await makerequest(
    endpoint.route("activateUser"),
    "PUT",
    JSON.stringify({id}),
    ContentType.json
  );
}

export async function deactivateUserReq(id: string): Promise<ApiResponse> {
  return await makerequest(
    endpoint.route("deactivateUser"),
    "PUT",
    JSON.stringify({id}),
    ContentType.json
  );
}

export async function assignPageRoleReq(
  data: Record<string, any>
): Promise<ApiResponse> {
  return await makerequest(
    endpoint.route("assignPageRole"),
    "POST",
    JSON.stringify(data),
    ContentType.json
  );
}

export async function removePageRoleReq(
  data: Record<string, any>
): Promise<ApiResponse> {
  return await makerequest(
    endpoint.route("removePageRole"),
    "DELETE",
    JSON.stringify(data),
    ContentType.json
  );
}

export async function getRolesReq(): Promise<ApiResponse> {
  return await makerequest(endpoint.route("getRoles"), "GET");
}

// Create a new user
export async function createUserReq(
  data: Record<string, any>
): Promise<ApiResponse> {
  return await makerequest(
    endpoint.route("createUser"),
    "POST",
    JSON.stringify(data),
    ContentType.json
  );
}

// Update an existing user
export async function updateUserReq(
  id: string,
  data: Record<string, any>
): Promise<ApiResponse> {
  return await makerequest(
    endpoint.route("updateUser") + id,
    "PUT",
    JSON.stringify(data),
    ContentType.json
  );
}

// Switch user status
export async function switchStatusReq(
  id: string,
  data: Record<string, any>
): Promise<ApiResponse> {
  return await makerequest(
    endpoint.route("changeStatus") + id,
    "PUT",
    JSON.stringify(data),
    ContentType.json
  );
}

export async function createContentReq(
  data: Record<string, any>
): Promise<ApiResponse> {
  return await makerequest(
    endpoint.route("createContent"),
    "POST",
    JSON.stringify(data),
    ContentType.json
  );
}

export async function proposeUpdateReq(
  id: string,
  data: Record<string, any>
): Promise<ApiResponse> {
  return await makerequest(
    endpoint.route("proposeUpdate") + id,
    "POST",
    JSON.stringify(data),
    ContentType.json
  );
}

// Save content (update)
export async function saveContentReq(
  id: string,
  data: Record<string, any>
): Promise<ApiResponse> {
  return await makerequest(
    endpoint.route("createContent") + id,
    "PUT",
    JSON.stringify(data),
    ContentType.json
  );
}

export async function getWebpageReq(id: string): Promise<ApiResponse> {
  return await makerequest(endpoint.route("createContent") + id, "GET");
}

export async function getAllWebpagesReq(): Promise<ApiResponse> {
  return await makerequest(endpoint.route("createContent"), "GET");
}

export async function getSectionNamesReq(): Promise<ApiResponse> {
  return await makerequest(endpoint.route("getSection"), "GET");
}

export async function getSectionReq(id: string): Promise<ApiResponse> {
  return await makerequest(endpoint.route("getSection") + id, "GET");
}

export async function fetchAllImages(
  query?: FetchAllImagesQuery
): Promise<ApiResponse> {
  if (!query || typeof query !== "object" || Object.keys(query).length === 0) {
    return await makerequest(endpoint.route("getMedia"), "GET");
  }

  const params = new URLSearchParams(
    Object.entries(query).map(([key, value]) => [key, String(value)])
  ).toString();

  const url = `${endpoint.route("getMedia")}?${params}`;

  return await makerequest(url, "GET");
}

// Upload media file(s)
export async function uploadMedia(
  data: FormData
): Promise<Record<string, any>> {
  return await makerequest(
    endpoint.route("uploadMedia"),
    "POST",
    data // makerequest accepts FormData without setting Content-Type manually
  );
}

// Delete media by ID
export async function deleteMedia(id: string): Promise<Record<string, any>> {
  if (typeof id === "string" && id.trim() !== "") {
    return await makerequest(
      `${endpoint.route("deleteMedia")}${id}`,
      "DELETE",
      id, // body still passed as in your original JS
      {},
      true // include cookies
    );
  } else {
    throw new Error("No ID received");
  }
}

export async function sendMessageReq(formData: Record<string, any>) {
  return await makerequest(
    endpoint.route("contact"),
    "POST",
    JSON.stringify(formData),
    ContentType.json
  );
}
