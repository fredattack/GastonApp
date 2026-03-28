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
        onPersisted?: () => Promise<void>,
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
            onPersisted?: () => Promise<void>,
        ) => {
            if (!content.trim()) return;

            const userMessageId = crypto.randomUUID();
            const aiMessageId = crypto.randomUUID();

            // Add user message to local state only
            const userMessage: Message = {
                id: userMessageId,
                role: "user",
                content: content.trim(),
                timestamp: new Date(),
            };

            onConversationUpdate(conversationId, (messages) => [
                ...messages,
                userMessage,
            ]);
            setIsLoading(true);

            // Add placeholder assistant message to local state only
            const aiMessage: Message = {
                id: aiMessageId,
                role: "assistant",
                content: "",
                timestamp: new Date(),
                metadata: { isStreaming: true },
            };

            setStreamingMessageId(aiMessageId);
            onConversationUpdate(conversationId, (messages) => [
                ...messages,
                aiMessage,
            ]);

            try {
                await openAiService.sendPromptStream(
                    [userMessage],
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

                        const transformedEvent =
                            hasResult &&
                            isActionable &&
                            EVENT_TYPES.includes(finalResponse.requestType) &&
                            "title" in result
                                ? transformAIResponseToEventForm(
                                      result as unknown as AIEventData,
                                  )
                                : null;

                        const transformedPet =
                            hasResult &&
                            isActionable &&
                            PET_TYPES.includes(finalResponse.requestType) &&
                            "name" in result
                                ? transformAIResponseToPetForm(result)
                                : undefined;

                        const finalMetadata = {
                            isStreaming: false,
                            attachedEvent: transformedEvent,
                            attachedPet: transformedPet,
                            aiResponse: finalResponse,
                        };

                        // Update local state immediately
                        onConversationUpdate(conversationId, (messages) =>
                            messages.map((m) =>
                                m.id === aiMessageId
                                    ? { ...m, metadata: finalMetadata }
                                    : m,
                            ),
                        );

                        setIsLoading(false);
                        setStreamingMessageId(null);

                        // Persist both messages to DB then refresh
                        conversationService
                            .addMessage(conversationId, {
                                role: "user",
                                content: content.trim(),
                            })
                            .then(() =>
                                conversationService.addMessage(
                                    conversationId,
                                    {
                                        role: "assistant",
                                        content:
                                            finalResponse.conversationResponse ||
                                            finalResponse.description ||
                                            "",
                                        metadata:
                                            finalMetadata as unknown as Message["metadata"],
                                    },
                                ),
                            )
                            .then(() => onPersisted?.())
                            .catch(() => {});
                    },
                    // onError
                    async (error: Error) => {
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
