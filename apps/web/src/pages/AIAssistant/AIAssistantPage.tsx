import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faBars,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAIAssistant } from "../../contexts/AIAssistantContext";
import ConversationSidebar from "./components/ConversationSidebar";
import ConversationThread from "./components/ConversationThread";
import ChatInput from "./components/ChatInput";

const AIAssistantPage: React.FC = () => {
    const navigate = useNavigate();
    const { activeConversation, isLoading, sendMessage } = useAIAssistant();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const handleSendMessage = async (message: string) => {
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
        <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
            {/* Header */}
            <header className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleBack}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors lg:hidden"
                            aria-label="Go back"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
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
                            <FontAwesomeIcon
                                icon={isSidebarOpen ? faTimes : faBars}
                            />
                        </button>

                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                                AI Assistant
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
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <span>Back to Calendar</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Desktop Sidebar */}
                <div className="hidden lg:block">
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
                    <ConversationThread
                        conversation={activeConversation}
                        isLoading={isLoading}
                    />

                    {/* Chat Input */}
                    <ChatInput
                        onSend={handleSendMessage}
                        isLoading={isLoading}
                        placeholder="Ask anything about your pets..."
                    />
                </div>
            </div>
        </div>
    );
};

export default AIAssistantPage;
