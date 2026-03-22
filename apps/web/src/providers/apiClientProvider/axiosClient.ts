import axios from "axios";
import Bugsnag from "@bugsnag/js";
import { logger } from "../../utils/logger";
import { handleApiError } from "../../utils/errorHandler";

const baseURL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

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
                    // Don't redirect here - let ProtectedRoute handle it
                    logger.warn("Unauthorized - token invalid or expired");
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

function setAuthToken(token: string) {
    axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`;
}

function clearAuthToken() {
    delete axiosClient.defaults.headers.common.Authorization;
}

export default axiosClient;
export { setAuthToken, clearAuthToken };
