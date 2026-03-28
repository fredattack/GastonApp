import React, { useState, useRef, useMemo } from "react";
import {
    Plus,
    Trash,
    MagnifyingGlass,
    ChatCircle,
    ChatCircleDots,
    PushPin,
    PencilSimple,
    Check,
    X,
} from "@phosphor-icons/react";
import { useAIAssistant } from "../../../contexts/AIAssistantContext";

interface ConversationSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

interface ConversationGroup {
    label: string;
    conversations: Conversation[];
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
        updateConversationTitle,
        togglePin,
        searchConversations,
    } = useAIAssistant();

    const [searchQuery, setSearchQuery] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState("");
    const editInputRef = useRef<HTMLInputElement>(null);

    const displayedConversations = searchQuery
        ? searchConversations(searchQuery)
        : conversations;

    const groupedConversations = useMemo((): ConversationGroup[] => {
        const pinned = displayedConversations.filter((c) => c.isPinned);
        const unpinned = displayedConversations.filter((c) => !c.isPinned);

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        const todayConvs = unpinned.filter(
            (c) => new Date(c.updatedAt) >= today,
        );
        const weekConvs = unpinned.filter(
            (c) =>
                new Date(c.updatedAt) >= weekAgo &&
                new Date(c.updatedAt) < today,
        );
        const olderConvs = unpinned.filter(
            (c) => new Date(c.updatedAt) < weekAgo,
        );

        const groups: ConversationGroup[] = [];
        if (pinned.length > 0)
            groups.push({ label: "Epinglees", conversations: pinned });
        if (todayConvs.length > 0)
            groups.push({ label: "Aujourd'hui", conversations: todayConvs });
        if (weekConvs.length > 0)
            groups.push({
                label: "Cette semaine",
                conversations: weekConvs,
            });
        if (olderConvs.length > 0)
            groups.push({
                label: "Plus ancien",
                conversations: olderConvs,
            });

        return groups;
    }, [displayedConversations]);

    const handleNewConversation = () => {
        createConversation();
    };

    const handleSelectConversation = (id: string) => {
        if (editingId) return;
        loadConversation(id);
        if (onClose) onClose();
    };

    const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm("Supprimer cette conversation ?")) {
            deleteConversation(id);
        }
    };

    const handleStartRename = (e: React.MouseEvent, conv: Conversation) => {
        e.stopPropagation();
        setEditingId(conv.id);
        setEditingTitle(conv.title);
        setTimeout(() => editInputRef.current?.focus(), 50);
    };

    const handleConfirmRename = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (editingId && editingTitle.trim()) {
            await updateConversationTitle(editingId, editingTitle.trim());
        }
        setEditingId(null);
    };

    const handleCancelRename = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setEditingId(null);
    };

    const handleRenameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleConfirmRename();
        if (e.key === "Escape") handleCancelRename();
    };

    const handleTogglePin = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        togglePin(id);
    };

    const formatDate = (date: Date): string => {
        const now = new Date();
        const diffMs = now.getTime() - new Date(date).getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Aujourd'hui";
        if (diffDays === 1) return "Hier";
        if (diffDays < 7) return `Il y a ${diffDays} jours`;

        return new Date(date).toLocaleDateString("fr-FR", {
            month: "short",
            day: "numeric",
        });
    };

    const renderConversationItem = (conv: Conversation) => {
        const isActive = activeConversation?.id === conv.id;
        const isEditing = editingId === conv.id;

        return (
            <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                className={`p-3 mb-1 rounded-xl cursor-pointer transition-all duration-200 group ${
                    isActive
                        ? "bg-primary/10 border border-primary/30 shadow-md"
                        : "hover:bg-white dark:hover:bg-gray-800 hover:shadow-md border border-transparent"
                }`}
            >
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <ChatCircle
                                size={14}
                                className={`flex-shrink-0 transition-colors ${
                                    isActive
                                        ? "text-primary"
                                        : "text-gray-400 group-hover:text-primary"
                                }`}
                            />
                            {isEditing ? (
                                <div
                                    className="flex items-center gap-1 flex-1 min-w-0"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <input
                                        ref={editInputRef}
                                        type="text"
                                        value={editingTitle}
                                        onChange={(e) =>
                                            setEditingTitle(e.target.value)
                                        }
                                        onKeyDown={handleRenameKeyDown}
                                        className="flex-1 min-w-0 text-sm px-1.5 py-0.5 border border-primary/50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white dark:bg-gray-800"
                                    />
                                    <button
                                        onClick={handleConfirmRename}
                                        className="p-0.5 text-green-600 hover:bg-green-50 rounded"
                                    >
                                        <Check size={14} />
                                    </button>
                                    <button
                                        onClick={handleCancelRename}
                                        className="p-0.5 text-gray-400 hover:bg-gray-100 rounded"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <h3
                                    className="text-sm font-medium text-gray-900 dark:text-white truncate"
                                    onDoubleClick={(e) =>
                                        handleStartRename(e, conv)
                                    }
                                >
                                    {conv.title}
                                </h3>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>
                                {conv.messages.length} message
                                {conv.messages.length > 1 ? "s" : ""}
                            </span>
                            <span>·</span>
                            <span>{formatDate(conv.updatedAt)}</span>
                        </div>
                    </div>

                    {!isEditing && (
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => handleStartRename(e, conv)}
                                className="p-1 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                                aria-label="Renommer"
                            >
                                <PencilSimple size={14} />
                            </button>
                            <button
                                onClick={(e) => handleTogglePin(e, conv.id)}
                                className={`p-1 rounded-md transition-colors ${
                                    conv.isPinned
                                        ? "text-primary bg-primary/10"
                                        : "text-gray-400 hover:text-primary hover:bg-primary/10"
                                }`}
                                aria-label={
                                    conv.isPinned
                                        ? "Desepingler"
                                        : "Epingler"
                                }
                            >
                                <PushPin
                                    size={14}
                                    weight={conv.isPinned ? "fill" : "regular"}
                                />
                            </button>
                            <button
                                onClick={(e) =>
                                    handleDeleteConversation(e, conv.id)
                                }
                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                aria-label="Supprimer"
                            >
                                <Trash size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div
            className={`${
                isOpen ? "w-80" : "w-0"
            } h-full flex-shrink-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-r border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300`}
        >
            <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <button
                        onClick={handleNewConversation}
                        className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md"
                    >
                        <Plus size={20} />
                        Nouvelle conversation
                    </button>

                    <div className="mt-3 relative group">
                        <MagnifyingGlass
                            size={16}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
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
                            <ChatCircleDots
                                size={40}
                                weight="duotone"
                                className="text-gray-300 dark:text-gray-600 mb-3"
                            />
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {searchQuery
                                    ? "Aucune conversation trouvee"
                                    : "Aucune conversation pour le moment"}
                            </p>
                        </div>
                    ) : (
                        <div className="p-2">
                            {groupedConversations.map((group) => (
                                <div key={group.label} className="mb-3">
                                    <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                        {group.label}
                                    </div>
                                    {group.conversations.map(
                                        renderConversationItem,
                                    )}
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
