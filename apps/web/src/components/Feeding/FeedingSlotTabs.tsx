import React from "react";

interface FeedingSlotTabsProps {
    activeSlot: MealSlot;
    onSlotChange: (slot: MealSlot) => void;
    slotCounts: Record<MealSlot, { total: number; done: number }>;
}

const SLOT_CONFIG: { key: MealSlot; label: string; emoji: string }[] = [
    { key: "morning", label: "Matin", emoji: "🌅" },
    { key: "noon", label: "Midi", emoji: "☀️" },
    { key: "evening", label: "Soir", emoji: "🌙" },
];

const FeedingSlotTabs: React.FC<FeedingSlotTabsProps> = ({
    activeSlot,
    onSlotChange,
    slotCounts,
}) => {
    return (
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl" data-testid="feeding-slot-tabs">
            {SLOT_CONFIG.map(({ key, label, emoji }) => {
                const isActive = activeSlot === key;
                const counts = slotCounts[key];
                const allDone =
                    counts.total > 0 && counts.done === counts.total;
                const hasPending =
                    counts.total > 0 && counts.done < counts.total;

                return (
                    <button
                        key={key}
                        data-testid={`feeding-slot-${key}`}
                        onClick={() => onSlotChange(key)}
                        className={`
                            flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg
                            min-h-[44px] transition-all duration-200 font-medium text-sm
                            ${
                                isActive
                                    ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            }
                        `}
                        aria-label={`${label} - ${counts.done}/${counts.total}`}
                        aria-pressed={isActive}
                    >
                        <span aria-hidden="true">{emoji}</span>
                        <span>{label}</span>
                        {counts.total > 0 && (
                            <span
                                className={`
                                    text-xs px-1.5 py-0.5 rounded-full font-semibold
                                    ${
                                        allDone
                                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                            : hasPending
                                              ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                                              : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                                    }
                                `}
                            >
                                {counts.done}/{counts.total}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default FeedingSlotTabs;
