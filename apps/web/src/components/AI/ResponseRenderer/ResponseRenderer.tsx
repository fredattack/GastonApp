import React from "react";
import PetResponseRenderer from "./renderers/PetResponseRenderer";
import HealthResponseRenderer from "./renderers/HealthResponseRenderer";
import ScheduleResponseRenderer from "./renderers/ScheduleResponseRenderer";
import NutritionResponseRenderer from "./renderers/NutritionResponseRenderer";
import DefaultResponseRenderer from "./renderers/DefaultResponseRenderer";

interface ResponseRendererProps {
    agentType: AIAgentType;
    content: string;
    blocks?: StructuredBlock[];
    aiResponse?: AIResponse;
    isStreaming?: boolean;
}

/**
 * Dispatches rendering to agent-specific components based on agentType.
 * Falls back to DefaultResponseRenderer for unrecognized agent types.
 */
const ResponseRenderer: React.FC<ResponseRendererProps> = ({
    agentType,
    content,
    blocks,
    aiResponse,
    isStreaming,
}) => {
    if (isStreaming) {
        return (
            <div className="text-sm text-gray-900 dark:text-white leading-relaxed">
                {content}
                <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
            </div>
        );
    }

    switch (agentType) {
        case "pet":
            return (
                <PetResponseRenderer
                    content={content}
                    blocks={blocks}
                    aiResponse={aiResponse}
                />
            );
        case "health":
            return (
                <HealthResponseRenderer
                    content={content}
                    blocks={blocks}
                    aiResponse={aiResponse}
                />
            );
        case "schedule":
            return (
                <ScheduleResponseRenderer
                    content={content}
                    blocks={blocks}
                    aiResponse={aiResponse}
                />
            );
        case "nutrition":
            return (
                <NutritionResponseRenderer
                    content={content}
                    blocks={blocks}
                    aiResponse={aiResponse}
                />
            );
        default:
            return (
                <DefaultResponseRenderer
                    content={content}
                    blocks={blocks}
                    aiResponse={aiResponse}
                />
            );
    }
};

export default ResponseRenderer;
