/**
 * AIServiceFactory — Abstracts the AI service layer for multi-provider support.
 *
 * Instead of coupling to OpenAiService directly, consumers use the factory
 * to get an AIService implementation. This enables swapping providers
 * (OpenAI, Anthropic, local backend) without refactoring consumers.
 */

export interface AIService {
    /** One-shot prompt → full response */
    sendPrompt(
        prompt: string,
        options?: { confirmed?: boolean; sessionId?: string },
    ): Promise<AIResponse>;

    /** Streaming prompt with callbacks */
    sendStream(
        messages: Message[],
        onChunk: (chunk: string) => void,
        onComplete: (response: AIResponse) => void,
        onError: (error: Error) => void,
    ): Promise<void>;
}

/**
 * Adapter that wraps OpenAiService behind the AIService interface.
 * This is the default implementation — all existing code routes through here.
 */
class BackendAIService implements AIService {
    private getOpenAiService() {
        // Lazy import to avoid circular dependency
        const { OpenAiService } = require("./OpenAIService");
        return OpenAiService.getInstance();
    }

    async sendPrompt(
        prompt: string,
        options?: { confirmed?: boolean; sessionId?: string },
    ): Promise<AIResponse> {
        return this.getOpenAiService().sendPromptApi(prompt, options);
    }

    async sendStream(
        messages: Message[],
        onChunk: (chunk: string) => void,
        onComplete: (response: AIResponse) => void,
        onError: (error: Error) => void,
    ): Promise<void> {
        return this.getOpenAiService().sendPromptStream(
            messages,
            onChunk,
            onComplete,
            onError,
        );
    }
}

let currentService: AIService | null = null;

/**
 * Returns the active AIService instance.
 * Defaults to BackendAIService (routes through Laravel backend).
 */
export function getAIService(): AIService {
    if (!currentService) {
        currentService = new BackendAIService();
    }
    return currentService;
}

/**
 * Override the AI service implementation (useful for testing or provider swaps).
 */
export function setAIService(service: AIService): void {
    currentService = service;
}

/**
 * Infer the agent type from an AI response's requestType.
 * Used when the backend doesn't explicitly return agentType.
 */
export function inferAgentType(requestType: AIRequestType): AIAgentType {
    switch (requestType) {
        case "createPet":
        case "updatePet":
        case "deletePet":
        case "petQuery":
            return "pet";
        case "advice":
        case "logHealthEvent":
        case "createMetric":
            return "health";
        case "createEvent":
        case "updateEvent":
        case "deleteEvent":
            return "schedule";
        case "markFeeding":
        case "batchMarkFeeding":
        case "updateFeedingSchedule":
        case "queryDiet":
        case "queryFeedingStatus":
            return "nutrition";
        default:
            return "default";
    }
}
