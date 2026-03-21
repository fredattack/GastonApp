/**
 * VoiceCommandFeedback
 *
 * Usage:
 *   <VoiceCommandFeedback result={voiceResult} onDismiss={() => setVoiceResult(null)} />
 *
 * Slides in from the top after a voice command is processed.
 * Green = executed, red = error, amber = low_confidence.
 * Auto-dismisses after 4 seconds.
 */
import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faExclamationTriangle,
    faTimesCircle,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";

interface VoiceCommandFeedbackProps {
    result: VoiceCommandResult | null;
    onDismiss: () => void;
}

const AUTO_DISMISS_MS = 4000;

const VoiceCommandFeedback: React.FC<VoiceCommandFeedbackProps> = ({
    result,
    onDismiss,
}) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!result) {
            return;
        }

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            onDismiss();
        }, AUTO_DISMISS_MS);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [result, onDismiss]);

    const isVisible = result !== null;

    if (!isVisible) {
        return null;
    }

    const config = {
        executed: {
            icon: faCheckCircle,
            containerClass:
                "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700",
            iconClass: "text-green-500 dark:text-green-400",
            textClass: "text-green-800 dark:text-green-200",
            subTextClass: "text-green-600 dark:text-green-400",
        },
        error: {
            icon: faTimesCircle,
            containerClass:
                "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700",
            iconClass: "text-red-500 dark:text-red-400",
            textClass: "text-red-800 dark:text-red-200",
            subTextClass: "text-red-600 dark:text-red-400",
        },
        low_confidence: {
            icon: faExclamationTriangle,
            containerClass:
                "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700",
            iconClass: "text-amber-500 dark:text-amber-400",
            textClass: "text-amber-800 dark:text-amber-200",
            subTextClass: "text-amber-600 dark:text-amber-400",
        },
    } as const;

    const variant = config[result.status];

    return (
        <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={[
                "flex items-start gap-3 px-4 py-3 rounded-xl border",
                "animate-slide-down",
                variant.containerClass,
            ].join(" ")}
            style={{
                animation: "slideDown 0.25s ease-out forwards",
            }}
        >
            <FontAwesomeIcon
                icon={variant.icon}
                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${variant.iconClass}`}
                aria-hidden="true"
            />

            <div className="flex-1 min-w-0">
                <p
                    className={`text-sm font-semibold leading-snug ${variant.textClass}`}
                >
                    {result.message}
                </p>
                {result.action && result.action !== "voice_command" && (
                    <p className={`text-xs mt-0.5 ${variant.subTextClass}`}>
                        {result.action}
                    </p>
                )}
            </div>

            <button
                type="button"
                onClick={onDismiss}
                className={`flex-shrink-0 p-1 rounded-md transition-colors hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${variant.iconClass}`}
                aria-label="Fermer"
            >
                <FontAwesomeIcon
                    icon={faTimes}
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                />
            </button>

            {/* Progress bar showing time until auto-dismiss */}
            <div
                className="absolute bottom-0 left-0 h-0.5 rounded-b-xl bg-current opacity-30"
                style={{
                    animation: `shrinkWidth ${AUTO_DISMISS_MS}ms linear forwards`,
                    width: "100%",
                }}
            />

            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes shrinkWidth {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
};

export default VoiceCommandFeedback;
