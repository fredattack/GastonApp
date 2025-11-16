import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faExclamationTriangle,
    faPhone,
    faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';

interface HealthDisclaimerProps {
    disclaimer: HealthDisclaimer;
    onAction: (action: string) => void;
}

const HealthDisclaimer: React.FC<HealthDisclaimerProps> = ({
    disclaimer,
    onAction,
}) => {
    const severityStyles = {
        info: 'bg-blue-50 border-blue-300 text-blue-900 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-100',
        warning:
            'bg-yellow-50 border-yellow-400 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-100',
        critical:
            'bg-red-50 border-red-400 text-red-900 dark:bg-red-900/20 dark:border-red-700 dark:text-red-100',
    };

    const iconStyles = {
        info: 'text-blue-500',
        warning: 'text-yellow-500',
        critical: 'text-red-500',
    };

    const actionIcons = {
        findVet: faMapMarkerAlt,
        callEmergency: faPhone,
        dismiss: faExclamationTriangle,
        learnMore: faExclamationTriangle,
    };

    return (
        <div
            className={`border-l-4 p-4 mb-4 rounded-r-lg ${severityStyles[disclaimer.severity]}`}
        >
            <div className="flex items-start gap-3">
                <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className={`mt-1 ${iconStyles[disclaimer.severity]}`}
                    size="lg"
                />
                <div className="flex-1">
                    <h4 className="font-bold text-sm mb-2">
                        {disclaimer.title}
                    </h4>
                    <p className="text-sm mb-3 leading-relaxed">
                        {disclaimer.message}
                    </p>

                    {disclaimer.autoMedicationWarning && (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg mb-3 border border-red-300 dark:border-red-700">
                            <p className="text-xs font-semibold text-red-700 dark:text-red-300">
                                {disclaimer.autoMedicationWarning}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        {disclaimer.actions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => onAction(action.action)}
                                className={`
                                    px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                                    flex items-center gap-1.5
                                    ${
                                        action.type === 'primary'
                                            ? 'bg-primary text-white hover:bg-primary-dark'
                                            : action.type === 'danger'
                                              ? 'bg-red-600 text-white hover:bg-red-700'
                                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                    }
                                `}
                            >
                                {actionIcons[action.action] && (
                                    <FontAwesomeIcon
                                        icon={actionIcons[action.action]}
                                        size="xs"
                                    />
                                )}
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthDisclaimer;
