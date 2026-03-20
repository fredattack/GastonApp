import React from "react";
import { useTranslation } from "react-i18next";

interface QuickAction {
    id: string;
    icon: string;
    label: string;
    description: string;
    action: () => void;
    category: "navigation" | "ai" | "recent";
}

interface CommandBarResultsProps {
    query: string;
    actions: QuickAction[];
    aiResponse: string | null;
    isLoading: boolean;
    onActionSelect: (action: QuickAction) => void;
}

const CommandBarResults: React.FC<CommandBarResultsProps> = ({
    query,
    actions,
    aiResponse,
    isLoading,
    onActionSelect,
}) => {
    const { t } = useTranslation();

    const filteredActions = query.trim()
        ? actions.filter(
              (a) =>
                  a.label.toLowerCase().includes(query.toLowerCase()) ||
                  a.description.toLowerCase().includes(query.toLowerCase()),
          )
        : actions;

    const groupedActions = filteredActions.reduce(
        (groups, action) => {
            const category = action.category;
            if (!groups[category]) groups[category] = [];
            groups[category].push(action);
            return groups;
        },
        {} as Record<string, QuickAction[]>,
    );

    const categoryLabels: Record<string, string> = {
        navigation: t("Navigation"),
        ai: t("AI Actions"),
        recent: t("Recent"),
    };

    return (
        <div className="max-h-80 overflow-y-auto p-2">
            {aiResponse && (
                <div className="mx-2 mb-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-2">
                        <span className="text-primary text-lg mt-0.5">✨</span>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-primary mb-1">
                                {t("AI Response")}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {aiResponse}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="flex items-center gap-3 px-4 py-3 text-gray-500">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">{t("Thinking...")}</span>
                </div>
            )}

            {Object.entries(groupedActions).map(([category, categoryActions]) => (
                <div key={category} className="mb-2">
                    <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {categoryLabels[category] || category}
                    </div>
                    {categoryActions.map((action) => (
                        <button
                            key={action.id}
                            type="button"
                            onClick={() => onActionSelect(action)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-left group"
                        >
                            <span className="text-lg w-7 text-center flex-shrink-0">
                                {action.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {action.label}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {action.description}
                                </p>
                            </div>
                            <svg
                                className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    ))}
                </div>
            ))}

            {filteredActions.length === 0 && !isLoading && !aiResponse && (
                <div className="px-4 py-8 text-center text-gray-400">
                    <p className="text-sm">
                        {query.trim()
                            ? t("Press Enter to ask the AI")
                            : t("Type a command or question...")}
                    </p>
                </div>
            )}
        </div>
    );
};

export type { QuickAction };
export default CommandBarResults;
