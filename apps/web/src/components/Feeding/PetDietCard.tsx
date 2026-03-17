import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { feedingService } from "../../services/FeedingService";

interface PetDietCardProps {
    petId: number;
    petName: string;
    petSpecies: string;
    onClose: () => void;
}

const SLOT_LABELS: Record<string, string> = {
    morning: "Matin",
    noon: "Midi",
    evening: "Soir",
};

const SLOT_EMOJIS: Record<string, string> = {
    morning: "🌅",
    noon: "☀️",
    evening: "🌙",
};

const PetDietCard: React.FC<PetDietCardProps> = ({ petId, petName, petSpecies, onClose }) => {
    const [schedules, setSchedules] = useState<PetScheduleInfo[]>([]);
    const [breed, setBreed] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        feedingService.getSchedules().then((data: any) => {
            if (!Array.isArray(data) || data.length === 0) {
                setIsLoading(false);
                return;
            }

            // Detect format: grouped (has .schedules) vs flat (has .meal_slot)
            const isGrouped = data[0]?.schedules !== undefined;

            if (isGrouped) {
                const petGroup = data.find((g: any) => Number(g.pet_id) === Number(petId));
                if (petGroup?.schedules) {
                    setSchedules(petGroup.schedules);
                    setBreed(petGroup.pet_breed || "");
                }
            } else {
                // Flat format: filter by pet_id
                const petSchedules = data
                    .filter((s: any) => Number(s.pet_id) === Number(petId) && s.is_active !== false)
                    .map((s: any) => ({
                        id: s.id,
                        meal_slot: s.meal_slot,
                        food_type: s.food_type,
                        quantity: s.quantity,
                        unit: s.unit,
                        notes: s.notes,
                    }));
                setSchedules(petSchedules);
                if (data[0]?.pet?.breed) {
                    const match = data.find((s: any) => Number(s.pet_id) === Number(petId));
                    setBreed(match?.pet?.breed || "");
                }
            }

            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        });
    }, [petId]);

    const speciesEmoji = petSpecies === "dog" ? "🐕" : "🐱";

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 z-50"
                onClick={onClose}
            />

            {/* Card */}
            <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{speciesEmoji}</span>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{petName}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {breed || (petSpecies === "dog" ? "Chien" : "Chat")}{!isLoading && ` · ${schedules.length} repas/jour`}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Fermer"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                    {isLoading ? (
                        <div className="space-y-3 animate-pulse">
                            {[1, 2].map((i) => (
                                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-xl" />
                            ))}
                        </div>
                    ) : schedules.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                            Aucun regime configure
                        </p>
                    ) : (
                        schedules.map((schedule) => (
                            <div
                                key={schedule.id}
                                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                            >
                                <span className="text-2xl" aria-hidden="true">
                                    {SLOT_EMOJIS[schedule.meal_slot] || "🍽️"}
                                </span>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {SLOT_LABELS[schedule.meal_slot] || schedule.meal_slot}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {schedule.food_type} · {schedule.quantity}{schedule.unit}
                                    </p>
                                    {schedule.notes && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            {schedule.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default PetDietCard;
