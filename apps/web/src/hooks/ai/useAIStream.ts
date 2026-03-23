import { useState, useCallback } from "react";
import { OpenAiService } from "../../services/OpenAIService";
import ConversationService from "../../services/ConversationService";
import {
    transformAIResponseToEventForm,
    transformAIResponseToPetForm,
} from "../../utils/aiTransformers";
import { modelService } from "../../services";

interface UseAIStreamReturn {
    isLoading: boolean;
    streamingMessageId: string | null;
    sendMessage: (
        content: string,
        conversationId: string,
        onConversationUpdate: (
            conversationId: string,
            updater: (messages: Message[]) => Message[],
        ) => void,
    ) => Promise<void>;
}

const useAIStream = (): UseAIStreamReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
        null,
    );

    const conversationService = ConversationService.getInstance();
    const openAiService = OpenAiService.getInstance();

    const sendMessage = useCallback(
        async (
            content: string,
            conversationId: string,
            onConversationUpdate: (
                conversationId: string,
                updater: (messages: Message[]) => Message[],
            ) => void,
        ) => {
            if (!content.trim()) return;

            // Add user message
            const userMessage = conversationService.addMessage(conversationId, {
                role: "user",
                content: content.trim(),
            });

            onConversationUpdate(conversationId, (messages) => [
                ...messages,
                userMessage,
            ]);
            setIsLoading(true);

            // Add placeholder assistant message
            const aiMessage = conversationService.addMessage(conversationId, {
                role: "assistant",
                content: "",
                metadata: { isStreaming: true },
            });

            const aiMessageId = aiMessage.id;
            setStreamingMessageId(aiMessageId);

            onConversationUpdate(conversationId, (messages) => [
                ...messages,
                aiMessage,
            ]);

            const conversation = conversationService.getById(conversationId);
            if (!conversation) return;

            try {
                await openAiService.sendPromptStream(
                    conversation.messages,
                    // onChunk
                    (chunk: string) => {
                        onConversationUpdate(conversationId, (messages) =>
                            messages.map((m) =>
                                m.id === aiMessageId
                                    ? { ...m, content: m.content + chunk }
                                    : m,
                            ),
                        );
                    },
                    // onComplete
                    async (finalResponse: AIResponse) => {
                        const hasData =
                            finalResponse.data &&
                            typeof finalResponse.data === "object";
                        const isExecuted =
                            !finalResponse.status ||
                            finalResponse.status === "executed" ||
                            finalResponse.status === "needs_confirmation";

                        const transformedEvent =
                            hasData &&
                            isExecuted &&
                            "title" in finalResponse.data &&
                            "petId" in finalResponse.data
                                ? transformAIResponseToEventForm(
                                      finalResponse.data as AIEventData,
                                  )
                                : null;

                        const transformedPet =
                            hasData &&
                            isExecuted &&
                            "name" in finalResponse.data &&
                            "species" in finalResponse.data
                                ? transformAIResponseToPetForm(
                                      finalResponse.data,
                                  )
                                : undefined;

                        // Enrich query responses
                        let enrichedResponse = finalResponse;
                        if (
                            finalResponse.requestType === "query" &&
                            "queryType" in finalResponse.data &&
                            !("results" in finalResponse.data)
                        ) {
                            const queryData = finalResponse.data as QueryResult;
                            if (queryData.queryType === "pets") {
                                try {
                                    const allPets =
                                        (await modelService.getModels(
                                            "pets",
                                        )) as Pet[];
                                    let filteredPets = allPets || [];
                                    if (
                                        queryData.filters?.petIds &&
                                        queryData.filters.petIds.length > 0
                                    ) {
                                        filteredPets = filteredPets.filter(
                                            (pet) =>
                                                queryData.filters!.petIds!.includes(
                                                    pet.id,
                                                ),
                                        );
                                    }
                                    enrichedResponse = {
                                        ...finalResponse,
                                        data: {
                                            ...queryData,
                                            results: filteredPets,
                                            totalCount: filteredPets.length,
                                        },
                                    };
                                } catch {
                                    // Failed to fetch pets for query enrichment
                                }
                            }
                        }

                        conversationService.updateMessage(
                            conversationId,
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

                        onConversationUpdate(conversationId, (messages) =>
                            messages.map((m) =>
                                m.id === aiMessageId
                                    ? {
                                          ...m,
                                          metadata: {
                                              isStreaming: false,
                                              attachedEvent: transformedEvent,
                                              attachedPet: transformedPet,
                                              aiResponse: enrichedResponse,
                                          },
                                      }
                                    : m,
                            ),
                        );

                        setIsLoading(false);
                        setStreamingMessageId(null);
                    },
                    // onError
                    (error: Error) => {
                        conversationService.updateMessage(
                            conversationId,
                            aiMessageId,
                            {
                                content: "Désolé, une erreur est survenue.",
                                metadata: {
                                    isStreaming: false,
                                    error: error.message,
                                },
                            },
                        );

                        onConversationUpdate(conversationId, (messages) =>
                            messages.map((m) =>
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
                        );

                        setIsLoading(false);
                        setStreamingMessageId(null);
                    },
                );
            } catch {
                setIsLoading(false);
                setStreamingMessageId(null);
            }
        },
        [],
    );

    return { isLoading, streamingMessageId, sendMessage };
};

export default useAIStream;
