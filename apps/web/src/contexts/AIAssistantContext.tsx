import React, {
    createContext,
    useContext,
    useCallback,
    ReactNode,
} from "react";
import useConversations from "../hooks/ai/useConversations";
import useAIStream from "../hooks/ai/useAIStream";
import ConversationService from "../services/ConversationService";

interface AIAssistantContextValue {
    conversations: Conversation[];
    activeConversation: Conversation | null;
    isLoading: boolean;
    streamingMessage: Message | null;
    isStreaming: boolean;

    createConversation: (title?: string) => Promise<Conversation>;
    loadConversation: (id: string) => void;
    sendMessage: (content: string) => Promise<void>;
    injectConversation: (query: string, aiResponse: AIResponse) => void;
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
        (query: string, aiResponse: AIResponse) => {
            const convService = ConversationService.getInstance();
            const doInject = async () => {
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

                loadConversation(conv.id);
            };
            doInject();
        },
        [createConversation, loadConversation],
    );

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
