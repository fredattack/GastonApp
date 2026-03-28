import axios, { AxiosResponse, AxiosError } from "axios";
import axiosClient from "../providers/apiClientProvider/axiosClient";

export class OpenAiService {
    private static instance: OpenAiService | null = null;

    private endpoint = "/ai";

    private constructor() {}

    static getInstance(): OpenAiService {
        if (!OpenAiService.instance) {
            OpenAiService.instance = new OpenAiService();
        }
        return OpenAiService.instance;
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
        prompt: string,
        options: { confirmed?: boolean; sessionId?: string } = {},
    ): Promise<AIResponse> {
        if (!prompt || prompt.trim().length === 0) {
            throw new Error("Prompt cannot be empty");
        }

        try {
            const body: Record<string, unknown> = {
                prompt: prompt.trim(),
            };
            if (options.confirmed) {
                body.confirmed = true;
            }
            if (options.sessionId) {
                body.sessionId = options.sessionId;
            }

            const response: AxiosResponse<AIResponse> = await axiosClient.post(
                this.endpoint,
                body,
            );

            return response.data;
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
