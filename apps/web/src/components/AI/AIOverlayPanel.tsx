import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTimes,
    faExpand,
    faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { useAIAssistant } from "../../contexts/AIAssistantContext";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import ConversationThread from "../../pages/AIAssistant/components/ConversationThread";
import ChatInput from "../../pages/AIAssistant/components/ChatInput";

interface AIOverlayPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const AIOverlayPanel: React.FC<AIOverlayPanelProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { activeConversation, isLoading, sendMessage, createConversation } =
        useAIAssistant();

    const [voiceTranscript, setVoiceTranscript] = useState("");

    const handleTranscription = useCallback((text: string) => {
        setVoiceTranscript(text);
    }, []);

    const { isRecording, startRecording, stopRecording } =
        useSpeechRecognition(handleTranscription);

    const getPageContext = (): string => {
        const path = location.pathname;
        if (path.includes("/calendar")) return t("calendar");
        if (path.includes("/content/pets")) return t("pets");
        if (path === "/") return t("dashboard");
        return t("app");
    };

    const handleSend = useCallback(
        async (message: string) => {
            setVoiceTranscript("");
            if (!activeConversation) {
                createConversation(`Overlay - ${getPageContext()}`);
            }
            await sendMessage(message);
        },
        [activeConversation, createConversation, sendMessage],
    );

    const handleExpandToFull = () => {
        onClose();
        navigate("/ai-assistant");
    };

    const handleNewConversation = () => {
        createConversation();
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-[60] lg:bg-transparent"
                    onClick={onClose}
                />
            )}

            {/* Panel */}
            <div
                className={`fixed top-0 right-0 h-full z-[70] w-full sm:w-[420px] lg:w-[480px] bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">✨</span>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                                {t("AI Assistant")}
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {t("Context")}: {getPageContext()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={handleNewConversation}
                            className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            title={t("New conversation")}
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={handleExpandToFull}
                            className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            title={t("Open full assistant")}
                        >
                            <FontAwesomeIcon
                                icon={faExpand}
                                className="text-sm"
                            />
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            title={t("Close")}
                        >
                            <FontAwesomeIcon
                                icon={faTimes}
                                className="text-sm"
                            />
                        </button>
                    </div>
                </div>

                {/* Conversation */}
                <div className="flex flex-col h-[calc(100%-120px)]">
                    <ConversationThread
                        conversation={activeConversation}
                        isLoading={isLoading}
                    />
                </div>

                {/* Input */}
                <div className="absolute bottom-0 left-0 right-0">
                    <ChatInput
                        onSend={handleSend}
                        onVoiceStart={startRecording}
                        onVoiceStop={stopRecording}
                        isRecording={isRecording}
                        isLoading={isLoading}
                        placeholder={t("Ask about your {{context}}...", {
                            context: getPageContext(),
                        })}
                        externalValue={voiceTranscript}
                    />
                </div>
            </div>
        </>
    );
};

export default AIOverlayPanel;
