import axios from "axios";
import Bugsnag from "@bugsnag/js";
import { logger } from "../../utils/logger";
import { handleApiError } from "../../utils/errorHandler";

const baseURL = import.meta.env.VITE_API_URL;
const appBaseURL = baseURL.replace('/api/v1-0-0', '');
//
// if (localStorage.getItem('url') !== null) {
//     baseURL = localStorage.getItem('url');
// } else {
//     baseURL = window.location.protocol + "//" + window.location.host + "/";
//     if (window.location.host !== '127.0.0.1' && window.location.host !== 'localhost') {
//         localStorage.setItem('url', baseURL);
//     }
// }

const axiosClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Fetch CSRF token for Sanctum
async function fetchCsrfToken() {
    try {
        await axios.get(`${appBaseURL}/sanctum/csrf-cookie`, {
            withCredentials: true,
        });
    } catch (error) {
        logger.debug("CSRF token fetch attempted");
    }
}

// Add CSRF token to request headers
axiosClient.interceptors.request.use(
    (config) => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];

        if (token) {
            config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log error
        const errorMessage = handleApiError(error);
        logger.error("API request failed", error, {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
        });

        // Notify Bugsnag (only in production)
        if (import.meta.env.PROD) {
            Bugsnag.notify(error);
        }

        // Handle specific status codes
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Redirect to login
                    logger.warn("Unauthorized - redirecting to login");
                    window.location.href = "/login";
                    break;
                case 403:
                    logger.warn("Forbidden access");
                    break;
                case 404:
                    logger.warn("Resource not found");
                    break;
                case 422:
                    // Validation errors - let component handle
                    logger.debug("Validation error", error.response.data);
                    break;
                case 500:
                    logger.error("Server error", error);
                    break;
                default:
                    logger.error("Unhandled error status", error);
            }
        }

        return Promise.reject(error);
    },
);

export default axiosClient;
export { fetchCsrfToken };
