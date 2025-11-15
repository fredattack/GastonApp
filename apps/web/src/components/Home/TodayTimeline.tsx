import React from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../../contexts/EventsContext";

/**
 * Today Timeline - Événements du jour
 * Affiche une timeline chronologique des événements de la journée
 */
const TodayTimeline: React.FC = () => {
    const { events, isLoading } = useEvents();
    const navigate = useNavigate();

    const getEventEmoji = (type?: string): string => {
        const emojiMap: Record<string, string> = {
            feeding: "🥩",
            medical: "💊",
            appointment: "📍",
            training: "🏃",
            social: "🎮",
            grooming: "✂️",
            walk: "🚶",
        };
        return emojiMap[type?.toLowerCase() || ""] || "📌";
    };

    const formatTime = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const isToday = (dateString: string): boolean => {
        const date = new Date(dateString);
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const todayEvents = events
        .filter((event) => isToday(event.start_date))
        .sort(
            (a, b) =>
                new Date(a.start_date).getTime() -
                new Date(b.start_date).getTime(),
        );

    if (isLoading) {
        return (
            <div className="mb-6 md:mb-8">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Aujourd'hui
                </h2>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-16 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (todayEvents.length === 0) {
        return (
            <div className="mb-6 md:mb-8">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Aujourd'hui
                </h2>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-700">
                    <div className="text-4xl mb-2">🎉</div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                        Aucun événement prévu
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Profitez de votre journée libre !
                    </p>
                </div>
            </div>
        );
    }

    return (
        <section className="mb-6 md:mb-8" aria-labelledby="today-events-heading">
            <div className="flex items-center justify-between mb-4">
                <h2
                    id="today-events-heading"
                    className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white"
                >
                    Aujourd'hui
                </h2>
                <span
                    className="text-sm text-gray-600 dark:text-gray-400"
                    aria-label={`${todayEvents.length} événement${todayEvents.length > 1 ? "s" : ""} aujourd'hui`}
                >
                    {todayEvents.length} événement
                    {todayEvents.length > 1 ? "s" : ""}
                </span>
            </div>

            <div className="space-y-2" role="list">
                {todayEvents.map((event, index) => (
                    <button
                        key={event.id}
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="
                            w-full
                            bg-white dark:bg-gray-800
                            rounded-xl p-4
                            shadow-sm hover:shadow-md
                            transition-all duration-200
                            hover:scale-[1.01] active:scale-[0.99]
                            border border-gray-200 dark:border-gray-700
                            text-left
                            flex items-center gap-4
                            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900
                        "
                        aria-label={`${event.title || "Événement"} à ${formatTime(event.start_date)}${event.pets && event.pets.length > 0 ? ` pour ${event.pets.map((p) => p.name).join(", ")}` : ""}`}
                        type="button"
                        role="listitem"
                    >
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl">
                                {getEventEmoji(event.type)}
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-sm font-semibold text-primary">
                                    {formatTime(event.start_date)}
                                </span>
                                <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm">
                                    {event.title || "Événement"}
                                </h3>
                            </div>

                            {event.pets && event.pets.length > 0 && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                    Pour:{" "}
                                    {event.pets.map((p) => p.name).join(", ")}
                                </p>
                            )}
                        </div>

                        <div className="flex-shrink-0">
                            <svg
                                className="w-5 h-5 text-gray-400"
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
                        </div>
                    </button>
                ))}
            </div>

            {todayEvents.length >= 3 && (
                <button
                    onClick={() => navigate("/")}
                    className="
                        w-full mt-3
                        text-sm text-primary
                        hover:underline
                        py-2
                    "
                >
                    Voir le calendrier complet
                </button>
            )}
        </section>
    );
};

export default TodayTimeline;
