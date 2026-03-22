import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePets } from "../contexts/PetsContext";
import { useEvents } from "../contexts/EventsContext";
import { useCommandBar, CommandBar } from "../components/AI/CommandBar";
import AIInsightsPanel from "../components/Dashboard/AIInsightsPanel";
import RecentEventsTimeline from "../components/Dashboard/RecentEventsTimeline";

const QUICK_ACTIONS = [
    {
        icon: "📅",
        variant: "mint" as const,
        labelKey: "New Event",
        descKey: "Plan an activity",
        route: "/calendar",
    },
    {
        icon: "🐾",
        variant: "lavender" as const,
        labelKey: "Add Pet",
        descKey: "Register new",
        route: "/content/pets/create",
    },
    {
        icon: "✨",
        variant: "coral" as const,
        labelKey: "AI Assistant",
        descKey: "Full conversation",
        route: "/ai-assistant",
    },
    {
        icon: "📊",
        variant: "yellow" as const,
        labelKey: "My Pets",
        descKey: "{{count}} registered",
        route: "/content/pets",
    },
] as const;

const VARIANT_STYLES = {
    mint: {
        background:
            "linear-gradient(135deg, var(--color-primary-50), var(--color-primary-100))",
        iconBg: "var(--color-primary-50)",
    },
    lavender: {
        background:
            "linear-gradient(135deg, var(--color-lavender-light), rgba(209, 179, 232, 0.3))",
        iconBg: "var(--color-lavender-light)",
    },
    coral: {
        background:
            "linear-gradient(135deg, var(--color-coral-light), rgba(255, 181, 154, 0.3))",
        iconBg: "var(--color-coral-light)",
    },
    yellow: {
        background:
            "linear-gradient(135deg, var(--color-yellow-light), rgba(255, 232, 140, 0.3))",
        iconBg: "var(--color-yellow-light)",
    },
} as const;

