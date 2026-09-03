// api.js
import CONFIG from "./config.js";

/**
 * Base API URL resolved by config.js.
 *
 * Development:
 *   http://localhost:3001/api
 *
 * Production:
 *   /api
 */
const API_BASE_URL = CONFIG.api.real;

/**
 * Location API endpoint.
 */
const LOCATION_API_URL = CONFIG.api.location;

/**
 * Default request timeout.
 */
const REQUEST_TIMEOUT = CONFIG.timeout;

/**
 * Build an API URL from a path.
 *
 * Example:
 *   apiUrl("/jobs")
 *   -> http://localhost:3001/api/jobs
 */
export function apiUrl(path = "") {
    const normalizedPath = path.startsWith("/")
        ? path
        : `/${path}`;

    return `${API_BASE_URL}${normalizedPath}`;
}

/**
 * Make a request using the settings from config.js.
 *
 * The request automatically uses CONFIG.timeout and supports
 * both development and production API URLs.
 */
export async function apiFetch(path, options = {}) {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, REQUEST_TIMEOUT);

    try {
        const response = await fetch(apiUrl(path), {
            ...options,
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        });

        if (!response.ok) {
            throw new Error(
                `API request failed: ${response.status} ${response.statusText}`
            );
        }

        return response;
    } finally {
        clearTimeout(timeoutId);
    }
}

/**
 * Convenience helper for JSON API responses.
 */
export async function apiJson(path, options = {}) {
    const response = await apiFetch(path, options);
    return response.json();
}

/**
 * Get the configured location endpoint.
 */
export function locationUrl() {
    return LOCATION_API_URL;
}

/**
 * Export the resolved configuration as well.
 */
export { CONFIG };

export default {
    CONFIG,
    API_BASE_URL,
    LOCATION_API_URL,
    REQUEST_TIMEOUT,
    apiUrl,
    apiFetch,
    apiJson,
    locationUrl
};
