import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    ReactNode,
} from "react";
import { OpenAiService } from "../services/OpenAIService";
import ConversationService from "../services/ConversationService";
import { transformAIResponseToEventForm, transformAIResponseToPetForm } from "../utils/aiTransformers";
import { modelService } from "../services";

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
    const [state, setState] = useState<ConversationState>({
        conversations: [],
        activeConversationId: null,
        isLoading: false,
        streamingMessageId: null,
    });

    const conversationService = ConversationService.getInstance();
    const openAiService = OpenAiService.getInstance();

    useEffect(() => {
        const loadedConversations = conversationService.getAll();
        setState((prev) => ({
            ...prev,
            conversations: loadedConversations,
        }));
    }, []);

    const activeConversation =
        state.conversations.find((c) => c.id === state.activeConversationId) ||
        null;

    const streamingMessage =
        activeConversation?.messages.find(
            (m) => m.id === state.streamingMessageId,
        ) || null;

    const createConversation = useCallback((title?: string): Conversation => {
        const newConversation = conversationService.create(title);
        setState((prev) => ({
            ...prev,
            conversations: [newConversation, ...prev.conversations],
            activeConversationId: newConversation.id,
        }));
        return newConversation;
    }, []);

    const loadConversation = useCallback((id: string) => {
        const conversation = conversationService.getById(id);
        if (conversation) {
            setState((prev) => {
                const exists = prev.conversations.find((c) => c.id === id);
                const updatedConversations = exists
                    ? prev.conversations
                    : [conversation, ...prev.conversations];

                return {
                    ...prev,
                    conversations: updatedConversations,
                    activeConversationId: id,
                };
            });
        }
    }, []);

    const deleteConversation = useCallback((id: string) => {
        conversationService.delete(id);
        setState((prev) => ({
            ...prev,
            conversations: prev.conversations.filter((c) => c.id !== id),
            activeConversationId:
                prev.activeConversationId === id
                    ? null
                    : prev.activeConversationId,
        }));
    }, []);

    const updateConversationTitle = useCallback((id: string, title: string) => {
        const conversation = conversationService.getById(id);
        if (conversation) {
            conversation.title = title;
            conversationService.save(conversation);
            setState((prev) => ({
                ...prev,
                conversations: prev.conversations.map((c) =>
                    c.id === id ? { ...c, title } : c,
                ),
            }));
        }
    }, []);

    const searchConversations = useCallback((query: string): Conversation[] => {
        return conversationService.search(query);
    }, []);

    const clearAllConversations = useCallback(() => {
        conversationService.clear();
        setState({
            conversations: [],
            activeConversationId: null,
            isLoading: false,
            streamingMessageId: null,
        });
    }, []);

    const sendMessage = useCallback(
        async (content: string) => {
            if (!content.trim()) return;

            let conversationId = state.activeConversationId;

            if (!conversationId) {
                const newConv = createConversation();
                conversationId = newConv.id;
            }

            const userMessage = conversationService.addMessage(conversationId, {
                role: "user",
                content: content.trim(),
            });

            setState((prev) => ({
                ...prev,
                conversations: prev.conversations.map((c) =>
                    c.id === conversationId
                        ? {
                              ...c,
                              messages: [...c.messages, userMessage],
                              updatedAt: new Date(),
                          }
                        : c,
                ),
                isLoading: true,
            }));

            const aiMessage = conversationService.addMessage(conversationId, {
                role: "assistant",
                content: "",
                metadata: {
                    isStreaming: true,
                },
            });

            const aiMessageId = aiMessage.id;

            setState((prev) => ({
                ...prev,
                conversations: prev.conversations.map((c) =>
                    c.id === conversationId
                        ? {
                              ...c,
                              messages: [...c.messages, aiMessage],
                          }
                        : c,
                ),
                streamingMessageId: aiMessageId,
            }));

            const conversation = conversationService.getById(conversationId);
            if (!conversation) return;

            try {
                await openAiService.sendPromptStream(
                    conversation.messages,
                    (chunk: string) => {
                        setState((prev) => ({
                            ...prev,
                            conversations: prev.conversations.map((c) =>
                                c.id === conversationId
                                    ? {
                                          ...c,
                                          messages: c.messages.map((m) =>
                                              m.id === aiMessageId
                                                  ? {
                                                        ...m,
                                                        content:
                                                            m.content + chunk,
                                                    }
                                                  : m,
                                          ),
                                      }
                                    : c,
                            ),
                        }));
                    },
                    async (finalResponse: AIResponse) => {
                        console.log('[AIAssistantContext] Final Response:', finalResponse);

                        // Type narrow: only transform if data is AIEventData
                        const transformedEvent =
                            'title' in finalResponse.data && 'petId' in finalResponse.data
                                ? transformAIResponseToEventForm(finalResponse.data as AIEventData)
                                : null;

                        // Type narrow: only use if data is PetFormData
                        const transformedPet =
                            'name' in finalResponse.data && 'species' in finalResponse.data
                                ? transformAIResponseToPetForm(finalResponse.data)
                                : undefined;

                        // Execute query if it's a query request without results
                        let enrichedResponse = finalResponse;
                        if (finalResponse.requestType === 'query' && 'queryType' in finalResponse.data && !('results' in finalResponse.data)) {
                            const queryData = finalResponse.data as any;

                            // Execute query based on queryType
                            if (queryData.queryType === 'pets') {
                                try {
                                    const allPets = await modelService.getModels('pets') as Pet[];
                                    let filteredPets = allPets || [];

                                    // Apply filters
                                    if (queryData.filters?.type) {
                                        filteredPets = filteredPets.filter((pet: Pet) => pet.species === queryData.filters.type);
                                    }
                                    if (queryData.filters?.petIds && queryData.filters.petIds.length > 0) {
                                        filteredPets = filteredPets.filter((pet: Pet) =>
                                            queryData.filters.petIds.includes(pet.id)
                                        );
                                    }

                                    enrichedResponse = {
                                        ...finalResponse,
                                        data: {
                                            ...queryData,
                                            results: filteredPets,
                                            totalCount: filteredPets.length,
                                        }
                                    };
                                } catch (error) {
                                    console.error('[AIAssistantContext] Error fetching pets:', error);
                                }
                            }
                        }

                        console.log('[AIAssistantContext] Transformed:', {
                            transformedEvent,
                            transformedPet,
                            requestType: enrichedResponse.requestType,
                            enrichedData: enrichedResponse.data,
                        });

                        conversationService.updateMessage(
                            conversationId!,
                            aiMessageId,
                            {
                                metadata: {
                                    isStreaming: false,
                                    attachedEvent: transformedEvent,
                                    attachedPet: transformedPet,
                                    aiResponse: enrichedResponse,
                                },
                            },
                        );

                        setState((prev) => ({
                            ...prev,
                            conversations: prev.conversations.map((c) =>
                                c.id === conversationId
                                    ? {
                                          ...c,
                                          messages: c.messages.map((m) =>
                                              m.id === aiMessageId
                                                  ? {
                                                        ...m,
                                                        metadata: {
                                                            isStreaming: false,
                                                            attachedEvent:
                                                                transformedEvent,
                                                            attachedPet:
                                                                transformedPet,
                                                            aiResponse:
                                                                enrichedResponse,
                                                        },
                                                    }
                                                  : m,
                                          ),
                                      }
                                    : c,
                            ),
                            isLoading: false,
                            streamingMessageId: null,
                        }));
                    },
                    (error: Error) => {
                        conversationService.updateMessage(
                            conversationId!,
                            aiMessageId,
                            {
                                content: "Désolé, une erreur est survenue.",
                                metadata: {
                                    isStreaming: false,
                                    error: error.message,
                                },
                            },
                        );

                        setState((prev) => ({
                            ...prev,
                            conversations: prev.conversations.map((c) =>
                                c.id === conversationId
                                    ? {
                                          ...c,
                                          messages: c.messages.map((m) =>
                                              m.id === aiMessageId
                                                  ? {
                                                        ...m,
                                                        content:
                                                            "Désolé, une erreur est survenue.",
                                                        metadata: {
                                                            isStreaming: false,
                                                            error: error.message,
                                                        },
                                                    }
                                                  : m,
                                          ),
                                      }
                                    : c,
                            ),
                            isLoading: false,
                            streamingMessageId: null,
                        }));
                    },
                );
            } catch (error) {
                console.error("Failed to send message:", error);
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    streamingMessageId: null,
                }));
            }
        },
        [state.activeConversationId, createConversation],
    );

    const value: AIAssistantContextValue = {
        conversations: state.conversations,
        activeConversation,
        isLoading: state.isLoading,
        streamingMessage,
        isStreaming: !!state.streamingMessageId,
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
