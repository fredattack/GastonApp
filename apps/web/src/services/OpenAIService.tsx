import axios, { AxiosResponse, AxiosError } from "axios";
import axiosClient from "../providers/apiClientProvider/axiosClient";
import { enrichWithHealthDisclaimer } from "../utils/healthDisclaimerUtils";

export class OpenAiService {
    private static instance: OpenAiService | null = null;

    private endpoint: string;

    private constructor() {
        this.endpoint = "/ai";
    }

    static getInstance(): OpenAiService {
        if (!OpenAiService.instance) {
            OpenAiService.instance = new OpenAiService();
        }
        return OpenAiService.instance;
    }

    private validateResponse(data: unknown): data is AIResponse {
        if (!data || typeof data !== "object") {
            return false;
        }

        const response = data as Record<string, unknown>;

        // Any response with a status field and conversationResponse/message is valid
        if (
            typeof response.status === "string" &&
            (typeof response.conversationResponse === "string" ||
                typeof response.message === "string" ||
                typeof response.description === "string")
        ) {
            return true;
        }

        // Legacy format: score + requestType + data
        return (
            typeof response.requestType === "string" &&
            typeof response.description === "string" &&
            response.data !== null &&
            response.data !== undefined &&
            typeof response.data === "object"
        );
    }

    private normalizeResponse(data: AIResponse): AIResponse {
        const raw = data as AIResponse & Record<string, unknown>;
        return {
            ...raw,
            score:
                raw.score ??
                (typeof raw.confidenceScore === "number"
                    ? raw.confidenceScore
                    : 0),
            confidenceScore:
                raw.confidenceScore ??
                (typeof raw.score === "number" ? raw.score : 0),
            requestType: raw.requestType || ("query" as AIResponse["requestType"]),
            description: raw.description || raw.message || "",
            data: raw.data ?? (raw.result as unknown as AIResponse["data"]) ?? ({} as AIResponse["data"]),
        };
    }

    private handleError(error: unknown): never {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<AIError>;
            const errorMessage =
                axiosError.response?.data?.message ||
                axiosError.message ||
                "Failed to communicate with AI service";

            throw new Error(errorMessage);
        }

        if (error instanceof Error) {
            throw new Error(`AI Service Error: ${error.message}`);
        }

        throw new Error(
            "An unknown error occurred while processing the AI request",
        );
    }

    async sendPromptApi(
        messages: string,
        filters: Record<string, unknown> = {},
    ): Promise<AIResponse> {
        if (!messages || messages.trim().length === 0) {
            throw new Error("Prompt cannot be empty");
        }

        try {
            const response: AxiosResponse<AIResponse> = await axiosClient.post(
                this.endpoint,
                {
                    prompt: messages.trim(),
                    filters,
                },
            );

            if (!this.validateResponse(response.data)) {
                throw new Error("Invalid response format from AI service");
            }

            // Normalize backend fields to match AIResponse type
            const normalized = this.normalizeResponse(response.data);

            // Enrich response with health disclaimer if needed
            const enrichedResponse = enrichWithHealthDisclaimer(
                normalized,
                messages.trim(),
            );

            return enrichedResponse;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async sendWithContext(
        messages: Message[],
        filters: Record<string, unknown> = {},
    ): Promise<AIResponse> {
        if (!messages || messages.length === 0) {
            throw new Error("Messages cannot be empty");
        }

        try {
            const response: AxiosResponse<AIResponse> = await axiosClient.post(
                this.endpoint,
                {
                    messages: messages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    filters,
                },
            );

            if (!this.validateResponse(response.data)) {
                throw new Error("Invalid response format from AI service");
            }

            const normalized = this.normalizeResponse(response.data);

            // Get the last user message for context
            const lastUserMessage = messages
                .slice()
                .reverse()
                .find((m) => m.role === "user");
            const originalPrompt = lastUserMessage?.content || "";

            // Enrich response with health disclaimer if needed
            const enrichedResponse = enrichWithHealthDisclaimer(
                normalized,
                originalPrompt,
            );

            return enrichedResponse;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async sendPromptStream(
        messages: Message[],
        onChunk: (chunk: string) => void,
        onComplete: (response: AIResponse) => void,
        onError: (error: Error) => void,
    ): Promise<void> {
        if (!messages || messages.length === 0) {
            throw new Error("Messages cannot be empty");
        }

        // Streaming endpoint not implemented yet — use fallback directly
        return this.sendPromptWithFallback(
            messages,
            onChunk,
            onComplete,
            onError,
        );
    }

    private async sendPromptWithFallback(
        messages: Message[],
        onChunk: (chunk: string) => void,
        onComplete: (response: AIResponse) => void,
        onError: (error: Error) => void,
    ): Promise<void> {
        try {
            const lastUserMessage = messages
                .slice()
                .reverse()
                .find((m) => m.role === "user");

            if (!lastUserMessage) {
                throw new Error("No user message found");
            }

            const aiResponse = await this.sendPromptApi(
                lastUserMessage.content,
            );

            const responseText =
                aiResponse.conversationResponse ||
                aiResponse.description ||
                "Voici ce que j'ai généré pour vous.";
            const words = responseText.split(" ");

            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                onChunk(word + (i < words.length - 1 ? " " : ""));
                await new Promise((resolve) => setTimeout(resolve, 30));
            }

            // The response is already enriched by sendPromptApi
            onComplete(aiResponse);
        } catch (error) {
            if (error instanceof Error) {
                onError(error);
            } else {
                onError(new Error("Failed to process request"));
            }
        }
    }
}
