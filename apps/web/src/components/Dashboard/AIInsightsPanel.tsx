import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface AIInsight {
    id: string;
    icon: string;
    title: string;
    description: string;
    type: "info" | "warning" | "success" | "action";
    actionLabel?: string;
    onAction?: () => void;
}

interface AIInsightsPanelProps {
    pets: Pet[];
    events: EventFormData[];
    onOpenCommandBar: () => void;
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
    pets,
    events,
    onOpenCommandBar,
}) => {
    const { t } = useTranslation();

    const insights = useMemo<AIInsight[]>(() => {
        const result: AIInsight[] = [];
        const now = new Date();
        const today = now.toISOString().split("T")[0];

        // Upcoming events today
        const todayEvents = events.filter((e) => {
            const eventDate =
                typeof e.start_date === "string"
                    ? e.start_date.split("T")[0]
                    : new Date(e.start_date).toISOString().split("T")[0];
            return eventDate === today;
        });

        if (todayEvents.length > 0) {
            result.push({
                id: "today-events",
                icon: "📅",
                title: t("Today's Schedule"),
                description: t("{{count}} event(s) planned for today", {
                    count: todayEvents.length,
                }),
                type: "info",
            });
        }

        // Upcoming events this week
        const weekFromNow = new Date(now);
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        const weekEvents = events.filter((e) => {
            const eventDate = new Date(e.start_date);
            return eventDate >= now && eventDate <= weekFromNow;
        });

        if (weekEvents.length > 0) {
            result.push({
                id: "week-events",
                icon: "🗓️",
                title: t("This Week"),
                description: t("{{count}} event(s) coming up this week", {
                    count: weekEvents.length,
                }),
                type: "info",
            });
        }

        // Medical events check for each pet
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        pets.forEach((pet) => {
            const petMedicalEvents = events.filter(
                (e) =>
                    e.type === "medical" &&
                    e.pets?.some((p) => p.id === pet.id) &&
                    new Date(e.start_date) >= thirtyDaysAgo,
            );

            if (petMedicalEvents.length === 0 && events.length > 0) {
                result.push({
                    id: `no-medical-${pet.id}`,
                    icon: "💊",
                    title: t("Health Check Reminder"),
                    description: t(
                        "No medical events for {{petName}} in the last 30 days",
                        { petName: pet.name },
                    ),
                    type: "warning",
                    actionLabel: t("Schedule checkup"),
                    onAction: onOpenCommandBar,
                });
            }
        });

        // No pets registered
        if (pets.length === 0) {
            result.push({
                id: "no-pets",
                icon: "🐾",
                title: t("Welcome!"),
                description: t(
                    "Start by adding your first pet to get personalized insights",
                ),
                type: "action",
                actionLabel: t("Add a pet"),
                onAction: onOpenCommandBar,
            });
        }

        // Pending events (not done)
        const pendingEvents = events.filter(
            (e) => !e.is_done && new Date(e.start_date) < now,
        );

        if (pendingEvents.length > 0) {
            result.push({
                id: "pending-events",
                icon: "⏰",
                title: t("Overdue Events"),
                description: t("{{count}} event(s) need your attention", {
                    count: pendingEvents.length,
                }),
                type: "warning",
            });
        }

        return result;
    }, [pets, events, t, onOpenCommandBar]);

    if (insights.length === 0) return null;

    const typeStyles: Record<string, string> = {
        info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
        warning:
            "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
        success:
            "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
        action: "bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30",
    };

    return (
        <div className="space-y-3">
            <h2
                className="text-lg font-semibold flex items-center gap-2"
                style={{ color: "var(--color-primary-900, #1a1a2e)" }}
            >
                <span>✨</span>
                {t("AI Insights")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {insights.map((insight) => (
                    <div
                        key={insight.id}
                        className={`flex items-start gap-3 p-4 rounded-xl border ${typeStyles[insight.type]}`}
                    >
                        <span className="text-xl flex-shrink-0 mt-0.5">
                            {insight.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {insight.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                {insight.description}
                            </p>
                            {insight.actionLabel && insight.onAction && (
                                <button
                                    type="button"
                                    onClick={insight.onAction}
                                    className="mt-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                >
                                    {insight.actionLabel} →
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AIInsightsPanel;
