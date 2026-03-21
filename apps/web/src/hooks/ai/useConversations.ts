import { useState, useCallback, useEffect } from "react";
import ConversationService from "../../services/ConversationService";

interface UseConversationsReturn {
    conversations: Conversation[];
    activeConversation: Conversation | null;
    activeConversationId: string | null;
    createConversation: (title?: string) => Conversation;
    loadConversation: (id: string) => void;
    deleteConversation: (id: string) => void;
    updateConversationTitle: (id: string, title: string) => void;
    searchConversations: (query: string) => Conversation[];
    clearAllConversations: () => void;
    setActiveConversationId: (id: string | null) => void;
    updateConversationMessages: (
        conversationId: string,
        updater: (messages: Message[]) => Message[],
    ) => void;
    refreshConversations: () => void;
}

const useConversations = (): UseConversationsReturn => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<
        string | null
    >(null);

    const conversationService = ConversationService.getInstance();

    useEffect(() => {
        setConversations(conversationService.getAll());
    }, []);

    const activeConversation =
        conversations.find((c) => c.id === activeConversationId) || null;

    const createConversation = useCallback((title?: string): Conversation => {
        const newConversation = conversationService.create(title);
        setConversations((prev) => [newConversation, ...prev]);
        setActiveConversationId(newConversation.id);
        return newConversation;
    }, []);

    const loadConversation = useCallback((id: string) => {
        const conversation = conversationService.getById(id);
        if (conversation) {
            setConversations((prev) => {
                const exists = prev.find((c) => c.id === id);
                return exists ? prev : [conversation, ...prev];
            });
            setActiveConversationId(id);
        }
    }, []);

    const deleteConversation = useCallback((id: string) => {
        conversationService.delete(id);
        setConversations((prev) => prev.filter((c) => c.id !== id));
        setActiveConversationId((prev) => (prev === id ? null : prev));
    }, []);

    const updateConversationTitle = useCallback((id: string, title: string) => {
        const conversation = conversationService.getById(id);
        if (conversation) {
            conversation.title = title;
            conversationService.save(conversation);
            setConversations((prev) =>
                prev.map((c) => (c.id === id ? { ...c, title } : c)),
            );
        }
    }, []);

    const searchConversations = useCallback((query: string): Conversation[] => {
        return conversationService.search(query);
    }, []);

    const clearAllConversations = useCallback(() => {
        conversationService.clear();
        setConversations([]);
        setActiveConversationId(null);
    }, []);

    const updateConversationMessages = useCallback(
        (
            conversationId: string,
            updater: (messages: Message[]) => Message[],
        ) => {
            setConversations((prev) =>
                prev.map((c) =>
                    c.id === conversationId
                        ? {
                              ...c,
                              messages: updater(c.messages),
                              updatedAt: new Date(),
                          }
                        : c,
                ),
            );
        },
        [],
    );

    const refreshConversations = useCallback(() => {
        setConversations(conversationService.getAll());
    }, []);

    return {
        conversations,
        activeConversation,
        activeConversationId,
        createConversation,
        loadConversation,
        deleteConversation,
        updateConversationTitle,
        searchConversations,
        clearAllConversations,
        setActiveConversationId,
        updateConversationMessages,
        refreshConversations,
    };
};

export default useConversations;
