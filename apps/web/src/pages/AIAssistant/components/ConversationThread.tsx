import React, { useEffect, useRef } from "react";
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

    if (!conversation) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="text-center max-w-2xl mx-auto">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                        </div>
                        <div className="relative text-7xl animate-bounce-slow">
                            🤖
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Assistant IA Gaston
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        Votre assistant intelligent pour la gestion de vos
                        animaux
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                            <div className="text-3xl mb-2">📅</div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                Planifier
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Créez des événements et rappels
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                            <div className="text-3xl mb-2">🐾</div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                Gérer
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Suivez vos animaux au quotidien
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                            <div className="text-3xl mb-2">💡</div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                Conseiller
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Obtenez des recommandations
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (conversation.messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="text-center max-w-2xl mx-auto">
                    <div className="text-6xl mb-6 animate-wave">👋</div>
                    <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                        Comment puis-je vous aider ?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Posez-moi une question ou essayez un exemple
                    </p>
                    <div className="grid gap-3 text-left">
                        <button className="group bg-white dark:bg-gray-800 p-4 rounded-xl text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md">
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">🍖</div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                        Planifier un repas
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        "Pablo doit manger 365gr de barf demain
                                        matin"
                                    </div>
                                </div>
                            </div>
                        </button>

                        <button className="group bg-white dark:bg-gray-800 p-4 rounded-xl text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md">
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">🏥</div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                        Rendez-vous vétérinaire
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        "Crée un rendez-vous véto pour Luna
                                        jeudi à 14h"
                                    </div>
                                </div>
                            </div>
                        </button>

                        <button className="group bg-white dark:bg-gray-800 p-4 rounded-xl text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md">
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">💊</div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                        Médicament quotidien
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        "Rappel quotidien : donner antibiotique
                                        à Max"
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
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
