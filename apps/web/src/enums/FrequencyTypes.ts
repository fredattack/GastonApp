// Export the class
export class FrequencyTypes {
    static readonly Daily = "daily";

    static readonly Weekly = "weekly";

    static readonly Monthly = "monthly";

    static readonly Yearly = "yearly";

    static values(): string[] {
        return [
            FrequencyTypes.Daily,
            FrequencyTypes.Weekly,
            FrequencyTypes.Monthly,
            FrequencyTypes.Yearly,
        ];
    }

    static asOptionArray(): {
        label: string;
        value: string;
    }[] {
        return FrequencyTypes.values().map((value) => ({
            label: value.charAt(0).toUpperCase() + value.slice(1),
            value,
        }));
    }
}
