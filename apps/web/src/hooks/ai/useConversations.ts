import { useState, useCallback, useEffect } from "react";
import ConversationService from "../../services/ConversationService";

interface UseConversationsReturn {
    conversations: Conversation[];
    activeConversation: Conversation | null;
    activeConversationId: string | null;
    isLoading: boolean;
    createConversation: (title?: string) => Promise<Conversation>;
    loadConversation: (id: string) => void;
    deleteConversation: (id: string) => Promise<void>;
    updateConversationTitle: (id: string, title: string) => Promise<void>;
    togglePin: (id: string) => Promise<void>;
    searchConversations: (query: string) => Conversation[];
    clearAllConversations: () => void;
    setActiveConversationId: (id: string | null) => void;
    updateConversationMessages: (
        conversationId: string,
        updater: (messages: Message[]) => Message[],
    ) => void;
    refreshConversations: () => Promise<void>;
}

const useConversations = (): UseConversationsReturn => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<
        string | null
    >(null);
    const [isLoading, setIsLoading] = useState(true);

    const conversationService = ConversationService.getInstance();

    // Load conversations from API on mount
    useEffect(() => {
        const loadConversations = async () => {
            setIsLoading(true);
            try {
                const loaded = await conversationService.getAll();
                setConversations(loaded);
            } catch (error) {
                console.error("Failed to load conversations:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadConversations();
    }, []);

    const activeConversation =
        conversations.find((c) => c.id === activeConversationId) || null;

    const createConversation = useCallback(
        async (title?: string): Promise<Conversation> => {
            const newConversation = await conversationService.create(title);
            setConversations((prev) => {
                if (prev.some((c) => c.id === newConversation.id)) return prev;
                return [newConversation, ...prev];
            });
            setActiveConversationId(newConversation.id);
            return newConversation;
        },
        [],
    );

    const loadConversation = useCallback((id: string) => {
        setActiveConversationId(id);
    }, []);

    const deleteConversation = useCallback(async (id: string) => {
        await conversationService.delete(id);
        setConversations((prev) => prev.filter((c) => c.id !== id));
        setActiveConversationId((prev) => (prev === id ? null : prev));
    }, []);

    const updateConversationTitle = useCallback(
        async (id: string, title: string) => {
            await conversationService.updateConversation(id, { title });
            setConversations((prev) =>
                prev.map((c) => (c.id === id ? { ...c, title } : c)),
            );
        },
        [],
    );

    const togglePin = useCallback(
        async (id: string) => {
            const conv = conversations.find((c) => c.id === id);
            if (!conv) return;

            const newPinned = !conv.isPinned;
            await conversationService.updateConversation(id, {
                isPinned: newPinned,
            });
            setConversations((prev) =>
                prev.map((c) =>
                    c.id === id ? { ...c, isPinned: newPinned } : c,
                ),
            );
        },
        [conversations],
    );

    const searchConversations = useCallback(
        (query: string): Conversation[] => {
            return conversationService.search(query);
        },
        [],
    );

    const clearAllConversations = useCallback(() => {
        conversationService.invalidateCache();
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

    const refreshConversations = useCallback(async () => {
        conversationService.invalidateCache();
        const loaded = await conversationService.getAll();
        setConversations(loaded);
    }, []);

    return {
        conversations,
        activeConversation,
        activeConversationId,
        isLoading,
        createConversation,
        loadConversation,
        deleteConversation,
        updateConversationTitle,
        togglePin,
        searchConversations,
        clearAllConversations,
        setActiveConversationId,
        updateConversationMessages,
        refreshConversations,
    };
};

export default useConversations;
