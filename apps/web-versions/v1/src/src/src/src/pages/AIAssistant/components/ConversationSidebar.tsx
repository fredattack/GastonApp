import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faTrash,
    faSearch,
    faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { useAIAssistant } from "../../../contexts/AIAssistantContext";

interface ConversationSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
    isOpen = true,
    onClose,
}) => {
    const {
        conversations,
        activeConversation,
        createConversation,
        loadConversation,
        deleteConversation,
        searchConversations,
    } = useAIAssistant();

    const [searchQuery, setSearchQuery] = useState("");

    const displayedConversations = searchQuery
        ? searchConversations(searchQuery)
        : conversations;

    const handleNewConversation = () => {
        createConversation();
    };

    const handleSelectConversation = (id: string) => {
        loadConversation(id);
        if (onClose) onClose();
    };

    const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (
            window.confirm("Are you sure you want to delete this conversation?")
        ) {
            deleteConversation(id);
        }
    };

    const formatDate = (date: Date): string => {
        const now = new Date();
        const diffMs = now.getTime() - new Date(date).getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;

        return new Date(date).toLocaleDateString("fr-FR", {
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div
            className={`${
                isOpen ? "w-80" : "w-0"
            } flex-shrink-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-r border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300`}
        >
            <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <button
                        onClick={handleNewConversation}
                        className="w-full py-3 px-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Nouvelle conversation
                    </button>

                    <div className="mt-3 relative group">
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
                            size="sm"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher..."
                            className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-sm transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {displayedConversations.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="text-4xl mb-3">💬</div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {searchQuery
                                    ? "Aucune conversation trouvée"
                                    : "Aucune conversation pour le moment"}
                            </p>
                        </div>
                    ) : (
                        <div className="p-2">
                            {displayedConversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() =>
                                        handleSelectConversation(conv.id)
                                    }
                                    className={`p-3 mb-2 rounded-xl cursor-pointer transition-all duration-200 group ${
                                        activeConversation?.id === conv.id
                                            ? "bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/30 shadow-md scale-[1.02]"
                                            : "hover:bg-white dark:hover:bg-gray-800 hover:shadow-md hover:scale-[1.01] border border-transparent"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <FontAwesomeIcon
                                                    icon={faMessage}
                                                    className={`text-xs flex-shrink-0 transition-colors ${
                                                        activeConversation?.id ===
                                                        conv.id
                                                            ? "text-primary"
                                                            : "text-gray-400 group-hover:text-primary"
                                                    }`}
                                                />
                                                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {conv.title}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <span>
                                                    {conv.messages.length}{" "}
                                                    message
                                                    {conv.messages.length > 1
                                                        ? "s"
                                                        : ""}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    {formatDate(conv.updatedAt)}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) =>
                                                handleDeleteConversation(
                                                    e,
                                                    conv.id,
                                                )
                                            }
                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all hover:scale-110"
                                            aria-label="Supprimer la conversation"
                                        >
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                size="sm"
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConversationSidebar;
