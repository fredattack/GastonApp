import React from "react";
import FeedingPetRow from "./FeedingPetRow";
import BatchActionBar from "./BatchActionBar";

interface SpeciesGroup {
    species: string;
    label: string;
    items: FeedingItem[];
    total: number;
    done: number;
    pendingIds: number[];
}

interface FeedingSpeciesSectionProps {
    group: SpeciesGroup;
    onToggle: (scheduleId: number, isDone: boolean) => void;
    onBatchDone: (species: string) => void;
    onPetTap?: (petId: number, petName: string, petSpecies: string) => void;
}

const FeedingSpeciesSection: React.FC<FeedingSpeciesSectionProps> = ({
    group,
    onToggle,
    onBatchDone,
    onPetTap,
}) => {
    const allDone = group.total > 0 && group.done === group.total;
    const speciesEmoji = group.species === "dog" ? "🐕" : "🐱";

    return (
        <div className="space-y-2" data-testid={`feeding-species-${group.species}`}>
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <span aria-hidden="true">{speciesEmoji}</span>
                    {group.label} ({group.total})
                </h3>
                <span
                    className={`text-sm font-bold ${
                        allDone
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-500 dark:text-gray-400"
                    }`}
                >
                    {group.done}/{group.total}
                </span>
            </div>

            <div className="space-y-2">
                {group.items.map((item) => (
                    <FeedingPetRow
                        key={item.schedule_id}
                        item={item}
                        onToggle={onToggle}
                        onPetTap={onPetTap}
                    />
                ))}
            </div>

            {!allDone && group.pendingIds.length > 0 && (
                <BatchActionBar
                    label={`Tous les ${group.label.toLowerCase()} nourris`}
                    onBatch={() => onBatchDone(group.species)}
                    pendingCount={group.pendingIds.length}
                />
            )}
        </div>
    );
};

export default FeedingSpeciesSection;
