import React, { useMemo } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    CalendarPlus,
    PawPrint,
    Sparkle,
    ListBullets,
    Sun,
    CloudSun,
    Moon,
    Dog,
    Cat,
    CaretRight,
    CalendarBlank,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { usePets } from "../contexts/PetsContext";
import { useEvents } from "../contexts/EventsContext";
import { useCommandBar } from "../components/AI/CommandBar";
import AIInsightsPanel from "../components/Dashboard/AIInsightsPanel";
import RecentEventsTimeline from "../components/Dashboard/RecentEventsTimeline";

const MAX_PETS_DISPLAYED = 5;

const QUICK_ACTIONS: {
    icon: Icon;
    variant: "mint" | "lavender" | "coral" | "yellow";
    labelKey: string;
    descKey: string;
    route: string;
}[] = [
    {
        icon: CalendarPlus,
        variant: "mint",
        labelKey: "Nouvel evenement",
        descKey: "Planifier une activite",
        route: "/calendar",
    },
    {
        icon: PawPrint,
        variant: "lavender",
        labelKey: "Ajouter un animal",
        descKey: "Enregistrer",
        route: "/content/pets/create",
    },
    {
        icon: Sparkle,
        variant: "coral",
        labelKey: "Assistant IA",
        descKey: "Conversation complete",
        route: "/ai-assistant",
    },
    {
        icon: ListBullets,
        variant: "yellow",
        labelKey: "Mes animaux",
        descKey: "{{count}} enregistre(s)",
        route: "/content/pets",
    },
];

const VARIANT_STYLES = {
    mint: {
        background:
            "linear-gradient(135deg, var(--color-primary-50), var(--color-primary-100))",
    },
    lavender: {
        background:
            "linear-gradient(135deg, var(--color-lavender-light), rgba(209, 179, 232, 0.3))",
    },
    coral: {
        background:
            "linear-gradient(135deg, var(--color-coral-light), rgba(255, 181, 154, 0.3))",
    },
    yellow: {
        background:
            "linear-gradient(135deg, var(--color-yellow-light), rgba(255, 232, 140, 0.3))",
    },
} as const;