const Index: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { pets, isLoading: petsLoading } = usePets();
    const { events, isLoading: eventsLoading } = useEvents();
    const { isOpen, open, close } = useCommandBar();

    const getGreeting = (): { text: string; icon: string } => {
        const hour = new Date().getHours();
        if (hour < 12) return { text: t("Good morning"), icon: "☀️" };
        if (hour < 18) return { text: t("Good afternoon"), icon: "🌤️" };
        return { text: t("Good evening"), icon: "🌙" };
    };

    const isLoading = petsLoading || eventsLoading;
    const greeting = getGreeting();

    // Redirect to onboarding if user has no pets and loading is done
    if (!petsLoading && pets.length === 0) {
        return <Navigate to="/onboarding" replace />;
    }

    return (
        <div
            className="max-w-5xl mx-auto"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-32)",
            }}
        >
            {/* Hero Section */}
            <section
                style={{
                    background:
                        "linear-gradient(135deg, var(--color-lin-0), var(--color-lin-1))",
                    borderRadius: "var(--radius-xl)",
                    padding: "var(--spacing-32)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div style={{ position: "relative", zIndex: 1 }}>
                    <h1
                        style={{
                            fontSize: "var(--font-size-h2)",
                            fontWeight: "var(--font-weight-bold)",
                            color: "var(--color-text-primary)",
                            lineHeight: "var(--line-height-tight)",
                            marginBottom: "var(--spacing-8)",
                        }}
                    >
                        <span style={{ fontSize: "var(--font-size-h1)" }}>
                            {greeting.icon}
                        </span>{" "}
                        {greeting.text} 👋
                    </h1>
                    <p
                        style={{
                            fontSize: "var(--font-size-body-l)",
                            color: "var(--color-text-secondary)",
                            marginBottom: "var(--spacing-24)",
                        }}
                    >
                        {pets.length > 0
                            ? t(
                                  "You have {{petCount}} pet(s) and {{eventCount}} event(s)",
                                  {
                                      petCount: pets.length,
                                      eventCount: events.length,
                                  },
                              )
                            : t("Welcome to GastonApp! Let's get started.")}
                    </p>

                    {/* AI Quick Input */}
                    <button
                        type="button"
                        onClick={open}
                        className="group"
                        style={{
                            width: "100%",
                            maxWidth: "520px",
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-12)",
                            padding: "var(--spacing-16) var(--spacing-20)",
                            background: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(12px)",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--color-lin-3)",
                            boxShadow: "var(--shadow-sm)",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all var(--transition-normal)",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "var(--font-size-body-l)",
                                color: "var(--color-primary-400)",
                            }}
                        >
                            ✨
                        </span>
                        <span
                            className="flex-1"
                            style={{
                                color: "var(--color-text-hint)",
                                fontSize: "var(--font-size-body-m)",
                            }}
                        >
                            {t("Ask anything about your pets...")}
                        </span>
                        <kbd
                            className="hidden sm:inline-flex items-center"
                            style={{
                                padding: "2px 8px",
                                fontSize: "var(--font-size-caption)",
                                color: "var(--color-text-tertiary)",
                                background: "var(--color-lin-2)",
                                borderRadius: "var(--radius-xs)",
                                fontFamily: "monospace",
                            }}
                        >
                            ⌘K
                        </kbd>
                    </button>
                </div>

                {/* Decorative circles */}
                <div
                    style={{
                        position: "absolute",
                        top: "-64px",
                        right: "-32px",
                        width: "256px",
                        height: "256px",
                        borderRadius: "var(--radius-full)",
                        background: "var(--color-primary-50)",
                        opacity: 0.5,
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "-48px",
                        left: "-24px",
                        width: "192px",
                        height: "192px",
                        borderRadius: "var(--radius-full)",
                        background: "var(--color-secondary-50)",
                        opacity: 0.4,
                    }}
                />
            </section>

            {/* AI Insights */}
            {!isLoading && (
                <AIInsightsPanel
                    pets={pets}
                    events={events}
                    onOpenCommandBar={open}
                />
            )}

            {/* Quick Actions */}
            <section>
                <h2
                    style={{
                        fontSize: "var(--font-size-body-l)",
                        fontWeight: "var(--font-weight-semibold)",
                        color: "var(--color-text-primary)",
                        marginBottom: "var(--spacing-16)",
                    }}
                >
                    {t("Quick Actions")}
                </h2>
                <div
                    className="grid grid-cols-2 md:grid-cols-4"
                    style={{ gap: "var(--spacing-12)" }}
                >
                    {QUICK_ACTIONS.map((action) => (
                        <QuickActionCard
                            key={action.route}
                            icon={action.icon}
                            label={t(action.labelKey)}
                            description={
                                action.descKey.includes("{{count}}")
                                    ? t(action.descKey, { count: pets.length })
                                    : t(action.descKey)
                            }
                            variant={action.variant}
                            onClick={() => navigate(action.route)}
                        />
                    ))}
                </div>
            </section>

            {/* Two Column Layout */}
            <div
                className="grid grid-cols-1 lg:grid-cols-3"
                style={{ gap: "var(--spacing-24)" }}
            >
                {/* Pets Summary */}
                <section className="lg:col-span-1">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "var(--spacing-16)",
                        }}
                    >
                        <h2
                            style={{
                                fontSize: "var(--font-size-body-l)",
                                fontWeight: "var(--font-weight-semibold)",
                                color: "var(--color-text-primary)",
                            }}
                        >
                            {t("My Pets")}{" "}
                            {pets.length > 0 && `(${pets.length})`}
                        </h2>
                        {pets.length > 0 && (
                            <button
                                type="button"
                                onClick={() => navigate("/content/pets")}
                                style={{
                                    fontSize: "var(--font-size-body-s)",
                                    color: "var(--color-primary-500)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    fontWeight: "var(--font-weight-semibold)",
                                }}
                            >
                                {t("View all")}
                            </button>
                        )}
                    </div>
                    {isLoading ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--spacing-12)",
                            }}
                        >
                            {[1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="animate-pulse"
                                    style={{
                                        height: "80px",
                                        background: "var(--color-lin-2)",
                                        borderRadius: "var(--radius-xl)",
                                    }}
                                />
                            ))}
                        </div>
                    ) : pets.length > 0 ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--spacing-12)",
                            }}
                        >
                            {pets.map((pet) => (
                                <button
                                    type="button"
                                    key={pet.id}
                                    onClick={() =>
                                        navigate(`/content/pets/${pet.id}`)
                                    }
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "var(--spacing-12)",
                                        padding: "var(--spacing-16)",
                                        background: "var(--color-lin-0)",
                                        borderRadius: "var(--radius-xl)",
                                        border: "1px solid var(--color-lin-3)",
                                        boxShadow: "var(--shadow-xs)",
                                        cursor: "pointer",
                                        textAlign: "left",
                                        width: "100%",
                                        transition:
                                            "all var(--transition-normal)",
                                    }}
                                    className="hover:shadow-md"
                                >
                                    <div
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                            borderRadius: "var(--radius-full)",
                                            background:
                                                "var(--color-primary-50)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "var(--font-size-h4)",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {pet.species === "dog"
                                            ? "🐕"
                                            : pet.species === "cat"
                                              ? "🐈"
                                              : "🐾"}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p
                                            style={{
                                                fontWeight:
                                                    "var(--font-weight-semibold)",
                                                color: "var(--color-text-primary)",
                                                fontSize:
                                                    "var(--font-size-body-m)",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {pet.name}
                                        </p>
                                        <p
                                            style={{
                                                color: "var(--color-text-tertiary)",
                                                fontSize:
                                                    "var(--font-size-body-s)",
                                            }}
                                        >
                                            {pet.breed || pet.species}
                                        </p>
                                    </div>
                                    <svg
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            color: "var(--color-lin-6)",
                                        }}
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
                    ) : (
                        <button
                            type="button"
                            onClick={() => navigate("/content/pets/create")}
                            style={{
                                width: "100%",
                                padding: "var(--spacing-24)",
                                background: "var(--color-lin-0)",
                                borderRadius: "var(--radius-xl)",
                                border: "2px dashed var(--color-lin-5)",
                                cursor: "pointer",
                                textAlign: "center",
                                transition: "all var(--transition-normal)",
                            }}
                            className="hover:border-primary/50"
                        >
                            <p
                                style={{
                                    fontSize: "var(--font-size-h2)",
                                    marginBottom: "var(--spacing-8)",
                                }}
                            >
                                🐾
                            </p>
                            <p
                                style={{
                                    fontSize: "var(--font-size-body-s)",
                                    fontWeight: "var(--font-weight-semibold)",
                                    color: "var(--color-text-secondary)",
                                }}
                            >
                                {t("Add your first pet")}
                            </p>
                        </button>
                    )}
                </section>

                {/* Recent Events */}
                <section className="lg:col-span-2">
                    <h2
                        style={{
                            fontSize: "var(--font-size-body-l)",
                            fontWeight: "var(--font-weight-semibold)",
                            color: "var(--color-text-primary)",
                            marginBottom: "var(--spacing-16)",
                        }}
                    >
                        {t("Recent Events")}
                    </h2>
                    <div
                        style={{
                            background: "var(--color-lin-0)",
                            borderRadius: "var(--radius-xl)",
                            border: "1px solid var(--color-lin-3)",
                            boxShadow: "var(--shadow-xs)",
                            overflow: "hidden",
                        }}
                    >
                        {isLoading ? (
                            <div
                                style={{
                                    padding: "var(--spacing-16)",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "var(--spacing-12)",
                                }}
                            >
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="animate-pulse"
                                        style={{
                                            height: "56px",
                                            background: "var(--color-lin-2)",
                                            borderRadius: "var(--radius-md)",
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <RecentEventsTimeline events={events} />
                        )}
                    </div>
                </section>
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
    variant: keyof typeof VARIANT_STYLES;
    onClick: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
    icon,
    label,
    description,
    variant,
    onClick,
}) => {
    const styles = VARIANT_STYLES[variant];

    return (
        <button
            type="button"
            onClick={onClick}
            className="group"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--spacing-8)",
                padding: "var(--spacing-20)",
                background: styles.background,
                borderRadius: "var(--radius-2xl)",
                border: "none",
                boxShadow: "var(--shadow-sm)",
                cursor: "pointer",
                textAlign: "center",
                minHeight: "120px",
                transition: "all var(--transition-normal)",
            }}
        >
            <span
                className="group-hover:scale-110 transition-transform"
                style={{
                    fontSize: "var(--font-size-h3)",
                    display: "block",
                    marginBottom: "var(--spacing-4)",
                }}
            >
                {icon}
            </span>
            <div>
                <p
                    style={{
                        fontSize: "var(--font-size-body-s)",
                        fontWeight: "var(--font-weight-semibold)",
                        color: "var(--color-text-primary)",
                        marginBottom: "2px",
                    }}
                >
                    {label}
                </p>
                <p
                    style={{
                        fontSize: "var(--font-size-caption)",
                        color: "var(--color-text-tertiary)",
                    }}
                >
                    {description}
                </p>
            </div>
        </button>
    );
};

export default Index;
