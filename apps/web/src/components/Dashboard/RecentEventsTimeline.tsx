import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface RecentEventsTimelineProps {
    events: EventFormData[];
}

const eventTypeIcons: Record<string, string> = {
    medical: "💊",
    feeding: "🍖",
    appointment: "📋",
    training: "🎯",
    social: "🐕",
    grooming: "✂️",
    walk: "🚶",
    other: "📌",
};

const RecentEventsTimeline: React.FC<RecentEventsTimelineProps> = ({
    events,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const recentEvents = useMemo(() => {
        return [...events]
            .sort(
                (a, b) =>
                    new Date(b.start_date).getTime() -
                    new Date(a.start_date).getTime(),
            )
            .slice(0, 5);
    }, [events]);

    if (recentEvents.length === 0) {
        return (
            <div className="text-center py-8 text-gray-400">
                <p className="text-4xl mb-3">📅</p>
                <p className="text-sm">{t("No events yet")}</p>
                <p className="text-xs mt-1">
                    {t("Use the AI to create your first event")}
                </p>
            </div>
        );
    }

    const formatDate = (date: Date | string): string => {
        const d = new Date(date);
        const now = new Date();
        const diffDays = Math.floor(
            (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays === 0) return t("Today");
        if (diffDays === 1) return t("Yesterday");
        if (diffDays < 7) return t("{{count}} days ago", { count: diffDays });

        return d.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="space-y-1">
            {recentEvents.map((event, index) => (
                <div
                    key={event.id || index}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    onClick={() => navigate("/calendar")}
                >
                    <span className="text-lg w-8 text-center flex-shrink-0">
                        {eventTypeIcons[event.type] || "📌"}
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {event.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {event.type}
                            </span>
                            {event.pets && event.pets.length > 0 && (
                                <>
                                    <span className="text-gray-300">·</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {event.pets
                                            .map((p) => p.name)
                                            .join(", ")}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-400">
                            {formatDate(event.start_date)}
                        </span>
                        {event.is_done && (
                            <span
                                className="w-2 h-2 bg-green-400 rounded-full"
                                title={t("Completed")}
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecentEventsTimeline;
