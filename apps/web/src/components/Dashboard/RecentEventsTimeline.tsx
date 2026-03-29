import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
    Stethoscope,
    ForkKnife,
    ClipboardText,
    Target,
    Dog,
    Scissors,
    PersonSimpleWalk,
    PushPin,
    CalendarBlank,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

interface RecentEventsTimelineProps {
    events: EventFormData[];
}

const eventTypeIcons: Record<string, Icon> = {
    medical: Stethoscope,
    feeding: ForkKnife,
    appointment: ClipboardText,
    training: Target,
    social: Dog,
    grooming: Scissors,
    walk: PersonSimpleWalk,
    other: PushPin,
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
                <CalendarBlank size={40} weight="duotone" className="mx-auto mb-3" />
                <p className="text-sm">{t("Aucun evenement")}</p>
                <p className="text-xs mt-1">
                    {t("Utilisez l'IA pour creer votre premier evenement")}
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
                    {(() => {
                        const EventIcon = eventTypeIcons[event.type] || PushPin;
                        return (
                            <div className="w-8 flex-shrink-0 flex items-center justify-center">
                                <EventIcon size={20} weight="duotone" className="text-gray-500 dark:text-gray-400" />
                            </div>
                        );
                    })()}
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
