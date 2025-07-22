import endpoint from "../utils/endpoints/endpoints";


const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        return payload.exp * 1000 < Date.now(); // Check if expiration time has passed
    } catch (error) {
        return true; // Assume expired if there's an error
    }
};

const clearSession = () => {
    const theme = localStorage.getItem("theme"); // Preserve theme
    localStorage.clear(); // Clear all storage
    if (theme) {
        localStorage.setItem("theme", theme); // Restore theme
    }
    window.location.href = "/login"; // Redirect to login page
};

const makerequest = async (
    uri,
    method = "GET",
    body = undefined,
    headers = {},
    cookie = false,
    timeout = 10000
) => {
    let token = localStorage.getItem("token");

    // Check if token is expired and clear session if it is
    if (token && isTokenExpired(token)) {
        clearSession();
        return { error: "Session expired. Please log in again.", ok: false };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    method = method.toUpperCase();

    const finalHeaders = {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const options = {
        method,
        headers: finalHeaders,
        credentials: cookie ? "include" : "same-origin",
        signal: controller.signal,
    };

    if (body && method !== "GET") {
        options.body = body;
    }

    let result;
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
    } catch (err) {
        if (err.name === "AbortError") {
            result = { error: "Request timed out" };
        } else {
            result = err;
            result.ok = false;
        }
    } finally {
        clearTimeout(timeoutId);
        return result;
    }
};

const ContentType = {
    json: { "Content-Type": "application/json" },
};

// fetch for auth
export async function loginReq(data) {
    return await makerequest(
        endpoint.route("login"),
        "POST",
        JSON.stringify(data),
        ContentType.json
    );
}