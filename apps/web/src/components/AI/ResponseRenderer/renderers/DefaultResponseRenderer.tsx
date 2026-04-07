import React from "react";
import DataBlockRenderer from "../DataBlockRenderer";

interface DefaultResponseRendererProps {
    content: string;
    blocks?: StructuredBlock[];
    aiResponse?: AIResponse;
}

const DefaultResponseRenderer: React.FC<DefaultResponseRendererProps> = ({
    content,
    blocks,
}) => {
    return (
        <div className="space-y-3">
            {content && (
                <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                    {content}
                </p>
            )}
            {blocks && blocks.length > 0 && (
                <div className="space-y-2">
                    {blocks.map((block) => (
                        <DataBlockRenderer key={block.id} block={block} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DefaultResponseRenderer;
