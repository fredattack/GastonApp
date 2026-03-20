import React, { useMemo, useState } from "react";

interface SmartFeedingSuggestionProps {
    activeSlot: MealSlot;
    totalItems: number;
    totalDone: number;
    speciesGroups: Array<{
        species: string;
        label: string;
        pendingIds: number[];
    }>;
    onAccept: () => void;
    onAcceptSpecies: (species: string) => void;
}

const SLOT_WINDOWS: Record<MealSlot, { start: number; end: number }> = {
    morning: { start: 7, end: 10 },
    noon: { start: 11, end: 14 },
    evening: { start: 17, end: 21 },
};

const SmartFeedingSuggestion: React.FC<SmartFeedingSuggestionProps> = ({
    activeSlot,
    totalItems,
    totalDone,
    speciesGroups,
    onAccept,
    onAcceptSpecies,
}) => {
    const [dismissed, setDismissed] = useState(false);

    const suggestion = useMemo(() => {
        if (dismissed || totalItems === 0 || totalDone === totalItems) {
            return null;
        }

        const hour = new Date().getHours();
        const window = SLOT_WINDOWS[activeSlot];

        if (hour < window.start || hour > window.end) {
            return null;
        }

        const pending = totalItems - totalDone;

        // If only one species group has pending items, suggest that species
        const pendingGroups = speciesGroups.filter((g) => g.pendingIds.length > 0);

        if (pendingGroups.length === 1) {
            const group = pendingGroups[0];
            return {
                message: `Marquer les ${group.pendingIds.length} ${group.label.toLowerCase()} comme nourris ?`,
                action: () => onAcceptSpecies(group.species),
            };
        }

        return {
            message: `${pending} repas en attente — tout marquer comme fait ?`,
            action: onAccept,
        };
    }, [dismissed, totalItems, totalDone, activeSlot, speciesGroups, onAccept, onAcceptSpecies]);

    if (!suggestion) {
        return null;
    }

    return (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl flex-shrink-0" aria-hidden="true">💡</span>
            <p className="flex-1 text-sm text-amber-800 dark:text-amber-300 font-medium">
                {suggestion.message}
            </p>
            <div className="flex gap-2 flex-shrink-0">
                <button
                    onClick={suggestion.action}
                    className="px-3 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 active:scale-95 transition-all min-h-[44px]"
                >
                    Oui
                </button>
                <button
                    onClick={() => setDismissed(true)}
                    className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all min-h-[44px]"
                >
                    Ignorer
                </button>
            </div>
        </div>
    );
};

export default SmartFeedingSuggestion;
