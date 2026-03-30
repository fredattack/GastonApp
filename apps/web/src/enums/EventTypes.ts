// Export the class
export class EventTypes {
    static readonly Medical = "medical";

    static readonly Feeding = "feeding";

    static readonly Appointment = "appointment";

    static readonly Other = "other";

    static values(): string[] {
        return [
            EventTypes.Medical,
            EventTypes.Feeding,
            EventTypes.Appointment,
            EventTypes.Other,
        ];
    }

    static labels(): Record<string, string> {
        return {
            [EventTypes.Medical]: "Soins médicaux",
            [EventTypes.Feeding]: "Repas",
            [EventTypes.Appointment]: "Rendez-vous",
            [EventTypes.Other]: "Autre",
        };
    }

    static asOptionArray(): {
        label: string;
        value: string;
    }[] {
        const labels = EventTypes.labels();
        return EventTypes.values().map((value) => ({
            label: labels[value] ?? value,
            value,
        }));
    }
}
