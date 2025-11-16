import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLightbulb,
    faUtensils,
    faHeartbeat,
    faPaw,
    faCheckCircle,
    faExternalLinkAlt,
    faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';

interface AdviceCardProps {
    adviceData: AdviceData;
}

const AdviceCard: React.FC<AdviceCardProps> = ({ adviceData }) => {
    const {
        adviceType,
        question,
        answer,
        sources,
        relatedTopics,
        confidence,
        // Nutrition fields
        dailyCalories,
        feedingFrequency,
        toxicFoods,
        // Health fields
        severity,
        redFlags,
        nextSteps,
    } = adviceData;

    const getIcon = () => {
        switch (adviceType) {
            case 'nutrition':
                return faUtensils;
            case 'health':
                return faHeartbeat;
            case 'behavior':
                return faPaw;
            default:
                return faLightbulb;
        }
    };

    const getTypeColor = () => {
        switch (adviceType) {
            case 'nutrition':
                return 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20';
            case 'health':
                return 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20';
            case 'behavior':
                return 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20';
            default:
                return 'from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20';
        }
    };

    const getIconColor = () => {
        switch (adviceType) {
            case 'nutrition':
                return 'text-green-600 dark:text-green-400';
            case 'health':
                return 'text-red-600 dark:text-red-400';
            case 'behavior':
                return 'text-blue-600 dark:text-blue-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };

    const getSeverityColor = () => {
        switch (severity) {
            case 'high':
                return 'text-red-600 dark:text-red-400';
            case 'medium':
                return 'text-yellow-600 dark:text-yellow-400';
            case 'low':
                return 'text-green-600 dark:text-green-400';
            default:
                return 'text-blue-600 dark:text-blue-400';
        }
    };

    const getConfidenceColor = () => {
        if (confidence >= 80) return 'text-green-600 dark:text-green-400';
        if (confidence >= 60) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-orange-600 dark:text-orange-400';
    };

    return (
        <div
            className={`bg-gradient-to-br ${getTypeColor()} rounded-xl p-4 mt-3`}
        >
            <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0">
                    <FontAwesomeIcon
                        icon={getIcon()}
                        className={`${severity ? getSeverityColor() : getIconColor()} text-xl`}
                    />
                </div>
                <div className="flex-1">
                    {question && (
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                            {question}
                        </h4>
                    )}
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {answer}
                    </p>
                </div>
                {confidence !== undefined && (
                    <div
                        className={`flex-shrink-0 flex items-center gap-1 ${getConfidenceColor()}`}
                    >
                        <FontAwesomeIcon icon={faCheckCircle} size="xs" />
                        <span className="text-xs font-medium whitespace-nowrap">
                            {Math.round(confidence)}%
                        </span>
                    </div>
                )}
            </div>

            {/* Nutrition-specific fields */}
            {adviceType === 'nutrition' && (
                <>
                    {(dailyCalories || feedingFrequency) && (
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            {dailyCalories && (
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        Calories quotidiennes
                                    </p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                        {dailyCalories} kcal
                                    </p>
                                </div>
                            )}
                            {feedingFrequency && (
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        Fréquence
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {feedingFrequency}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {toxicFoods && toxicFoods.length > 0 && (
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mb-3 border border-red-200 dark:border-red-800">
                            <p className="text-xs font-semibold text-red-800 dark:text-red-200 mb-2">
                                ⚠️ Aliments toxiques à éviter :
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {toxicFoods.map((food, index) => (
                                    <span
                                        key={index}
                                        className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded"
                                    >
                                        {food}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Health-specific fields */}
            {redFlags && redFlags.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mb-3 border border-yellow-200 dark:border-yellow-800">
                    <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                        🚩 Signes d'alerte :
                    </p>
                    <ul className="text-xs text-yellow-900 dark:text-yellow-100 space-y-1">
                        {redFlags.map((flag, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-yellow-600 rounded-full flex-shrink-0"></span>
                                <span>{flag}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {nextSteps && nextSteps.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-3 border border-blue-200 dark:border-blue-800">
                    <p className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        📋 Prochaines étapes :
                    </p>
                    <ol className="text-xs text-blue-900 dark:text-blue-100 space-y-1 list-decimal list-inside">
                        {nextSteps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
            )}

            {/* Sources */}
            {sources && sources.length > 0 && (
                <div className="mb-3">
                    <h5 className="font-semibold text-gray-900 dark:text-white text-xs mb-2">
                        Sources
                    </h5>
                    <div className="space-y-1">
                        {sources.map((source, index) => (
                            <a
                                key={index}
                                href={source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                            >
                                <FontAwesomeIcon
                                    icon={faExternalLinkAlt}
                                    size="xs"
                                />
                                <span className="truncate">{source}</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Related Topics */}
            {relatedTopics && relatedTopics.length > 0 && (
                <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white text-xs mb-2">
                        Sujets connexes
                    </h5>
                    <div className="flex flex-wrap gap-2">
                        {relatedTopics.map((topic, index) => (
                            <span
                                key={index}
                                className="text-xs bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-600"
                            >
                                {topic}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdviceCard;
