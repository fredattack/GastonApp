// Export the class
export class Days {
    static readonly Monday = "monday";

    static readonly Tuesday = "tuesday";

    static readonly Wednesday = "wednesday";

    static readonly Thursday = "thursday";

    static readonly Friday = "friday";

    static readonly Saturday = "saturday";

    static readonly Sunday = "sunday";

    static values(): string[] {
        return [
            Days.Monday,
            Days.Tuesday,
            Days.Wednesday,
            Days.Thursday,
            Days.Friday,
            Days.Saturday,
            Days.Sunday,
        ];
    }

    static asOptionArray(): {
        label: string;
        value: string;
    }[] {
        return Days.values().map((value) => ({
            label: value.charAt(0).toUpperCase() + value.slice(1),
            value,
        }));
    }
}
