import React from "react";
import { useTranslation } from "react-i18next";
import {
    CheckCircle,
    Warning,
    Question,
    ArrowClockwise,
    PawPrint,
    Calendar,
    ChatCircle,
    CaretRight,
    XCircle,
} from "@phosphor-icons/react";

interface CommandBarAIResponseProps {
    response: AIResponse;
    onConfirm: () => void;
    onRetry: () => void;
    onClarify: (correctedQuery: string) => void;
    onContinueInChat: () => void;
    onNavigate: (path: string) => void;
}

const CommandBarAIResponse: React.FC<CommandBarAIResponseProps> = ({
    response,
    onConfirm,
    onRetry,
    onClarify,
    onContinueInChat,
    onNavigate,
}) => {
    const { t } = useTranslation();
    const status = response.status || "executed";

    if (status === "executed") {
        return (
            <ExecutedResponse
                response={response}
                onContinueInChat={onContinueInChat}
                onNavigate={onNavigate}
                t={t}
            />
        );
    }

    if (status === "needs_confirmation") {
        return (
            <ConfirmationResponse
                response={response}
                onConfirm={onConfirm}
                onContinueInChat={onContinueInChat}
                t={t}
            />
        );
    }

    if (status === "needs_clarification") {
        return (
            <ClarificationResponse
                response={response}
                onClarify={onClarify}
                t={t}
            />
        );
    }

    if (status === "low_confidence") {
        return <LowConfidenceResponse response={response} t={t} />;
    }

    // failed or error
    return <ErrorResponse response={response} onRetry={onRetry} t={t} />;
};

// --- Sub-components ---

interface SubProps {
    response: AIResponse;
    t: (key: string, options?: Record<string, unknown>) => string;
}

const ExecutedResponse: React.FC<
    SubProps & {
        onContinueInChat: () => void;
        onNavigate: (path: string) => void;
    }
