import axios, { AxiosResponse, AxiosError } from "axios";
import axiosClient from "../providers/apiClientProvider/axiosClient";

export class OpenAiService {
    private static instance: OpenAiService | null = null;

    private endpoint = "/ai";
    private streamEndpoint = "/ai/stream";

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

    /**
     * Stream AI response via SSE (Server-Sent Events).
     * Tries real streaming first via fetch + ReadableStream.
     * Falls back to non-streaming API if the stream endpoint is unavailable.
     */
    async sendPromptStream(
        messages: Message[],
        onChunk: (chunk: string) => void,
        onComplete: (response: AIResponse) => void,
        onError: (error: Error) => void,
    ): Promise<void> {
        if (!messages || messages.length === 0) {
            throw new Error("Messages cannot be empty");
        }

        const lastUserMessage = messages
            .slice()
            .reverse()
            .find((m) => m.role === "user");

        if (!lastUserMessage) {
            throw new Error("No user message found");
        }

        try {
            await this.tryStreamSSE(lastUserMessage.content, onChunk, onComplete);
        } catch {
            // SSE not available — fall back to non-streaming API
            try {
                await this.fallbackNonStreaming(lastUserMessage.content, onChunk, onComplete);
            } catch (error) {
                if (error instanceof Error) {
                    onError(error);
                } else {
                    onError(new Error("Failed to process request"));
                }
            }
        }
    }

    /**
     * Real SSE streaming via fetch + body.getReader().
     * Expected SSE format from backend: "data: {json}\n\n"
     * - Chunk events: { delta: string }
     * - Complete event: { done: true, response: AIResponse }
     */
    private async tryStreamSSE(
        prompt: string,
        onChunk: (chunk: string) => void,
        onComplete: (response: AIResponse) => void,
    ): Promise<void> {
        const baseURL = axiosClient.defaults.baseURL || "";
        const url = `${baseURL}${this.streamEndpoint}`;

        // Get XSRF token for CSRF protection
        const xsrfMatch = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        const xsrfToken = xsrfMatch ? decodeURIComponent(xsrfMatch[1]) : undefined;

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
        };
        if (xsrfToken) {
            headers["X-XSRF-TOKEN"] = xsrfToken;
        }

        const response = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers,
            body: JSON.stringify({ prompt: prompt.trim() }),
        });

        if (!response.ok) {
            throw new Error(`Stream endpoint returned ${response.status}`);
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("text/event-stream")) {
            throw new Error("Response is not an SSE stream");
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error("ReadableStream not supported");
        }

        const decoder = new TextDecoder();
        let buffer = "";
        let finalResponse: AIResponse | null = null;

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                // Keep the last incomplete line in the buffer
                buffer = lines.pop() || "";

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || !trimmed.startsWith("data:")) continue;

                    const jsonStr = trimmed.slice(5).trim();
                    if (!jsonStr || jsonStr === "[DONE]") continue;

                    try {
                        const data = JSON.parse(jsonStr);

                        if (data.done && data.response) {
                            finalResponse = data.response as AIResponse;
                        } else if (data.delta) {
                            onChunk(data.delta);
                        }
                    } catch {
                        // Skip malformed JSON lines
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }

        if (finalResponse) {
            onComplete(finalResponse);
        } else {
            throw new Error("Stream ended without a complete response");
        }
    }

    /**
     * Fallback: call the non-streaming API and deliver the full response at once.
     * No artificial delay — the text is delivered immediately.
     */
    private async fallbackNonStreaming(
        prompt: string,
        onChunk: (chunk: string) => void,
        onComplete: (response: AIResponse) => void,
    ): Promise<void> {
        const aiResponse = await this.sendPromptApi(prompt);

        const responseText =
            aiResponse.conversationResponse ||
            aiResponse.description ||
            "Voici ce que j'ai généré pour vous.";

        // Deliver text immediately — no fake streaming delay
        onChunk(responseText);
        onComplete(aiResponse);
    }
}
