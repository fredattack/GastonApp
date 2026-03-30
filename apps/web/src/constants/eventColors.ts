export type EventType = "medical" | "feeding" | "appointment" | "other";

export interface EventTypeColors {
    bg: string;
    bgLight: string;
    text: string;
    border: string;
    dot: string;
    gradient: string;
}

const EVENT_COLORS: Record<EventType, EventTypeColors> = {
    medical: {
        bg: "bg-coral",
        bgLight: "bg-coral-light",
        text: "text-coral-dark",
        border: "border-coral",
        dot: "bg-coral",
        gradient: "from-coral-light to-coral",
    },
    feeding: {
        bg: "bg-mint",
        bgLight: "bg-mint-light",
        text: "text-mint-dark",
        border: "border-mint",
        dot: "bg-mint",
        gradient: "from-mint-light to-mint",
    },
    appointment: {
        bg: "bg-lavender",
        bgLight: "bg-lavender-light",
        text: "text-lavender-dark",
        border: "border-lavender",
        dot: "bg-lavender",
        gradient: "from-lavender-light to-lavender",
    },
    other: {
        bg: "bg-lin-6",
        bgLight: "bg-lin-3",
        text: "text-lin-9",
        border: "border-lin-6",
        dot: "bg-lin-6",
        gradient: "from-lin-3 to-lin-6",
    },
};

const EVENT_TYPE_LABELS: Record<EventType, string> = {
    medical: "Soins médicaux",
    feeding: "Repas",
    appointment: "Rendez-vous",
    other: "Autre",
};

export function getEventTypeColor(type: string): EventTypeColors {
    return EVENT_COLORS[(type as EventType)] ?? EVENT_COLORS.other;
}

export function getEventTypeLabel(type: string): string {
    return EVENT_TYPE_LABELS[(type as EventType)] ?? EVENT_TYPE_LABELS.other;
}

export const EVENT_TYPE_OPTIONS = (Object.keys(EVENT_COLORS) as EventType[]).map(
    (type) => ({
        value: type,
        label: EVENT_TYPE_LABELS[type],
    }),
);
