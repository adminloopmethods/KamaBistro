import endpoint from "@/utils/endpoints";

type methods = "GET" | "POST" | "OTPTIONS"

// Interface for generic response
interface ApiResponse<T = any> {
    ok: boolean;
    error?: string;
    [key: string]: any;
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
    method: methods,
    body?: string,
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

export async function getContentReq(id: string): Promise<ApiResponse> {
    console.log("weqrqwer")
    return await makerequest(
        endpoint.route("content") + (id === "" ? "home" : id),
        "GET",
    );
}

export async function sendMessageReq(formData: Record<string, any>) {
    return await makerequest(
        endpoint.route("contact"),
        "POST",
        JSON.stringify(formData),
        ContentType.json
    )
}