> = ({ response, onContinueInChat, onNavigate, t }) => {
    const text =
        response.conversationResponse || response.description || "";
    const petData = response.result?.pet as
        | { name?: string; breed?: string; id?: number }
        | undefined;
    const petName = response.result?.petName as string | undefined;

    const getActionLink = (): { label: string; path: string } | null => {
        if (
            response.requestType === "petQuery" ||
            response.requestType === "query"
        ) {
            if (petData?.id) {
                return {
                    label: t("View profile"),
                    path: `/content/pets/${petData.id}`,
                };
            }
        }
        if (
            response.requestType === "createEvent" ||
            response.requestType === "updateEvent"
        ) {
            return { label: t("View calendar"), path: "/calendar" };
        }
        if (
            response.requestType === "updateFeedingSchedule" ||
            response.requestType === "markFeeding" ||
            response.requestType === "batchMarkFeeding" ||
            response.requestType === "queryDiet" ||
            response.requestType === "queryFeedingStatus"
        ) {
            return { label: t("View feeding"), path: "/feeding" };
        }
        return null;
    };

    const actionLink = getActionLink();

    return (
        <div className="mx-2 mb-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="flex items-start gap-2.5">
                <CheckCircle
                    size={20}
                    weight="fill"
                    className="text-primary mt-0.5 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                        {text}
                    </p>

                    {(petData || petName) && (
                        <div className="mt-2 flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                            <PawPrint
                                size={16}
                                className="text-primary flex-shrink-0"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {petData?.name || petName}
                            </span>
                            {petData?.breed && (
                                <span className="text-xs text-gray-400">
                                    {petData.breed}
                                </span>
                            )}
                        </div>
                    )}

                    {response.confidenceScore !== undefined && (
                        <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-medium text-primary/70 bg-primary/10 rounded-full">
                            {response.confidenceScore}%
                        </span>
                    )}

                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                        {actionLink && (
                            <button
                                type="button"
                                onClick={() => onNavigate(actionLink.path)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-full transition-colors"
                            >
                                <CaretRight size={12} />
                                {actionLink.label}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onContinueInChat}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                        >
                            <ChatCircle size={12} />
                            {t("Open in assistant")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ConfirmationResponse: React.FC<
    SubProps & {
        onConfirm: () => void;
        onContinueInChat: () => void;
    }
> = ({ response, onConfirm, onContinueInChat, t }) => {
    const text =
        response.conversationResponse || response.description || "";

    const getSummaryItems = (): { icon: React.ReactNode; label: string }[] => {
        const items: { icon: React.ReactNode; label: string }[] = [];
        const result = response.result as Record<string, unknown> | undefined;
        if (!result) return items;

        const pet = result.pet as { name?: string } | undefined;
        if (pet?.name) {
            items.push({
                icon: <PawPrint size={14} className="text-primary" />,
                label: pet.name,
            });
        }

        const foodType = result.food_type as string | undefined;
        if (foodType) {
            items.push({
                icon: (
                    <span className="text-xs text-secondary">
                        {"\u{1F356}"}
                    </span>
                ),
                label: foodType,
            });
        }

        const mealSlot = result.meal_slot as string | undefined;
        if (mealSlot) {
            items.push({
                icon: <Calendar size={14} className="text-secondary" />,
                label: mealSlot,
            });
        }

        return items;
    };

    const summaryItems = getSummaryItems();

    return (
        <div className="mx-2 mb-3 p-3 bg-secondary/5 border border-secondary/20 rounded-xl">
            <div className="flex items-start gap-2.5">
                <Warning
                    size={20}
                    weight="fill"
                    className="text-secondary mt-0.5 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                        {text}
                    </p>

                    {summaryItems.length > 0 && (
                        <div className="mt-2 space-y-1 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                            {summaryItems.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2"
                                >
                                    {item.icon}
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-3 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-full transition-colors"
                        >
                            <CheckCircle size={14} weight="bold" />
                            {t("Confirm")}
                        </button>
                        <button
                            type="button"
                            onClick={onContinueInChat}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-500 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                            {t("Modify")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClarificationResponse: React.FC<
    SubProps & { onClarify: (correctedQuery: string) => void }
> = ({ response, onClarify, t }) => {
    const text =
        response.conversationResponse ||
        response.confirmationNeeded?.question ||
        response.message ||
        "";

    // Extract pet suggestions from result if available
    const suggestions = (() => {
        const result = response.result as Record<string, unknown> | undefined;
        if (!result) return [];

        // Try to extract suggestions from various response shapes
        const petName = result.petName as string | undefined;
        if (petName) return [petName];

        const suggestions = result.suggestions as string[] | undefined;
        if (suggestions) return suggestions;

        return [];
    })();

    return (
        <div className="mx-2 mb-3 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl">
            <div className="flex items-start gap-2.5">
                <Question
                    size={20}
                    weight="fill"
                    className="text-amber-500 mt-0.5 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                        {text}
                    </p>

                    {suggestions.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-2">
                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => onClarify(suggestion)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-primary hover:text-primary rounded-lg transition-colors"
                                >
                                    <PawPrint size={14} />
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}

                    <p className="mt-2 text-xs text-gray-400">
                        {t("or type the correct name...")}
                    </p>
                </div>
            </div>
        </div>
    );
};

const LowConfidenceResponse: React.FC<SubProps> = ({ response, t }) => {
    const text =
        response.conversationResponse ||
        response.message ||
        t("I'm not sure I understand. Could you rephrase?");

    return (
        <div className="mx-2 mb-3 p-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30 rounded-xl">
            <div className="flex items-start gap-2.5">
                <Question
                    size={20}
                    weight="fill"
                    className="text-orange-400 mt-0.5 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                        {text}
                    </p>
                    <p className="mt-1.5 text-xs text-gray-400">
                        {t("Try rephrasing your question")}
                    </p>
                </div>
            </div>
        </div>
    );
};

const ErrorResponse: React.FC<SubProps & { onRetry: () => void }> = ({
    response,
    onRetry,
    t,
}) => {
    const status = response.status || "error";
    const text =
        status === "failed"
            ? response.conversationResponse ||
              response.message ||
              t("The action could not be executed.")
            : t("The service is temporarily unavailable.");

    return (
        <div className="mx-2 mb-3 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl">
            <div className="flex items-start gap-2.5">
                <XCircle
                    size={20}
                    weight="fill"
                    className="text-red-400 mt-0.5 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                        {text}
                    </p>
                    <button
                        type="button"
                        onClick={onRetry}
                        className="mt-2.5 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <ArrowClockwise size={12} />
                        {t("Retry")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommandBarAIResponse;
