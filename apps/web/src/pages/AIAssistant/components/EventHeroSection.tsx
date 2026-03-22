import React from "react";
import { PawPrint } from "@phosphor-icons/react";
import { formatDateConversational } from "../../../utils/dateFormatters";

interface PetInfo {
    pet?: Pet;
    quantity?: string;
    item?: string;
    notes?: string;
}

interface EventHeroSectionProps {
    eventType: string;
    pets: PetInfo[];
    primaryData: {
        pets: Pet[];
        datetime: string | Date;
        isRecurring?: boolean;
        isFullDay?: boolean;
        item?: string;
        quantity?: string;
        medication?: string;
        dosage?: string;
        frequency?: string;
        location?: string;
        duration?: string;
        activity?: string;
        details?: string;
        notes?: string;
    };
}

const EventHeroSection: React.FC<EventHeroSectionProps> = ({
    eventType,
    pets,
    primaryData,
}) => {
    const getEmoji = (type: string): string => {
        const emojiMap: Record<string, string> = {
            feeding: "🥩",
            medical: "💊",
            appointment: "📍",
            training: "🏃",
            social: "🎮",
        };
        return emojiMap[type] || "📌";
    };

    const renderPetSection = () => {
        if (pets.length === 0) return null;

        return (
            <div className="mb-4 md:mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                {pets.map((petInfo, idx) => (
                    <div key={idx} className="flex items-center gap-2 md:gap-3">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                            <PawPrint
                                size={24}
                                className="text-primary"
                            />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Pour
                            </p>
                            <h4 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                                {petInfo.pet?.name || "Animal"}
                            </h4>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderFeedingDetails = () => (
        <>
            {primaryData.item && (
                <div className="flex items-start gap-2 md:gap-3 mb-3">
                    <span className="text-xl md:text-2xl flex-shrink-0">
                        {getEmoji(eventType)}
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Aliment
                        </p>
                        <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-white break-words">
                            {primaryData.item}
                        </p>
                    </div>
                </div>
            )}
            {primaryData.quantity && (
                <div className="flex items-start gap-2 md:gap-3 mb-3">
                    <span className="text-xl md:text-2xl flex-shrink-0">
                        📦
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Quantité
                        </p>
                        <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                            {primaryData.quantity}
                        </p>
                    </div>
                </div>
            )}
        </>
    );

    const renderMedicalDetails = () => (
        <>
            {primaryData.medication && (
                <div className="flex items-start gap-2 md:gap-3 mb-3">
                    <span className="text-xl md:text-2xl flex-shrink-0">
                        {getEmoji(eventType)}
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Médicament
                        </p>
                        <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-white break-words">
                            {primaryData.medication}
                        </p>
                    </div>
                </div>
            )}
            {primaryData.dosage && (
                <div className="flex items-start gap-2 md:gap-3 mb-3">
                    <span className="text-xl md:text-2xl flex-shrink-0">
                        💉
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Dosage
                        </p>
                        <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                            {primaryData.dosage}
                        </p>
                    </div>
                </div>
            )}
            {primaryData.frequency && (
                <div className="flex items-start gap-2 md:gap-3 mb-3">
                    <span className="text-xl md:text-2xl flex-shrink-0">
                        🔄
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Fréquence
                        </p>
                        <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                            {primaryData.frequency}
                        </p>
                    </div>
                </div>
            )}
        </>
    );

    const renderAppointmentDetails = () => (
        <>
            {primaryData.location && (
                <div className="flex items-start gap-2 md:gap-3 mb-3">
                    <span className="text-xl md:text-2xl flex-shrink-0">
                        {getEmoji(eventType)}
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Lieu
                        </p>
                        <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-white break-words">
                            {primaryData.location}
                        </p>
                    </div>
                </div>
            )}
            {primaryData.duration && (
                <div className="flex items-start gap-2 md:gap-3 mb-3">
                    <span className="text-xl md:text-2xl flex-shrink-0">
                        ⏱️
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Durée
                        </p>
                        <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                            {primaryData.duration}
                        </p>
                    </div>
                </div>
            )}
        </>
    );

    const renderTrainingDetails = () => (
        <>
            {primaryData.activity && (
                <div className="flex items-start gap-2 md:gap-3 mb-3">
                    <span className="text-xl md:text-2xl flex-shrink-0">
                        {getEmoji(eventType)}
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Activité
                        </p>
                        <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-white break-words">
                            {primaryData.activity}
                        </p>
                    </div>
                </div>
            )}
            {primaryData.duration && (
                <div className="flex items-start gap-2 md:gap-3 mb-3">
                    <span className="text-xl md:text-2xl flex-shrink-0">
                        ⏱️
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Durée
                        </p>
                        <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                            {primaryData.duration}
                        </p>
                    </div>
                </div>
            )}
        </>
    );

    const renderDetailsByType = () => {
        switch (eventType) {
            case "feeding":
                return renderFeedingDetails();
            case "medical":
                return renderMedicalDetails();
            case "appointment":
                return renderAppointmentDetails();
            case "training":
            case "social":
                return renderTrainingDetails();
            default:
                return (
                    primaryData.details && (
                        <div className="flex items-start gap-2 md:gap-3 mb-3">
                            <span className="text-xl md:text-2xl flex-shrink-0">
                                📌
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-white break-words">
                                    {primaryData.details}
                                </p>
                            </div>
                        </div>
                    )
                );
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700 mb-3 md:mb-4">
            {/* Pets Section */}
            {renderPetSection()}

            {/* Primary Details */}
            <div className="space-y-1">
                {renderDetailsByType()}

                {/* Date/Time - Always shown */}
                <div className="flex items-start gap-2 md:gap-3 mb-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xl md:text-2xl flex-shrink-0">
                        📅
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Quand
                        </p>
                        <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                            {formatDateConversational(primaryData.datetime)}
                        </p>
                    </div>
                </div>

                {/* Recurring/Full Day Badges */}
                {(primaryData.isRecurring || primaryData.isFullDay) && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {primaryData.isRecurring && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium">
                                🔄 Récurrent
                            </span>
                        )}
                        {primaryData.isFullDay && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium">
                                ⏰ Toute la journée
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventHeroSection;
