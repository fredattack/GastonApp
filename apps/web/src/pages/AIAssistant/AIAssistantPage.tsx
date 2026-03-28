import React, { useState, useCallback } from "react";
import { ArrowLeft, Info, List, X } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useAIAssistant } from "../../contexts/AIAssistantContext";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import ConversationSidebar from "./components/ConversationSidebar";
import ConversationThread from "./components/ConversationThread";
import ChatInput from "./components/ChatInput";

const AIAssistantPage: React.FC = () => {
    const navigate = useNavigate();
    const { activeConversation, isLoading, sendMessage } = useAIAssistant();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [voiceTranscript, setVoiceTranscript] = useState("");

    const handleTranscription = useCallback((text: string) => {
        setVoiceTranscript(text);
    }, []);

    const { isRecording, startRecording, stopRecording } =
        useSpeechRecognition(handleTranscription);

    const handleSendMessage = async (message: string) => {
        setVoiceTranscript("");
        await sendMessage(message);
    };

    const handleBack = () => {
        navigate("/");
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-white dark:bg-gray-900" data-testid="ai-assistant-page">
            {/* Header */}
            <header className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleBack}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors lg:hidden"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <button
                            onClick={
                                window.innerWidth < 1024
                                    ? toggleMobileSidebar
                                    : toggleSidebar
                            }
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            aria-label="Toggle sidebar"
                        >
                            {isSidebarOpen ? (
                                <X size={20} />
                            ) : (
                                <List size={20} />
                            )}
                        </button>

                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white" data-testid="ai-assistant-title">
                                Assistant Gaston
                            </h1>
                            {activeConversation && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {activeConversation.title}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleBack}
                        className="hidden lg:flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Retour</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Desktop Sidebar */}
                <div className="hidden lg:block h-full overflow-hidden">
                    <ConversationSidebar isOpen={isSidebarOpen} />
                </div>

                {/* Mobile Sidebar Overlay */}
                {isMobileSidebarOpen && (
                    <div
                        className="fixed inset-0 z-50 lg:hidden"
                        onClick={toggleMobileSidebar}
                    >
                        <div
                            className="absolute inset-0 bg-black/50"
                            aria-hidden="true"
                        />
                        <div
                            className="absolute inset-y-0 left-0 w-80 max-w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ConversationSidebar
                                isOpen
                                onClose={toggleMobileSidebar}
                            />
                        </div>
                    </div>
                )}

                {/* Conversation Thread */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* AI Health Disclaimer */}
                    <div
                        className="flex-shrink-0 flex items-center gap-2 px-4 py-2"
                        data-testid="ai-health-disclaimer"
                        style={{
                            backgroundColor: "#F4F1E8",
                            fontFamily: "Nunito, sans-serif",
                            fontSize: "12px",
                            color: "#6B5E4F",
                        }}
                    >
                        <Info
                            size={16}
                            weight="bold"
                            style={{ color: "#8FA998", flexShrink: 0 }}
                        />
                        <span>
                            Gaston utilise l'intelligence artificielle. Ses
                            conseils ne remplacent pas l'avis d'un vétérinaire.
                        </span>
                    </div>

                    <ConversationThread
                        conversation={activeConversation}
                        isLoading={isLoading}
                    />

                    {/* Chat Input */}
                    <ChatInput
                        onSend={handleSendMessage}
                        onVoiceStart={startRecording}
                        onVoiceStop={stopRecording}
                        isRecording={isRecording}
                        isLoading={isLoading}
                        placeholder="Posez votre question..."
                        externalValue={voiceTranscript}
                    />
                </div>
            </div>
        </div>
    );
};

export default AIAssistantPage;
