import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePets } from "../contexts/PetsContext";
import { useEvents } from "../contexts/EventsContext";
import { useCommandBar } from "../components/AI/CommandBar";
import { CommandBar } from "../components/AI/CommandBar";
import AIInsightsPanel from "../components/Dashboard/AIInsightsPanel";
import RecentEventsTimeline from "../components/Dashboard/RecentEventsTimeline";

const Index: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { pets, isLoading: petsLoading } = usePets();
    const { events, isLoading: eventsLoading } = useEvents();
    const { isOpen, open, close } = useCommandBar();

    const getGreeting = (): string => {
        const hour = new Date().getHours();
        if (hour < 12) return t("Good morning");
        if (hour < 18) return t("Good afternoon");
        return t("Good evening");
    };

    const isLoading = petsLoading || eventsLoading;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Hero AI Greeting */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 dark:from-primary/20 dark:via-primary/10 dark:to-secondary/20 p-8">
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {getGreeting()} 👋
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                        {pets.length > 0
                            ? t("You have {{petCount}} pet(s) and {{eventCount}} event(s)", {
                                  petCount: pets.length,
                                  eventCount: events.length,
                              })
                            : t("Welcome to GastonApp! Let's get started.")}
                    </p>

                    {/* AI Quick Input */}
                    <button
                        type="button"
                        onClick={open}
                        className="w-full max-w-lg flex items-center gap-3 px-5 py-3.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-primary/30 transition-all text-left group"
                    >
                        <span className="text-primary text-lg">✨</span>
                        <span className="flex-1 text-gray-400 group-hover:text-gray-500">
                            {t("Ask anything about your pets...")}
                        </span>
                        <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 rounded font-mono">
                            ⌘K
                        </kbd>
                    </button>
                </div>

                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/4" />
            </div>

            {/* AI Insights */}
            {!isLoading && (
                <AIInsightsPanel
                    pets={pets}
                    events={events}
                    onOpenCommandBar={open}
                />
            )}

            {/* Quick Actions */}
            <div>
                <h2
                    className="text-lg font-semibold mb-4"
                    style={{ color: "var(--color-primary-900, #1a1a2e)" }}
                >
                    {t("Quick Actions")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <QuickActionCard
                        icon="🐾"
                        label={t("My Pets")}
                        description={t("{{count}} registered", { count: pets.length })}
                        onClick={() => navigate("/content/pets")}
                    />
                    <QuickActionCard
                        icon="📅"
                        label={t("Calendar")}
                        description={t("View schedule")}
                        onClick={() => navigate("/calendar")}
                    />
                    <QuickActionCard
                        icon="✨"
                        label={t("AI Assistant")}
                        description={t("Full conversation")}
                        onClick={() => navigate("/ai-assistant")}
                    />
                    <QuickActionCard
                        icon="➕"
                        label={t("Add Pet")}
                        description={t("Register new")}
                        onClick={() => navigate("/content/pets/create")}
                    />
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pets Summary */}
                <div className="lg:col-span-1">
                    <h2
                        className="text-lg font-semibold mb-4"
                        style={{ color: "var(--color-primary-900, #1a1a2e)" }}
                    >
                        {t("My Pets")}
                    </h2>
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
                                />
                            ))}
                        </div>
                    ) : pets.length > 0 ? (
                        <div className="space-y-3">
                            {pets.map((pet) => (
                                <div
                                    key={pet.id}
                                    className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow cursor-pointer"
                                    onClick={() =>
                                        navigate(`/content/pets/${pet.id}`)
                                    }
                                >
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                                        {pet.species === "dog" ? "🐕" : pet.species === "cat" ? "🐈" : "🐾"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 dark:text-white truncate">
                                            {pet.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {pet.breed || pet.species}
                                        </p>
                                    </div>
                                    <svg
                                        className="w-4 h-4 text-gray-300"
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
                            ))}
                        </div>
                    ) : (
                        <div
                            className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-center cursor-pointer hover:border-primary/50 transition-colors"
                            onClick={() => navigate("/content/pets/create")}
                        >
                            <p className="text-3xl mb-2">🐾</p>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("Add your first pet")}
                            </p>
                        </div>
                    )}
                </div>

                {/* Recent Events */}
                <div className="lg:col-span-2">
                    <h2
                        className="text-lg font-semibold mb-4"
                        style={{ color: "var(--color-primary-900, #1a1a2e)" }}
                    >
                        {t("Recent Events")}
                    </h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                        {isLoading ? (
                            <div className="p-4 space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="h-14 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : (
                            <RecentEventsTimeline events={events} />
                        )}
                    </div>
                </div>
            </div>

            {/* Command Bar */}
            <CommandBar isOpen={isOpen} onClose={close} />
        </div>
    );
};

interface QuickActionCardProps {
    icon: string;
    label: string;
    description: string;
    onClick: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
    icon,
    label,
    description,
    onClick,
}) => (
    <button
        type="button"
        onClick={onClick}
        className="flex flex-col items-center gap-2 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-primary/30 transition-all text-center group"
    >
        <span className="text-2xl group-hover:scale-110 transition-transform">
            {icon}
        </span>
        <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {label}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                {description}
            </p>
        </div>
    </button>
);

export default Index;
