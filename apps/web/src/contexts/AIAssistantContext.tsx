import React, {
    createContext,
    useContext,
    useCallback,
    useEffect,
    ReactNode,
} from "react";
import useConversations from "../hooks/ai/useConversations";
import useAIStream from "../hooks/ai/useAIStream";
import ConversationService from "../services/ConversationService";

export const PENDING_INJECTION_KEY = "ai_assistant_pending_injection";

interface PendingInjection {
    query: string;
    aiResponse: AIResponse;
    timestamp: number;
}

interface AIAssistantContextValue {
    conversations: Conversation[];
    activeConversation: Conversation | null;
    isLoading: boolean;
    streamingMessage: Message | null;
    isStreaming: boolean;

    createConversation: (title?: string) => Promise<Conversation>;
    loadConversation: (id: string) => void;
    sendMessage: (content: string) => Promise<void>;
    injectConversation: (query: string, aiResponse: AIResponse) => Promise<void>;
    deleteConversation: (id: string) => Promise<void>;
    updateConversationTitle: (id: string, title: string) => Promise<void>;
    togglePin: (id: string) => Promise<void>;
    searchConversations: (query: string) => Conversation[];
    clearAllConversations: () => void;
}

const AIAssistantContext = createContext<AIAssistantContextValue | undefined>(
    undefined,
);

interface AIAssistantProviderProps {
    children: ReactNode;
}

export const AIAssistantProvider: React.FC<AIAssistantProviderProps> = ({
    children,
}) => {
    const {
        conversations,
        activeConversation,
        activeConversationId,
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
    } = useConversations();

    const {
        isLoading,
        streamingMessageId,
        sendMessage: sendStreamMessage,
    } = useAIStream();

    const streamingMessage =
        activeConversation?.messages.find((m) => m.id === streamingMessageId) ||
        null;

    const sendMessage = useCallback(
        async (content: string) => {
            if (!content.trim()) return;

            let conversationId = activeConversationId;

            if (!conversationId) {
                const newConv = await createConversation();
                conversationId = newConv.id;
            }

            await sendStreamMessage(
                content,
                conversationId,
                updateConversationMessages,
                refreshConversations,
            );
        },
        [
            activeConversationId,
            createConversation,
            sendStreamMessage,
            updateConversationMessages,
            refreshConversations,
        ],
    );

    const injectConversation = useCallback(
        async (query: string, aiResponse: AIResponse) => {
            const convService = ConversationService.getInstance();
            const conv = await createConversation(
                query.slice(0, 40) + (query.length > 40 ? "..." : ""),
            );

            await convService.addMessage(conv.id, {
                role: "user",
                content: query,
            });

            await convService.addMessage(conv.id, {
                role: "assistant",
                content:
                    aiResponse.conversationResponse ||
                    aiResponse.description ||
                    "",
                metadata: {
                    isStreaming: false,
                    aiResponse,
                },
            });

            await refreshConversations();
            loadConversation(conv.id);
        },
        [createConversation, loadConversation, refreshConversations],
    );

    // Process pending injection from CommandBar redirect (sessionStorage bridge)
    useEffect(() => {
        const raw = sessionStorage.getItem(PENDING_INJECTION_KEY);
        if (!raw) return;
        sessionStorage.removeItem(PENDING_INJECTION_KEY);

        try {
            const pending: PendingInjection = JSON.parse(raw);
            if (Date.now() - pending.timestamp > 30_000) return;

            const convService = ConversationService.getInstance();
            (async () => {
                const conv = await createConversation(
                    pending.query.slice(0, 40) +
                        (pending.query.length > 40 ? "..." : ""),
                );
                await convService.addMessage(conv.id, {
                    role: "user",
                    content: pending.query,
                });
                await convService.addMessage(conv.id, {
                    role: "assistant",
                    content:
                        pending.aiResponse.conversationResponse ||
                        pending.aiResponse.description ||
                        "",
                    metadata: {
                        isStreaming: false,
                        aiResponse: pending.aiResponse,
                    },
                });
                await refreshConversations();
                loadConversation(conv.id);
            })();
        } catch {
            // Malformed sessionStorage data, ignore
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const value: AIAssistantContextValue = {
        conversations,
        activeConversation,
        isLoading,
        streamingMessage,
        isStreaming: !!streamingMessageId,
        createConversation,
        loadConversation,
        sendMessage,
        injectConversation,
        deleteConversation,
        updateConversationTitle,
        togglePin,
        searchConversations,
        clearAllConversations,
    };

    return (
        <AIAssistantContext.Provider value={value}>
            {children}
        </AIAssistantContext.Provider>
    );
};

export const useAIAssistant = (): AIAssistantContextValue => {
    const context = useContext(AIAssistantContext);
    if (!context) {
        throw new Error(
            "useAIAssistant must be used within an AIAssistantProvider",
        );
    }
    return context;
};
