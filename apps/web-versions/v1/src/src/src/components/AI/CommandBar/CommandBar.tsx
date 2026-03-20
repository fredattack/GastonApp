import React, { useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CommandBarInput from "./CommandBarInput";
import CommandBarResults, { QuickAction } from "./CommandBarResults";
import useSpeechRecognition from "../../../hooks/useSpeechRecognition";
import { OpenAiService } from "../../../services/OpenAIService";

interface CommandBarProps {
    isOpen: boolean;
    onClose: () => void;
}

const CommandBar: React.FC<CommandBarProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const [query, setQuery] = useState("");
    const [aiResponse, setAiResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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
        },
        [navigate, onClose],
    );

    const quickActions = useMemo<QuickAction[]>(() => {
        const actions: QuickAction[] = [
            {
                id: "nav-dashboard",
                icon: "🏠",
                label: t("Dashboard"),
                description: t("Go to dashboard"),
                action: () => navigateAndClose("/"),
                category: "navigation",
            },
            {
                id: "nav-calendar",
                icon: "📅",
                label: t("Calendar"),
                description: t("View event calendar"),
                action: () => navigateAndClose("/calendar"),
                category: "navigation",
            },
            {
                id: "nav-pets",
                icon: "🐾",
                label: t("My Pets"),
                description: t("Manage your pets"),
                action: () => navigateAndClose("/content/pets"),
                category: "navigation",
            },
            {
                id: "nav-add-pet",
                icon: "➕",
                label: t("Add a Pet"),
                description: t("Register a new pet"),
                action: () => navigateAndClose("/content/pets/create"),
                category: "navigation",
            },
            {
                id: "ai-assistant",
                icon: "✨",
                label: t("AI Assistant"),
                description: t("Open full conversation"),
                action: () => navigateAndClose("/ai-assistant"),
                category: "ai",
            },
            {
                id: "ai-create-event",
                icon: "📝",
                label: t("Create an event"),
                description: t("Tell the AI what event to create"),
                action: () => {
                    setQuery(t("Create an event for "));
                },
                category: "ai",
            },
            {
                id: "ai-health-advice",
                icon: "💊",
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
            if (lowerQuery === keyword || lowerQuery === `go to ${keyword}` || lowerQuery === `aller au ${keyword}`) {
                navigateAndClose(path);
                return;
            }
        }

        // Send to AI
        setIsLoading(true);
        setAiResponse(null);

        try {
            const openAiService = OpenAiService.getInstance();
            const response = await openAiService.sendPromptApi(query.trim());

            // Handle response based on type
            const actionableTypes = [
                "createEvent",
                "updateEvent",
                "createPet",
                "updatePet",
            ];

            if (actionableTypes.includes(response.requestType)) {
                // Redirect to AI assistant with context for complex actions
                navigate("/ai-assistant");
                onClose();
                setQuery("");
                return;
            }

            // For queries, advice, etc. — show inline response
            setAiResponse(response.description);
        } catch (error) {
            setAiResponse(
                t("Sorry, I couldn't process your request. Please try again."),
            );
        } finally {
            setIsLoading(false);
        }
    }, [query, isLoading, navigate, navigateAndClose, onClose, t]);

    const handleActionSelect = useCallback(
        (action: QuickAction) => {
            action.action();
        },
        [],
    );

    const handleClose = useCallback(() => {
        onClose();
        setQuery("");
        setAiResponse(null);
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
            <div className="relative w-full max-w-xl mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate__animated animate__fadeInDown animate__faster">
                {/* Header hint */}
                <div className="flex items-center justify-between px-4 pt-3 pb-0">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="text-primary">✨</span>
                        <span>{t("AI-powered command bar")}</span>
                    </div>
                    <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 rounded font-mono">
                        ⌘K
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
                />

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-mono">
                                ↵
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
            </div>
        </div>
    );
};

export default CommandBar;
