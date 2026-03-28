import { useState, useCallback } from "react";
import { OpenAiService } from "../../services/OpenAIService";
import ConversationService from "../../services/ConversationService";
import {
    transformAIResponseToEventForm,
    transformAIResponseToPetForm,
} from "../../utils/aiTransformers";

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

const EVENT_TYPES: AIRequestType[] = [
    "createEvent",
    "updateEvent",
    "logHealthEvent",
];
const PET_TYPES: AIRequestType[] = ["createPet", "updatePet"];

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
                        const result = finalResponse.result;
                        const hasResult =
                            result !== null &&
                            result !== undefined &&
                            typeof result === "object";
                        const isActionable =
                            finalResponse.status === "executed" ||
                            finalResponse.status === "needs_confirmation";

                        // Transform event data if applicable
                        const transformedEvent =
                            hasResult &&
                            isActionable &&
                            EVENT_TYPES.includes(finalResponse.requestType) &&
                            "title" in result
                                ? transformAIResponseToEventForm(
                                      result as unknown as AIEventData,
                                  )
                                : null;

                        // Transform pet data if applicable
                        const transformedPet =
                            hasResult &&
                            isActionable &&
                            PET_TYPES.includes(finalResponse.requestType) &&
                            "name" in result
                                ? transformAIResponseToPetForm(result)
                                : undefined;

                        conversationService.updateMessage(
                            conversationId,
                            aiMessageId,
                            {
                                metadata: {
                                    isStreaming: false,
                                    attachedEvent: transformedEvent,
                                    attachedPet: transformedPet,
                                    aiResponse: finalResponse,
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
                                              aiResponse: finalResponse,
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
