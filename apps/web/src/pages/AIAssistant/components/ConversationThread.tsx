import React, { useEffect, useRef } from "react";
import {
    Robot,
    CalendarPlus,
    Stethoscope,
    Pill,
} from "@phosphor-icons/react";
import MessageBubble from "./MessageBubble";
import AIMessageCard from "./AIMessageCard";

interface ConversationThreadProps {
    conversation: Conversation | null;
    isLoading?: boolean;
}

const ConversationThread: React.FC<ConversationThreadProps> = ({
    conversation,
    isLoading = false,
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation?.messages]);

    const emptyState = (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
            <Robot size={32} weight="duotone" className="text-primary mb-3" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                Comment puis-je aider ?
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                Essayez un exemple ci-dessous
            </p>
            <div className="w-full max-w-sm space-y-2">
                <button
                    type="button"
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left bg-[#FDFCFA] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary transition-colors"
                >
                    <CalendarPlus
                        size={18}
                        className="text-primary flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                            Planifier un repas
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                            "Pablo mange 365g de barf demain matin"
                        </p>
                    </div>
                </button>
                <button
                    type="button"
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left bg-[#FDFCFA] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary transition-colors"
                >
                    <Stethoscope
                        size={18}
                        className="text-secondary flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                            Rendez-vous vétérinaire
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                            "RDV véto pour Luna jeudi à 14h"
                        </p>
                    </div>
                </button>
                <button
                    type="button"
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left bg-[#FDFCFA] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary transition-colors"
                >
                    <Pill
                        size={18}
                        className="text-amber-500 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                            Rappel médicament
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                            "Rappel : antibiotique pour Max"
                        </p>
                    </div>
                </button>
            </div>
        </div>
    );

    if (!conversation || conversation.messages.length === 0) {
        return emptyState;
    }

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="max-w-4xl mx-auto">
                {conversation.messages.map((message) => {
                    // Render AIMessageCard for assistant messages with special content
                    const hasSpecialContent =
                        message.metadata?.attachedEvent ||
                        message.metadata?.attachedPet ||
                        (message.metadata?.aiResponse &&
                            (message.metadata.aiResponse.requestType ===
                                "query" ||
                                message.metadata.aiResponse.requestType ===
                                    "advice" ||
                                message.metadata.aiResponse.requestType ===
                                    "metrics" ||
                                message.metadata.aiResponse.requestType ===
                                    "deleteEvent" ||
                                message.metadata.aiResponse.requestType ===
                                    "deletePet"));

                    if (message.role === "assistant" && hasSpecialContent) {
                        return (
                            <AIMessageCard
                                key={message.id}
                                message={message}
                                aiResponse={message.metadata?.aiResponse}
                            />
                        );
                    }

                    return <MessageBubble key={message.id} message={message} />;
                })}

                {isLoading && conversation.messages.length === 0 && (
                    <div className="flex justify-center items-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ConversationThread;
