import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { getEventTypeLabel } from "../../../utils/aiTransformers";

interface SecondaryDetailsProps {
    event: EventFormData;
}

const SecondaryDetails: React.FC<SecondaryDetailsProps> = ({ event }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const hasSecondaryDetails =
        event.notes ||
        event.recurrence ||
        event.end_date ||
        Object.keys(event).length > 0;

    if (!hasSecondaryDetails) return null;

    return (
        <div className="mt-4">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {isExpanded ? "Masquer" : "Afficher"} les détails
                    supplémentaires
                </span>
                <FontAwesomeIcon
                    icon={isExpanded ? faChevronUp : faChevronDown}
                    className="text-gray-500 dark:text-gray-400"
                />
            </button>

            {isExpanded && (
                <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3 animate-fade-in">
                    {/* Type */}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                            Type :
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                            {getEventTypeLabel(event.type)}
                        </span>
                    </div>

                    {/* Title */}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                            Titre :
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                            {event.title}
                        </span>
                    </div>

                    {/* End Date */}
                    {event.end_date && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                                Date de fin :
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {new Date(event.end_date).toLocaleString(
                                    "fr-FR",
                                    {
                                        dateStyle: "short",
                                        timeStyle: "short",
                                    },
                                )}
                            </span>
                        </div>
                    )}

                    {/* Recurring */}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                            Récurrent :
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                            {event.is_recurring ? "Oui" : "Non"}
                        </span>
                    </div>

                    {/* Full Day */}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                            Journée complète :
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                            {event.is_full_day ? "Oui" : "Non"}
                        </span>
                    </div>

                    {/* Recurrence Details */}
                    {event.is_recurring && event.recurrence && (
                        <>
                            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Détails de récurrence :
                                </p>
                            </div>

                            {event.recurrence.frequency_type && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Type :
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {event.recurrence.frequency_type}
                                    </span>
                                </div>
                            )}

                            {event.recurrence.frequency && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Fréquence :
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {event.recurrence.frequency}
                                    </span>
                                </div>
                            )}

                            {event.recurrence.days &&
                                event.recurrence.days.length > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Jours :
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {event.recurrence.days.join(", ")}
                                        </span>
                                    </div>
                                )}

                            {event.recurrence.end_date && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Fin :
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {new Date(
                                            event.recurrence.end_date,
                                        ).toLocaleDateString("fr-FR")}
                                    </span>
                                </div>
                            )}
                        </>
                    )}

                    {/* Notes */}
                    {event.notes && (
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                📝 Notes :
                            </p>
                            <p className="text-sm text-gray-900 dark:text-white">
                                {event.notes}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SecondaryDetails;
