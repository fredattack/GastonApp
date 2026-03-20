import React, { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faUndo } from "@fortawesome/free-solid-svg-icons";

interface FeedingPetRowProps {
    item: FeedingItem;
    onToggle: (scheduleId: number, isDone: boolean) => void;
    onPetTap?: (petId: number, petName: string, petSpecies: string) => void;
}

const FeedingPetRow: React.FC<FeedingPetRowProps> = ({ item, onToggle, onPetTap }) => {
    const handleToggle = useCallback(() => {
        onToggle(item.schedule_id, item.is_done);
    }, [item.schedule_id, item.is_done, onToggle]);

    const speciesEmoji = item.pet_species === "dog" ? "🐕" : "🐱";

    return (
        <div
            className={`
                flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                ${item.is_done
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }
            `}
        >
            <button
                onClick={handleToggle}
                className={`
                    flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center
                    transition-all duration-200 active:scale-95
                    ${item.is_done
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "border-2 border-gray-300 dark:border-gray-600 text-gray-400 hover:border-primary hover:text-primary"
                    }
                `}
                aria-label={item.is_done ? `Annuler ${item.pet_name}` : `Marquer ${item.pet_name} comme nourri`}
            >
                <FontAwesomeIcon icon={item.is_done ? faUndo : faCheck} className="text-sm" />
            </button>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span aria-hidden="true">{speciesEmoji}</span>
                    <button
                        onClick={() => onPetTap?.(item.pet_id, item.pet_name, item.pet_species)}
                        className={`font-semibold text-left hover:underline ${
                            item.is_done
                                ? "text-green-700 dark:text-green-400 line-through"
                                : "text-gray-900 dark:text-white"
                        }`}
                    >
                        {item.pet_name}
                    </button>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {item.food_type} · {item.quantity}{item.unit}
                    {item.notes && (
                        <span className="ml-1 text-gray-400">· {item.notes}</span>
                    )}
                </div>
            </div>

            <div className="flex-shrink-0 text-right">
                {item.is_done && item.fed_at && (
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        {item.fed_at}
                    </span>
                )}
            </div>
        </div>
    );
};

export default React.memo(FeedingPetRow);