/**
 * Unified error handling utility
 */

import { logger } from "./logger";

export interface ApiError {
    status?: number;
    message: string;
    code?: string;
    errors?: Record<string, string[]>;
}

/**
 * Handle API errors with consistent messaging
 */
export const handleApiError = (error: unknown): string => {
    logger.error("API Error occurred", error as Error);

    // Axios error with response
    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        error.response &&
        typeof error.response === "object"
    ) {
        const response = error.response as {
            status?: number;
            data?: { message?: string; errors?: Record<string, string[]> };
        };

        switch (response.status) {
            case 400:
                return response.data?.message || "Invalid request";
            case 401:
                return "Please log in again";
            case 403:
                return "You don't have permission to perform this action";
            case 404:
                return "Resource not found";
            case 422:
                // Laravel validation errors
                if (response.data?.errors) {
                    const errors = Object.values(response.data.errors).flat();
                    return errors.join(", ");
                }
                return response.data?.message || "Validation error";
            case 429:
                return "Too many requests. Please try again later";
            case 500:
                return "Server error. Please try again later";
            case 503:
                return "Service temporarily unavailable";
            default:
                return response.data?.message || "An error occurred";
        }
    }

    // Network error
    if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string" &&
        error.message.includes("Network Error")
    ) {
        return "Network error. Please check your connection";
    }

    // Timeout error
    if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "ECONNABORTED"
    ) {
        return "Request timeout. Please try again";
    }

    // Generic error with message
    if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
    ) {
        return error.message;
    }

    // Unknown error
    return "An unexpected error occurred";
};

/**
 * Handle async operations with error handling
 */
export async function tryCatch<T>(
    fn: () => Promise<T>,
    errorMessage = "An error occurred",
): Promise<[T | null, string | null]> {
    try {
        const result = await fn();
        return [result, null];
    } catch (error) {
        const message = handleApiError(error);
        logger.error(errorMessage, error as Error);
        return [null, message];
    }
}

/**
 * Retry async operation with exponential backoff
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000,
): Promise<T> {
    let lastError: unknown;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (i < maxRetries - 1) {
                const delay = baseDelay * 2 ** i;
                logger.debug(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError;
}
