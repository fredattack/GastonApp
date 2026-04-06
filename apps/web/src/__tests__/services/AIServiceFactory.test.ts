import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    getAIService,
    setAIService,
    inferAgentType,
    type AIService,
} from "../../services/AIServiceFactory";

describe("AIServiceFactory", () => {
    describe("inferAgentType", () => {
        it("maps pet-related request types to 'pet'", () => {
            expect(inferAgentType("createPet")).toBe("pet");
            expect(inferAgentType("updatePet")).toBe("pet");
            expect(inferAgentType("deletePet")).toBe("pet");
            expect(inferAgentType("petQuery")).toBe("pet");
        });

        it("maps health-related request types to 'health'", () => {
            expect(inferAgentType("advice")).toBe("health");
            expect(inferAgentType("logHealthEvent")).toBe("health");
            expect(inferAgentType("createMetric")).toBe("health");
        });

        it("maps event-related request types to 'schedule'", () => {
            expect(inferAgentType("createEvent")).toBe("schedule");
            expect(inferAgentType("updateEvent")).toBe("schedule");
            expect(inferAgentType("deleteEvent")).toBe("schedule");
        });

        it("maps feeding-related request types to 'nutrition'", () => {
            expect(inferAgentType("markFeeding")).toBe("nutrition");
            expect(inferAgentType("batchMarkFeeding")).toBe("nutrition");
            expect(inferAgentType("updateFeedingSchedule")).toBe("nutrition");
            expect(inferAgentType("queryDiet")).toBe("nutrition");
            expect(inferAgentType("queryFeedingStatus")).toBe("nutrition");
        });

        it("returns 'default' for generic request types", () => {
            expect(inferAgentType("query")).toBe("default");
            expect(inferAgentType("error")).toBe("default");
            expect(inferAgentType("clarification")).toBe("default");
            expect(inferAgentType("multiAction")).toBe("default");
        });
    });

    describe("setAIService / getAIService", () => {
        it("allows overriding the AI service implementation", async () => {
            const mockService: AIService = {
                sendPrompt: vi.fn().mockResolvedValue({
                    status: "executed",
                    requestType: "query",
                    description: "mock",
                    confidenceScore: 100,
                }),
                sendStream: vi.fn(),
            };

            setAIService(mockService);
            const service = getAIService();

            const result = await service.sendPrompt("test");
            expect(result.status).toBe("executed");
            expect(mockService.sendPrompt).toHaveBeenCalledWith("test");
        });
    });
});
