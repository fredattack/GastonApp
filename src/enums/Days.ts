// Export the class
export class DaysOfWeek {
    static readonly Monday = 'monday';
    static readonly Tuesday = 'tuesday';
    static readonly Wednesday = 'wednesday';
    static readonly Thursday = 'thursday';
    static readonly Friday = 'friday';
    static readonly Saturday = 'saturday';
    static readonly Sunday = 'sunday';

    static values(): string[] {
        return [
            DaysOfWeek.Monday,
            DaysOfWeek.Tuesday,
            DaysOfWeek.Wednesday,
            DaysOfWeek.Thursday,
            DaysOfWeek.Friday,
            DaysOfWeek.Saturday,
            DaysOfWeek.Sunday,
        ];
    }

    static asOptionArray(): {
        label: string;
        value: string
    }[] {
        return DaysOfWeek.values().map(value => ({
            label: value.charAt(0).toUpperCase() + value.slice(1),
            value,
        }));
    }
}
