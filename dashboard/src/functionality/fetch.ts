import endpoint from "@/utils/endpoints";

type methods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OTPTIONS"

// Interface for generic response
interface ApiResponse<T = any> {
    ok: boolean;
    error?: string;
    [key: string]: any;
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
    window.location.href = "/login";
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
        return { error: "Session expired. Please log in again.", ok: false };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const finalHeaders: HeadersType = {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const options: RequestInit = {
        method: method.toUpperCase(),
        headers: finalHeaders,
        credentials: cookie ? "include" : "same-origin",
        signal: controller.signal,
        ...(body && method.toUpperCase() !== "GET" ? { body } : {}),
    };

    let result: ApiResponse = { ok: false, error: "Unknown error" };

    try {
        const response = await fetch(uri, options);

        if (response.status === 555) {
            clearSession();
            return { error: "Critical session error. Please log in again.", ok: false };
        }

        if (!response.ok) {
            const err = await response.json();
            throw err;
        }

        result = await response.json();
        result.ok = true;
    } catch (err: any) {
        if (err.name === "AbortError") {
            result = { error: "Request timed out", ok: false };
        } else {
            result = { ...err, ok: false };
        }
    } finally {
        clearTimeout(timeoutId);
        return result;
    }
}


// Content-Type presets
const ContentType = {
    json: { "Content-Type": "application/json" },
};

// API Calls

// Auth login
export async function loginReq(data: Record<string, any>): Promise<ApiResponse> {
    return await makerequest(
        endpoint.route("login"),
        "POST",
        JSON.stringify(data),
        ContentType.json
    );
}

// Get all users
export async function getUsersReq(): Promise<ApiResponse> {
    return await makerequest(endpoint.route("getUsers"), "GET");
}

// Create a new user
export async function createUserReq(data: Record<string, any>): Promise<ApiResponse> {
    return await makerequest(
        endpoint.route("submitUser"),
        "POST",
        JSON.stringify(data),
        ContentType.json
    );
}

// Update an existing user
export async function updateUserReq(id: string, data: Record<string, any>): Promise<ApiResponse> {
    return await makerequest(
        endpoint.route("updateUser") + id,
        "PUT",
        JSON.stringify(data),
        ContentType.json
    );
}

// Switch user status
export async function switchStatusReq(id: string, data: Record<string, any>): Promise<ApiResponse> {
    return await makerequest(
        endpoint.route("changeStatus") + id,
        "PUT",
        JSON.stringify(data),
        ContentType.json
    );
}

export async function createContentReq(data: Record<string, any>): Promise<ApiResponse> {
    return await makerequest(
        endpoint.route("createContent"),
        "POST",
        JSON.stringify(data),
        ContentType.json
    );
}

// Save content (update)
export async function saveContentReq(data: Record<string, any>): Promise<ApiResponse> {
    return await makerequest(
        endpoint.route("createContent"),
        "PUT",
        JSON.stringify(data),
        ContentType.json
    );
}

export async function getContentReq(id: string): Promise<ApiResponse> {
    return await makerequest(
        endpoint.route("createContent") + id,
        "GET",
    );
}

export async function fetchAllImages(
    query?: FetchAllImagesQuery
): Promise<ApiResponse> {
    if (
        !query ||
        typeof query !== "object" ||
        Object.keys(query).length === 0
    ) {
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
