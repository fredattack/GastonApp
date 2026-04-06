import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import ResponseRenderer from "../../components/AI/ResponseRenderer/ResponseRenderer";

describe("ResponseRenderer", () => {
    it("renders streaming indicator when isStreaming is true", () => {
        render(
            <ResponseRenderer
                agentType="default"
                content="Loading..."
                isStreaming={true}
            />,
        );

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("renders default renderer for unknown agent types", () => {
        render(
            <ResponseRenderer
                agentType="default"
                content="Default response text"
            />,
        );

        expect(
            screen.getByText("Default response text"),
        ).toBeInTheDocument();
    });

    it("renders pet renderer for pet agent type", () => {
        render(
            <ResponseRenderer
                agentType="pet"
                content="Pet information"
            />,
        );

        expect(screen.getByText("Pet information")).toBeInTheDocument();
    });

    it("renders health renderer for health agent type", () => {
        render(
            <ResponseRenderer
                agentType="health"
                content="Health advice text"
            />,
        );

        expect(screen.getByText("Health advice text")).toBeInTheDocument();
    });

    it("renders schedule renderer for schedule agent type", () => {
        render(
            <ResponseRenderer
                agentType="schedule"
                content="Schedule info"
            />,
        );

        expect(screen.getByText("Schedule info")).toBeInTheDocument();
    });

    it("renders nutrition renderer for nutrition agent type", () => {
        render(
            <ResponseRenderer
                agentType="nutrition"
                content="Nutrition advice"
            />,
        );

        expect(screen.getByText("Nutrition advice")).toBeInTheDocument();
    });

    it("renders structured blocks when provided", () => {
        const blocks: StructuredBlock[] = [
            {
                id: "1",
                type: "text",
                data: {},
                content: "Block content here",
            },
        ];

        render(
            <ResponseRenderer
                agentType="default"
                content="Main text"
                blocks={blocks}
            />,
        );

        expect(screen.getByText("Main text")).toBeInTheDocument();
        expect(screen.getByText("Block content here")).toBeInTheDocument();
    });
});
