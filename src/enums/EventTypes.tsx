// Export the class
export class EventTypes {
    static readonly Medical = 'medical';
    static readonly Feeding = 'feeding';
    static readonly Appointment = 'appointment';
    static readonly Other = 'other';

    static values(): string[] {
        return [EventTypes.Medical, EventTypes.Feeding, EventTypes.Appointment, EventTypes.Other];
    }

    static asOptionArray(): {
        label: string;
        value: string
    }[] {
        return EventTypes.values().map(value => ({
            label: value.charAt(0).toUpperCase() + value.slice(1),
            value
        }));
    }
}
