import React, { useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    CalendarPlus,
    FirstAid,
    Sparkle,
} from "@phosphor-icons/react";
import CommandBarInput from "./CommandBarInput";
import CommandBarResults, { QuickAction } from "./CommandBarResults";
import useSpeechRecognition from "../../../hooks/useSpeechRecognition";
import { OpenAiService } from "../../../services/OpenAIService";

interface CommandBarProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenChat?: (query: string, response: AIResponse) => void;
}

const CommandBar: React.FC<CommandBarProps> = ({
    isOpen,
    onClose,
    onOpenChat,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const [query, setQuery] = useState("");
    const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleTranscription = useCallback((text: string) => {
        setQuery(text);
    }, []);

    const { isRecording, startRecording, stopRecording } =
        useSpeechRecognition(handleTranscription);

    const handleRecordToggle = useCallback(() => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }, [isRecording, startRecording, stopRecording]);

    const navigateAndClose = useCallback(
        (path: string) => {
            navigate(path);
            onClose();
            setQuery("");
            setAiResponse(null);
            setSuccessMessage(null);
        },
        [navigate, onClose],
    );

    const quickActions = useMemo<QuickAction[]>(() => {
        const actions: QuickAction[] = [
            {
                id: "ai-assistant",
                icon: <Sparkle size={18} />,
                label: t("AI Assistant"),
                description: t("Open full conversation"),
                action: () => navigateAndClose("/ai-assistant"),
                category: "ai",
            },
            {
                id: "ai-create-event",
                icon: <CalendarPlus size={18} />,
                label: t("Create an event"),
                description: t("Tell the AI what event to create"),
                action: () => {
                    setQuery(t("Create an event for "));
                },
                category: "ai",
            },
            {
                id: "ai-health-advice",
                icon: <FirstAid size={18} />,
                label: t("Health advice"),
                description: t("Ask about your pet's health"),
                action: () => {
                    setQuery(t("Health advice for "));
                },
                category: "ai",
            },
        ];

        return actions;
    }, [t, navigateAndClose]);

    const sendQuery = useCallback(
        async (prompt: string) => {
            if (!prompt.trim() || isLoading) return;

            setIsLoading(true);
            setAiResponse(null);
            setSuccessMessage(null);

            try {
                const openAiService = OpenAiService.getInstance();
                const response =
                    await openAiService.sendPromptApi(prompt.trim());

                // Clarification/low confidence: redirect to assistant page
                const redirectStatuses = [
                    "needs_clarification",
                    "low_confidence",
                ];
                if (redirectStatuses.includes(response.status || "")) {
                    if (onOpenChat) {
                        onOpenChat(prompt, response);
                    }
                    onClose();
                    setQuery("");
                    setIsLoading(false);
                    return;
                }

                setAiResponse(response);
            } catch {
                setAiResponse({
                    status: "error",
                    conversationResponse: t(
                        "The service is temporarily unavailable.",
                    ),
                    confidenceScore: 0,
                    requestType: "query",
                    description: "",
                });
            } finally {
                setIsLoading(false);
            }
        },
        [isLoading, t, onOpenChat, onClose],
    );

    const handleSubmit = useCallback(async () => {
        if (!query.trim() || isLoading) return;

        // Check for simple navigation commands
        const lowerQuery = query.toLowerCase().trim();
        const navMap: Record<string, string> = {
            calendrier: "/calendar",
            calendar: "/calendar",
            animaux: "/content/pets",
            pets: "/content/pets",
            "mes animaux": "/content/pets",
            "my pets": "/content/pets",
            dashboard: "/",
            accueil: "/",
            home: "/",
        };

        for (const [keyword, path] of Object.entries(navMap)) {
            if (
                lowerQuery === keyword ||
                lowerQuery === `go to ${keyword}` ||
                lowerQuery === `aller au ${keyword}`
            ) {
                navigateAndClose(path);
                return;
            }
        }

        await sendQuery(query);
    }, [query, isLoading, navigateAndClose, sendQuery]);

    const handleConfirm = useCallback(async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            const openAiService = OpenAiService.getInstance();
            const response = await openAiService.sendPromptApi(query.trim(), {
                confirmed: true,
            });

            if (
                response.status === "executed" ||
                !response.status
            ) {
                setSuccessMessage(
                    response.conversationResponse ||
                        response.description ||
                        t("Action completed!"),
                );
                setAiResponse(null);
                setTimeout(() => {
                    onClose();
                    setQuery("");
                    setSuccessMessage(null);
                }, 1500);
            } else {
                setAiResponse(response);
            }
        } catch {
            setAiResponse({
                status: "error",
                conversationResponse: t(
                    "The action could not be executed.",
                ),
                score: 0,
                requestType: "query",
                description: "",
                data: {} as QueryResult,
            });
        } finally {
            setIsLoading(false);
        }
    }, [query, onClose, t]);

    const handleRetry = useCallback(() => {
        setAiResponse(null);
        sendQuery(query);
    }, [query, sendQuery]);

    const handleClarify = useCallback(
        (correctedName: string) => {
            // Replace the ambiguous part in the original query
            const newQuery = query.replace(
                /\b\w+\b/,
                correctedName,
            );
            setQuery(newQuery);
            sendQuery(newQuery);
        },
        [query, sendQuery],
    );

    const handleContinueInChat = useCallback(() => {
        if (aiResponse && onOpenChat) {
            onOpenChat(query, aiResponse);
        }
        onClose();
        setQuery("");
        setAiResponse(null);
    }, [aiResponse, query, onOpenChat, onClose]);

    const handleNavigate = useCallback(
        (path: string) => {
            navigateAndClose(path);
        },
        [navigateAndClose],
    );

    const handleActionSelect = useCallback((action: QuickAction) => {
        action.action();
    }, []);

    const handleClose = useCallback(() => {
        onClose();
        setQuery("");
        setAiResponse(null);
        setSuccessMessage(null);
        if (isRecording) stopRecording();
    }, [onClose, isRecording, stopRecording]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Command Bar Modal */}
            <div className="relative w-full max-w-xl mx-4 bg-[#FDFCFA] dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate__animated animate__fadeInDown animate__faster">
                {/* Success State */}
                {successMessage ? (
                    <div className="flex flex-col items-center justify-center py-10 px-6">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                            <svg
                                className="w-6 h-6 text-primary"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 text-center">
                            {successMessage}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Header hint */}
                        <div className="flex items-center justify-between px-4 pt-3 pb-0">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Sparkle
                                    size={14}
                                    weight="fill"
                                    className="text-primary"
                                />
                                <span>
                                    {t("AI-powered command bar")}
                                </span>
                            </div>
                            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 rounded font-mono">
                                {"\u2318"}K
                            </kbd>
                        </div>

                        {/* Input */}
                        <CommandBarInput
                            value={query}
                            onChange={setQuery}
                            onSubmit={handleSubmit}
                            onRecordToggle={handleRecordToggle}
                            isRecording={isRecording}
                            isLoading={isLoading}
                        />

                        {/* Results */}
                        <CommandBarResults
                            query={query}
                            actions={quickActions}
                            aiResponse={aiResponse}
                            isLoading={isLoading}
                            onActionSelect={handleActionSelect}
                            onConfirm={handleConfirm}
                            onRetry={handleRetry}
                            onClarify={handleClarify}
                            onContinueInChat={handleContinueInChat}
                            onNavigate={handleNavigate}
                        />

                        {/* Footer */}
                        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-mono">
                                        {"\u21B5"}
                                    </kbd>
                                    {t("to send")}
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-mono">
                                        esc
                                    </kbd>
                                    {t("to close")}
                                </span>
                            </div>
                            <span>{t("Powered by AI")}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CommandBar;
