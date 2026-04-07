import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import React from "react";
import { AIBridgeProvider, useAIBridge } from "../../contexts/AIBridgeContext";

const TestConsumer: React.FC = () => {
    const { pendingInjection, inject, clear } = useAIBridge();

    return (
        <div>
            <span data-testid="status">
                {pendingInjection ? "has-injection" : "empty"}
            </span>
            <span data-testid="query">
                {pendingInjection?.payload.query || "none"}
            </span>
            <button
                onClick={() =>
                    inject({
                        type: "question",
                        payload: { query: "test query" },
                    })
                }
            >
                Inject
            </button>
            <button onClick={clear}>Clear</button>
        </div>
    );
};

describe("AIBridgeContext", () => {
    it("starts with null pendingInjection", () => {
        render(
            <AIBridgeProvider>
                <TestConsumer />
            </AIBridgeProvider>,
        );

        expect(screen.getByTestId("status")).toHaveTextContent("empty");
        expect(screen.getByTestId("query")).toHaveTextContent("none");
    });

    it("inject() sets pendingInjection", () => {
        render(
            <AIBridgeProvider>
                <TestConsumer />
            </AIBridgeProvider>,
        );

        act(() => {
            screen.getByText("Inject").click();
        });

        expect(screen.getByTestId("status")).toHaveTextContent("has-injection");
        expect(screen.getByTestId("query")).toHaveTextContent("test query");
    });

    it("clear() resets pendingInjection to null", () => {
        render(
            <AIBridgeProvider>
                <TestConsumer />
            </AIBridgeProvider>,
        );

        act(() => {
            screen.getByText("Inject").click();
        });
        expect(screen.getByTestId("status")).toHaveTextContent("has-injection");

        act(() => {
            screen.getByText("Clear").click();
        });
        expect(screen.getByTestId("status")).toHaveTextContent("empty");
    });

    it("throws if useAIBridge is used outside provider", () => {
        // Suppress console.error for expected error
        const spy = vi.spyOn(console, "error").mockImplementation(() => {});

        expect(() => render(<TestConsumer />)).toThrow(
            "useAIBridge must be used within AIBridgeProvider",
        );

        spy.mockRestore();
    });
});
