import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLightbulb,
    faUtensils,
    faHeartbeat,
    faPaw,
    faCheckCircle,
    faExternalLinkAlt,
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

    const getConfidenceColor = () => {
        if (confidence >= 0.8) return 'text-green-600 dark:text-green-400';
        if (confidence >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
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
                        className={`${getIconColor()} text-xl`}
                    />
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Question
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                        {question}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3">
                <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
                        Réponse
                    </h5>
                    {confidence && (
                        <div
                            className={`flex items-center gap-1 ${getConfidenceColor()}`}
                        >
                            <FontAwesomeIcon icon={faCheckCircle} size="xs" />
                            <span className="text-xs font-medium">
                                {Math.round(confidence * 100)}% confiance
                            </span>
                        </div>
                    )}
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                    {answer}
                </p>
            </div>

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
                                {source}
                            </a>
                        ))}
                    </div>
                </div>
            )}

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
