import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faEdit,
    faTimes,
    faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

interface ContextualActionsProps {
    requestType: string;
    onConfirm: () => void;
    onEdit: () => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

const ContextualActions: React.FC<ContextualActionsProps> = ({
    requestType,
    onConfirm,
    onEdit,
    onCancel,
    isLoading = false,
}) => {
    const getActions = () => {
        switch (requestType) {
            case "createEvent":
                return {
                    primary: {
                        label: "Créer cet événement",
                        icon: faCheck,
                        className: "bg-success hover:bg-success/90 text-white",
                    },
                    secondary: {
                        label: "Modifier d'abord",
                        icon: faEdit,
                        className:
                            "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600",
                    },
                };

            case "updateEvent":
                return {
                    primary: {
                        label: "Appliquer la modification",
                        icon: faCheck,
                        className: "bg-warning hover:bg-warning/90 text-white",
                    },
                    secondary: {
                        label: "Ajuster",
                        icon: faEdit,
                        className:
                            "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600",
                    },
                    tertiary: onCancel
                        ? {
                              label: "Annuler",
                              icon: faTimes,
                              className:
                                  "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600",
                          }
                        : undefined,
                };

            case "deleteEvent":
                return {
                    primary: {
                        label: "Confirmer la suppression",
                        icon: faExclamationTriangle,
                        className: "bg-danger hover:bg-danger/90 text-white",
                    },
                    secondary: {
                        label: "Annuler",
                        icon: faTimes,
                        className:
                            "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600",
                    },
                };

            default:
                return {
                    primary: {
                        label: "Confirmer",
                        icon: faCheck,
                        className: "bg-primary hover:bg-primary/90 text-white",
                    },
                    secondary: {
                        label: "Modifier",
                        icon: faEdit,
                        className:
                            "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600",
                    },
                };
        }
    };

    const actions = getActions();

    return (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {/* Primary Action */}
            <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 min-h-[44px] py-2.5 px-4 md:py-3 md:px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-semibold text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed ${actions.primary.className}`}
            >
                {isLoading ? (
                    <span className="animate-spin inline-block w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                    <>
                        <FontAwesomeIcon
                            icon={actions.primary.icon}
                            className="text-sm md:text-base"
                        />
                        <span className="truncate">
                            {actions.primary.label}
                        </span>
                    </>
                )}
            </button>

            {/* Secondary Action */}
            <button
                onClick={
                    requestType === "deleteEvent" && onCancel
                        ? onCancel
                        : onEdit
                }
                disabled={isLoading}
                className={`min-h-[44px] py-2.5 px-4 md:py-3 md:px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-medium text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed ${actions.secondary.className}`}
            >
                <FontAwesomeIcon
                    icon={actions.secondary.icon}
                    className="text-sm md:text-base"
                />
                <span className="truncate">{actions.secondary.label}</span>
            </button>

            {/* Tertiary Action (optional) */}
            {actions.tertiary && onCancel && (
                <button
                    onClick={onCancel}
                    disabled={isLoading}
                    className={`min-h-[44px] py-2.5 px-4 md:py-3 md:px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-medium text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed ${actions.tertiary.className}`}
                >
                    <FontAwesomeIcon
                        icon={actions.tertiary.icon}
                        className="text-sm md:text-base"
                    />
                    <span className="truncate">{actions.tertiary.label}</span>
                </button>
            )}
        </div>
    );
};

export default ContextualActions;