const Index: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { pets, isLoading: petsLoading } = usePets();
    const { events, isLoading: eventsLoading } = useEvents();
    const { open } = useCommandBar();

    const getGreeting = (): { text: string; Icon: Icon } => {
        const hour = new Date().getHours();
        if (hour < 12) return { text: t("Bonjour"), Icon: Sun };
        if (hour < 18) return { text: t("Bon apres-midi"), Icon: CloudSun };
        return { text: t("Bonsoir"), Icon: Moon };
    };

    const isLoading = petsLoading || eventsLoading;
    const greeting = getGreeting();
    const GreetingIcon = greeting.Icon;

    // Redirect to onboarding if user has no pets and loading is done
    if (!petsLoading && pets.length === 0) {
        return <Navigate to="/onboarding" replace />;
    }

    // Actionable stat for the greeting
    const todayCount = events.filter((e) => {
        const d =
            typeof e.start_date === "string"
                ? e.start_date.split("T")[0]
                : new Date(e.start_date).toISOString().split("T")[0];
        return d === new Date().toISOString().split("T")[0];
    }).length;

    const displayedPets = pets.slice(0, MAX_PETS_DISPLAYED);

    return (
        <div
            className="max-w-5xl mx-auto"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-24)",
            }}
        >
            {/* Greeting Section */}
            <section
                style={{
                    background:
                        "linear-gradient(135deg, var(--color-lin-0), var(--color-lin-1))",
                    borderRadius: "var(--radius-xl)",
                    padding: "var(--spacing-24) var(--spacing-32)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div style={{ position: "relative", zIndex: 1 }}>
                    <h1
                        className="flex items-center gap-3"
                        style={{
                            fontSize: "var(--font-size-h3)",
                            fontWeight: "var(--font-weight-bold)",
                            color: "var(--color-text-primary)",
                            lineHeight: "var(--line-height-tight)",
                            marginBottom: "var(--spacing-4)",
                        }}
                    >
                        <GreetingIcon
                            size={28}
                            weight="duotone"
                            className="text-primary"
                        />
                        {greeting.text}
                    </h1>
                    <p
                        style={{
                            fontSize: "var(--font-size-body-m)",
                            color: "var(--color-text-secondary)",
                        }}
                    >
                        {todayCount > 0
                            ? t("{{count}} evenement(s) prevu(s) aujourd'hui", {
                                  count: todayCount,
                              })
                            : t("Tout est a jour")}
                    </p>
                </div>

                {/* Decorative circle */}
                <div
                    style={{
                        position: "absolute",
                        top: "-64px",
                        right: "-32px",
                        width: "200px",
                        height: "200px",
                        borderRadius: "var(--radius-full)",
                        background: "var(--color-primary-50)",
                        opacity: 0.4,
                    }}
                />
            </section>

            {/* AI Insights (max 4 aggregated cards) */}
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
                    {t("Actions rapides")}
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

            {/* Mobile: Upcoming Events */}
            <UpcomingEventsList events={events} isLoading={isLoading} />

            {/* Two Column Layout (desktop only) */}
            <div
                className="hidden lg:grid grid-cols-1 lg:grid-cols-3"
                style={{ gap: "var(--spacing-24)" }}
            >
                {/* Pets Summary (limited to MAX_PETS_DISPLAYED) */}
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
                            {t("Mes animaux")}{" "}
                            {pets.length > 0 && `(${pets.length})`}
                        </h2>
                        {pets.length > MAX_PETS_DISPLAYED && (
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
                                {t("Voir tout")}
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
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--spacing-12)",
                            }}
                        >
                            {displayedPets.map((pet) => (
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
                                            flexShrink: 0,
                                        }}
                                    >
                                        {pet.species === "dog" ? (
                                            <Dog
                                                size={24}
                                                weight="duotone"
                                                className="text-primary"
                                            />
                                        ) : pet.species === "cat" ? (
                                            <Cat
                                                size={24}
                                                weight="duotone"
                                                className="text-primary"
                                            />
                                        ) : (
                                            <PawPrint
                                                size={24}
                                                weight="duotone"
                                                className="text-primary"
                                            />
                                        )}
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
                                    <CaretRight
                                        size={16}
                                        className="text-gray-400"
                                    />
                                </button>
                            ))}
                            {pets.length > MAX_PETS_DISPLAYED && (
                                <button
                                    type="button"
                                    onClick={() => navigate("/content/pets")}
                                    className="text-center py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                >
                                    {t("Voir les {{count}} animaux", {
                                        count: pets.length,
                                    })}
                                </button>
                            )}
                        </div>
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
                        {t("Evenements recents")}
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
        </div>
    );
};

interface QuickActionCardProps {
    icon: Icon;
    label: string;
    description: string;
    variant: keyof typeof VARIANT_STYLES;
    onClick: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
    icon: IconComponent,
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
            <IconComponent
                size={28}
                weight="duotone"
                className="group-hover:scale-110 transition-transform text-gray-700"
                style={{ marginBottom: "var(--spacing-4)" }}
            />
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

const UpcomingEventsList: React.FC<{ events: EventFormData[]; isLoading: boolean }> = ({ events, isLoading }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const now = new Date();

    const upcomingEvents = useMemo(() => {
        return events
            .filter((e) => new Date(e.start_date) >= now && !e.is_done)
            .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
            .slice(0, 3);
    }, [events]);

    return (
        <section className="lg:hidden">
            <h2
                style={{
                    fontSize: "var(--font-size-body-l)",
                    fontWeight: "var(--font-weight-semibold)",
                    color: "var(--color-text-primary)",
                    marginBottom: "var(--spacing-16)",
                }}
            >
                {t("Prochains evenements")}
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
                    <div style={{ padding: "var(--spacing-16)", display: "flex", flexDirection: "column", gap: "var(--spacing-12)" }}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse" style={{ height: "56px", background: "var(--color-lin-2)", borderRadius: "var(--radius-md)" }} />
                        ))}
                    </div>
                ) : upcomingEvents.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <CalendarBlank size={40} weight="duotone" className="mx-auto mb-3" />
                        <p className="text-sm">{t("Aucun evenement a venir")}</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {upcomingEvents.map((event, index) => (
                            <div
                                key={event.id || index}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                                onClick={() => navigate("/calendar")}
                            >
                                <div className="w-8 flex-shrink-0 flex items-center justify-center">
                                    <CalendarBlank size={20} weight="duotone" className="text-gray-500 dark:text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {event.title}
                                    </p>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(event.start_date).toLocaleDateString("fr-FR", { weekday: "short", month: "short", day: "numeric" })}
                                    </span>
                                </div>
                                <CaretRight size={16} className="text-gray-400 flex-shrink-0" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Index;
