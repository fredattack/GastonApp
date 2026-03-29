import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    CalendarBlank,
    Stethoscope,
    Warning,
    CalendarCheck,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

interface AIInsight {
    id: string;
    icon: Icon;
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

const MAX_INSIGHTS = 4;

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

        // 1. Overdue events (highest priority)
        const pendingEvents = events.filter(
            (e) => !e.is_done && new Date(e.start_date) < now,
        );
        if (pendingEvents.length > 0) {
            result.push({
                id: "pending-events",
                icon: Warning,
                title: t("Evenements en retard"),
                description: t(
                    "{{count}} evenement(s) necessite(nt) votre attention",
                    { count: pendingEvents.length },
                ),
                type: "warning",
            });
        }

        // 2. Today's schedule
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
                icon: CalendarBlank,
                title: t("Programme du jour"),
                description: t("{{count}} evenement(s) prevu(s) aujourd'hui", {
                    count: todayEvents.length,
                }),
                type: "info",
            });
        }

        // 3. Health check reminders (AGGREGATED - one card for all pets)
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const petsWithoutMedical = pets.filter((pet) => {
            const petMedicalEvents = events.filter(
                (e) =>
                    e.type === "medical" &&
                    e.pets?.some((p) => p.id === pet.id) &&
                    new Date(e.start_date) >= thirtyDaysAgo,
            );
            return petMedicalEvents.length === 0;
        });

        if (petsWithoutMedical.length > 0 && events.length > 0) {
            result.push({
                id: "no-medical-summary",
                icon: Stethoscope,
                title: t("Rappels de sante"),
                description:
                    petsWithoutMedical.length === 1
                        ? t(
                              "{{name}} n'a pas de visite medicale recente",
                              { name: petsWithoutMedical[0].name },
                          )
                        : t(
                              "{{count}} animaux sans visite medicale recente",
                              { count: petsWithoutMedical.length },
                          ),
                type: "warning",
                actionLabel: t("Planifier une visite"),
                onAction: onOpenCommandBar,
            });
        }

        // 4. This week preview
        const weekFromNow = new Date(now);
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        const weekEvents = events.filter((e) => {
            const eventDate = new Date(e.start_date);
            return eventDate >= now && eventDate <= weekFromNow;
        });
        if (weekEvents.length > 0) {
            result.push({
                id: "week-events",
                icon: CalendarCheck,
                title: t("Cette semaine"),
                description: t("{{count}} evenement(s) a venir", {
                    count: weekEvents.length,
                }),
                type: "info",
            });
        }

        return result.slice(0, MAX_INSIGHTS);
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
            <div
                className="grid gap-3"
                style={{
                    gridTemplateColumns: `repeat(${Math.min(insights.length, 4)}, minmax(0, 1fr))`,
                }}
            >
                {insights.map((insight) => {
                    const IconComponent = insight.icon;
                    return (
                        <div
                            key={insight.id}
                            className={`flex items-start gap-3 p-4 rounded-xl border ${typeStyles[insight.type]}`}
                        >
                            <IconComponent
                                size={22}
                                weight="duotone"
                                className="flex-shrink-0 mt-0.5 text-gray-700 dark:text-gray-300"
                            />
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
                                        {insight.actionLabel}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AIInsightsPanel;
