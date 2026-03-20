import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUtensils,
    faKitMedical,
    faCalendar,
    faDumbbell,
    faPaw,
    faPlus,
    faEdit,
    faTrash,
    faQuestion,
} from "@fortawesome/free-solid-svg-icons";

interface IntentHeaderProps {
    requestType: string;
    eventType?: string;
    description: string;
    score?: number;
}

const IntentHeader: React.FC<IntentHeaderProps> = ({
    requestType,
    eventType,
    description,
    score,
}) => {
    const getIntentConfig = () => {
        switch (requestType) {
            case "createEvent":
                return {
                    action: "CRÉER",
                    bgColor: "bg-gray-50 dark:bg-gray-800/50",
                    borderColor: "border-gray-200 dark:border-gray-700",
                    iconBg: "bg-white dark:bg-gray-800",
                    iconColor: "text-success dark:text-success",
                    badgeBg: "bg-gray-100 dark:bg-gray-700/50",
                    badgeText: "text-gray-700 dark:text-gray-300",
                };
            case "updateEvent":
                return {
                    action: "MODIFIER",
                    bgColor: "bg-gray-50 dark:bg-gray-800/50",
                    borderColor: "border-gray-200 dark:border-gray-700",
                    iconBg: "bg-white dark:bg-gray-800",
                    iconColor: "text-warning dark:text-warning",
                    badgeBg: "bg-gray-100 dark:bg-gray-700/50",
                    badgeText: "text-gray-700 dark:text-gray-300",
                };
            case "deleteEvent":
                return {
                    action: "SUPPRIMER",
                    bgColor: "bg-gray-50 dark:bg-gray-800/50",
                    borderColor: "border-gray-200 dark:border-gray-700",
                    iconBg: "bg-white dark:bg-gray-800",
                    iconColor: "text-danger dark:text-danger",
                    badgeBg: "bg-gray-100 dark:bg-gray-700/50",
                    badgeText: "text-gray-700 dark:text-gray-300",
                };
            case "query":
            default:
                return {
                    action: "INFORMATION",
                    bgColor: "bg-gray-50 dark:bg-gray-800/50",
                    borderColor: "border-gray-200 dark:border-gray-700",
                    iconBg: "bg-white dark:bg-gray-800",
                    iconColor: "text-primary dark:text-primary",
                    badgeBg: "bg-gray-100 dark:bg-gray-700/50",
                    badgeText: "text-gray-700 dark:text-gray-300",
                };
        }
    };

    const getEventTypeConfig = () => {
        if (!eventType) return null;

        switch (eventType) {
            case "feeding":
                return {
                    icon: faUtensils,
                    label: "REPAS",
                    iconColor: "text-gray-600 dark:text-gray-400",
                };
            case "medical":
                return {
                    icon: faKitMedical,
                    label: "TRAITEMENT",
                    iconColor: "text-gray-600 dark:text-gray-400",
                };
            case "appointment":
                return {
                    icon: faCalendar,
                    label: "RENDEZ-VOUS",
                    iconColor: "text-gray-600 dark:text-gray-400",
                };
            case "training":
                return {
                    icon: faDumbbell,
                    label: "ENTRAÎNEMENT",
                    iconColor: "text-gray-600 dark:text-gray-400",
                };
            case "social":
                return {
                    icon: faPaw,
                    label: "SOCIAL",
                    iconColor: "text-gray-600 dark:text-gray-400",
                };
            default:
                return {
                    icon: faCalendar,
                    label: "ÉVÉNEMENT",
                    iconColor: "text-gray-600 dark:text-gray-400",
                };
        }
    };

    const getActionIcon = () => {
        switch (requestType) {
            case "createEvent":
                return faPlus;
            case "updateEvent":
                return faEdit;
            case "deleteEvent":
                return faTrash;
            default:
                return faQuestion;
        }
    };

    const intentConfig = getIntentConfig();
    const eventConfig = getEventTypeConfig();

    return (
        <div
            className={`${intentConfig.bgColor} border ${intentConfig.borderColor} rounded-lg px-3 py-3 md:px-4 md:py-4 mb-3 md:mb-4`}
        >
            <div className="flex items-start justify-between gap-2 md:gap-3">
                <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                    {/* Action Icon */}
                    <div
                        className={`p-2 md:p-2.5 rounded-lg ${intentConfig.iconBg} border border-gray-200 dark:border-gray-700 flex-shrink-0`}
                    >
                        <FontAwesomeIcon
                            icon={getActionIcon()}
                            className={`text-lg md:text-xl ${intentConfig.iconColor}`}
                        />
                    </div>

                    {/* Title and Description */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                            {eventConfig && (
                                <FontAwesomeIcon
                                    icon={eventConfig.icon}
                                    className={`text-sm md:text-base ${eventConfig.iconColor} flex-shrink-0`}
                                />
                            )}
                            <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white truncate">
                                {intentConfig.action}{" "}
                                {eventConfig ? `UN ${eventConfig.label}` : ""}
                            </h3>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Score Badge */}
                {score !== undefined && (
                    <div
                        className={`${intentConfig.badgeBg} ${intentConfig.badgeText} px-2 py-1 md:px-3 md:py-1.5 rounded-md text-xs font-medium whitespace-nowrap flex-shrink-0`}
                    >
                        {score}%
                    </div>
                )}
            </div>
        </div>
    );
};

export default IntentHeader;
