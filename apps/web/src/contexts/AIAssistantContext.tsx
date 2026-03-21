import React, {
    createContext,
    useContext,
    useCallback,
    ReactNode,
} from "react";
import useConversations from "../hooks/ai/useConversations";
import useAIStream from "../hooks/ai/useAIStream";

interface AIAssistantContextValue {
    conversations: Conversation[];
    activeConversation: Conversation | null;
    isLoading: boolean;
    streamingMessage: Message | null;
    isStreaming: boolean;

    createConversation: (title?: string) => Conversation;
    loadConversation: (id: string) => void;
    sendMessage: (content: string) => Promise<void>;
    deleteConversation: (id: string) => void;
    updateConversationTitle: (id: string, title: string) => void;
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
        searchConversations,
        clearAllConversations,
        setActiveConversationId,
        updateConversationMessages,
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
                const newConv = createConversation();
                conversationId = newConv.id;
            }

            await sendStreamMessage(
                content,
                conversationId,
                updateConversationMessages,
            );
        },
        [
            activeConversationId,
            createConversation,
            sendStreamMessage,
            updateConversationMessages,
        ],
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
        deleteConversation,
        updateConversationTitle,
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
