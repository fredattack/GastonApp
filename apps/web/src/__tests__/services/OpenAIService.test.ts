import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock axiosClient before importing the service
vi.mock("../../providers/apiClientProvider/axiosClient", () => ({
    default: {
        post: vi.fn(),
        defaults: { baseURL: "http://localhost:3008/api" },
    },
}));

import { OpenAiService } from "../../services/OpenAIService";

describe("OpenAiService", () => {
    let service: OpenAiService;

    beforeEach(() => {
        // Reset singleton
        (OpenAiService as any).instance = null;
        service = OpenAiService.getInstance();
    });

    describe("getInstance", () => {
        it("returns a singleton instance", () => {
            const a = OpenAiService.getInstance();
            const b = OpenAiService.getInstance();
            expect(a).toBe(b);
        });
    });

    describe("sendPromptApi", () => {
        it("throws if prompt is empty", async () => {
            await expect(service.sendPromptApi("")).rejects.toThrow(
                "Prompt cannot be empty",
            );
            await expect(service.sendPromptApi("   ")).rejects.toThrow(
                "Prompt cannot be empty",
            );
        });
    });

    describe("sendPromptStream", () => {
        it("throws if messages array is empty", async () => {
            const onChunk = vi.fn();
            const onComplete = vi.fn();
            const onError = vi.fn();

            await expect(
                service.sendPromptStream([], onChunk, onComplete, onError),
            ).rejects.toThrow("Messages cannot be empty");
        });

        it("throws if no user message found", async () => {
            const messages: Message[] = [
                {
                    id: "1",
                    role: "assistant",
                    content: "Hello",
                    timestamp: new Date(),
                },
            ];
            const onChunk = vi.fn();
            const onComplete = vi.fn();
            const onError = vi.fn();

            await expect(
                service.sendPromptStream(
                    messages,
                    onChunk,
                    onComplete,
                    onError,
                ),
            ).rejects.toThrow("No user message found");
        });

        it("falls back to non-streaming when SSE fails and delivers text immediately", async () => {
            // Mock fetch to reject (SSE unavailable)
            vi.stubGlobal(
                "fetch",
                vi.fn().mockRejectedValue(new Error("Network error")),
            );

            // Mock the sendPromptApi to return a response
            const mockResponse: AIResponse = {
                status: "executed",
                requestType: "query",
                description: "Test response",
                confidenceScore: 95,
                conversationResponse: "Here is your answer",
            };

            vi.spyOn(service, "sendPromptApi").mockResolvedValue(mockResponse);

            const onChunk = vi.fn();
            const onComplete = vi.fn();
            const onError = vi.fn();

            const messages: Message[] = [
                {
                    id: "1",
                    role: "user",
                    content: "test query",
                    timestamp: new Date(),
                },
            ];

            await service.sendPromptStream(
                messages,
                onChunk,
                onComplete,
                onError,
            );

            // Should deliver the full text in a single chunk (no artificial delay)
            expect(onChunk).toHaveBeenCalledTimes(1);
            expect(onChunk).toHaveBeenCalledWith("Here is your answer");
            expect(onComplete).toHaveBeenCalledWith(mockResponse);
            expect(onError).not.toHaveBeenCalled();
        });

        it("processes real SSE stream correctly", async () => {
            const sseData = [
                'data: {"delta":"Hello "}\n\n',
                'data: {"delta":"world"}\n\n',
                'data: {"done":true,"response":{"status":"executed","requestType":"query","description":"test","confidenceScore":90}}\n\n',
            ].join("");

            const encoder = new TextEncoder();
            const stream = new ReadableStream({
                start(controller) {
                    controller.enqueue(encoder.encode(sseData));
                    controller.close();
                },
            });

            vi.stubGlobal(
                "fetch",
                vi.fn().mockResolvedValue({
                    ok: true,
                    headers: {
                        get: () => "text/event-stream",
                    },
                    body: stream,
                }),
            );

            const onChunk = vi.fn();
            const onComplete = vi.fn();
            const onError = vi.fn();

            const messages: Message[] = [
                {
                    id: "1",
                    role: "user",
                    content: "test",
                    timestamp: new Date(),
                },
            ];

            await service.sendPromptStream(
                messages,
                onChunk,
                onComplete,
                onError,
            );

            expect(onChunk).toHaveBeenCalledWith("Hello ");
            expect(onChunk).toHaveBeenCalledWith("world");
            expect(onComplete).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: "executed",
                    requestType: "query",
                }),
            );
            expect(onError).not.toHaveBeenCalled();
        });
    });
});
