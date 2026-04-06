import React from "react";

interface DataBlockRendererProps {
    block: StructuredBlock;
}

/**
 * Generic fallback renderer for structured blocks that don't have
 * a specialized component. Renders the block content or a JSON summary.
 */
const DataBlockRenderer: React.FC<DataBlockRendererProps> = ({ block }) => {
    if (block.content) {
        return (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                    {block.content}
                </p>
            </div>
        );
    }

    // Render data as a simple key-value display
    const entries = Object.entries(block.data).filter(
        ([key]) => key !== "type" && key !== "id",
    );

    if (entries.length === 0) return null;

    return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="space-y-1">
                {entries.map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2 text-xs">
                        <span className="font-medium text-gray-500 dark:text-gray-400 min-w-[80px]">
                            {key}
                        </span>
                        <span className="text-gray-900 dark:text-white">
                            {typeof value === "object"
                                ? JSON.stringify(value)
                                : String(value)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DataBlockRenderer;
