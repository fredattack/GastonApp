import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

export class OpenAiService {
    private static instance: OpenAiService | null = null;

    private apiClient: AxiosInstance;

    private endpoint: string;

    private baseUrl: string;

    private constructor() {
        const apiUrl = "";
        this.baseUrl = import.meta.env.VITE_API_URL + apiUrl;
        this.endpoint = "/ai";
        this.apiClient = axios.create({
            baseURL: this.baseUrl,
            headers: {
                "Content-Type": "application/json",
            },
            timeout: 30000,
        });
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

        return (
            typeof response.score === "number" &&
            typeof response.requestType === "string" &&
            typeof response.description === "string" &&
            response.data !== null &&
            response.data !== undefined &&
            typeof response.data === "object"
        );
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
            const response: AxiosResponse<AIResponse> =
                await this.apiClient.post(this.endpoint, {
                    prompt: messages.trim(),
                    filters,
                });

            if (!this.validateResponse(response.data)) {
                throw new Error("Invalid response format from AI service");
            }

            return response.data;
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
            const response: AxiosResponse<AIResponse> =
                await this.apiClient.post(this.endpoint, {
                    messages: messages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    filters,
                });

            if (!this.validateResponse(response.data)) {
                throw new Error("Invalid response format from AI service");
            }

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
            const response = await fetch(
                `${this.baseUrl}${this.endpoint}/stream`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        messages: messages.map((m) => ({
                            role: m.role,
                            content: m.content,
                        })),
                    }),
                },
            );

            if (response.status === 404) {
                console.warn(
                    "Streaming endpoint not available, falling back to regular API",
                );
                return this.sendPromptWithFallback(
                    messages,
                    onChunk,
                    onComplete,
                    onError,
                );
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error("No response body");
            }

            const decoder = new TextDecoder();
            let accumulatedText = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const data = line.slice(6);
                        if (data === "[DONE]") continue;

                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.chunk) {
                                accumulatedText += parsed.chunk;
                                onChunk(parsed.chunk);
                            }
                            if (parsed.done && parsed.response) {
                                onComplete(parsed.response as AIResponse);
                            }
                        } catch (e) {
                            console.error("Failed to parse SSE data:", e);
                        }
                    }
                }
            }
        } catch (error) {
            if (
                error instanceof TypeError &&
                error.message.includes("fetch")
            ) {
                console.warn(
                    "Streaming endpoint not reachable, falling back to regular API",
                );
                return this.sendPromptWithFallback(
                    messages,
                    onChunk,
                    onComplete,
                    onError,
                );
            }

            if (error instanceof Error) {
                onError(error);
            } else {
                onError(
                    new Error(
                        "An unknown error occurred during streaming",
                    ),
                );
            }
        }
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
                aiResponse.description || "Voici ce que j'ai généré pour vous.";
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
