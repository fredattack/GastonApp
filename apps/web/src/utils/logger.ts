/**
 * Logger utility - replaces console.log in production
 *
 * Usage:
 * - logger.debug() - Only in development
 * - logger.info() - Always logged
 * - logger.warn() - Always logged
 * - logger.error() - Always logged + sent to Bugsnag
 */

import Bugsnag from "@bugsnag/js";

const isDevelopment = import.meta.env.MODE === "development";

class Logger {
    /**
     * Debug logs - only in development
     */
    debug(...args: unknown[]): void {
        if (isDevelopment) {
            console.log("[DEBUG]", ...args);
        }
    }

    /**
     * Info logs - always shown
     */
    info(...args: unknown[]): void {
        console.log("[INFO]", ...args);
    }

    /**
     * Warning logs - always shown
     */
    warn(...args: unknown[]): void {
        console.warn("[WARN]", ...args);
    }

    /**
     * Error logs - always shown + sent to Bugsnag
     */
    error(message: string, error?: Error | unknown, metadata?: Record<string, unknown>): void {
        console.error("[ERROR]", message, error);

        // Send to Bugsnag in production
        if (!isDevelopment && error instanceof Error) {
            Bugsnag.notify(error, (event) => {
                event.context = message;
                if (metadata) {
                    event.addMetadata("custom", metadata);
                }
            });
        }
    }

    /**
     * Group console logs (development only)
     */
    group(label: string): void {
        if (isDevelopment) {
            console.group(label);
        }
    }

    /**
     * End group
     */
    groupEnd(): void {
        if (isDevelopment) {
            console.groupEnd();
        }
    }

    /**
     * Table output (development only)
     */
    table(data: unknown): void {
        if (isDevelopment) {
            console.table(data);
        }
    }
}

export const logger = new Logger();