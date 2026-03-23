import React from "react";
import { useTranslation } from "react-i18next";
import { CaretRight } from "@phosphor-icons/react";
import CommandBarAIResponse from "./CommandBarAIResponse";

interface QuickAction {
    id: string;
    icon: React.ReactNode;
    label: string;
    description: string;
    action: () => void;
    category: "ai" | "recent";
}

interface CommandBarResultsProps {
    query: string;
    actions: QuickAction[];
    aiResponse: AIResponse | null;
    isLoading: boolean;
    onActionSelect: (action: QuickAction) => void;
    onConfirm: () => void;
    onRetry: () => void;
    onClarify: (correctedQuery: string) => void;
    onContinueInChat: () => void;
    onNavigate: (path: string) => void;
}

const CommandBarResults: React.FC<CommandBarResultsProps> = ({
    query,
    actions,
    aiResponse,
    isLoading,
    onActionSelect,
    onConfirm,
    onRetry,
    onClarify,
    onContinueInChat,
    onNavigate,
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
            const { category } = action;
            if (!groups[category]) groups[category] = [];
            groups[category].push(action);
            return groups;
        },
        {} as Record<string, QuickAction[]>,
    );

    const categoryLabels: Record<string, string> = {
        ai: t("Suggestions"),
        recent: t("Recent"),
    };

    return (
        <div className="max-h-[60vh] overflow-y-auto p-2">
            {aiResponse && (
                <CommandBarAIResponse
                    response={aiResponse}
                    onConfirm={onConfirm}
                    onRetry={onRetry}
                    onClarify={onClarify}
                    onContinueInChat={onContinueInChat}
                    onNavigate={onNavigate}
                />
            )}

            {isLoading && (
                <div className="flex items-center gap-3 px-4 py-6 text-gray-500">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">{t("Gaston is thinking...")}</span>
                </div>
            )}

            {!aiResponse &&
                !isLoading &&
                Object.entries(groupedActions).map(
                    ([category, categoryActions]) => (
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
                                    <span className="w-7 text-center flex-shrink-0 text-gray-500">
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
                                    <CaretRight
                                        size={16}
                                        className="text-gray-300 group-hover:text-gray-500 flex-shrink-0"
                                    />
                                </button>
                            ))}
                        </div>
                    ),
                )}

            {filteredActions.length === 0 &&
                !isLoading &&
                !aiResponse && (
                    <div className="px-4 py-8 text-center text-gray-400">
                        <p className="text-sm">
                            {query.trim()
                                ? t("Press Enter to ask Gaston")
                                : t("Type a command or question...")}
                        </p>
                    </div>
                )}
        </div>
    );
};

export type { QuickAction };
export default CommandBarResults;
