import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendar,
    faPaw,
    faChartLine,
    faHistory,
} from '@fortawesome/free-solid-svg-icons';

interface QueryResultsProps {
    queryResult: QueryResult;
}

const QueryResults: React.FC<QueryResultsProps> = ({ queryResult }) => {
    const { queryType, results, totalCount, summary } = queryResult;

    const getIcon = () => {
        switch (queryType) {
            case 'events':
                return faCalendar;
            case 'pets':
                return faPaw;
            case 'statistics':
                return faChartLine;
            case 'history':
                return faHistory;
            default:
                return faCalendar;
        }
    };

    const renderEvents = () => {
        if (!Array.isArray(results) || results.length === 0) {
            return (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                    Aucun résultat trouvé
                </p>
            );
        }

        return (
            <div className="space-y-2">
                {results.map((event: Event, index: number) => (
                    <div
                        key={event.id || index}
                        className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h5 className="font-semibold text-sm text-gray-900 dark:text-white">
                                    {event.title}
                                </h5>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {new Date(
                                        event.start_date,
                                    ).toLocaleDateString('fr-FR', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                                {event.pets && event.pets.length > 0 && (
                                    <div className="flex gap-1 mt-2 flex-wrap">
                                        {event.pets.map((pet: Pet) => (
                                            <span
                                                key={pet.id}
                                                className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full"
                                            >
                                                {pet.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span
                                className={`
                                text-xs px-2 py-1 rounded-full whitespace-nowrap
                                ${event.type === 'medical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
                                ${event.type === 'feeding' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                                ${event.type === 'appointment' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                                ${event.type === 'training' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : ''}
                                ${event.type === 'social' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' : ''}
                            `}
                            >
                                {event.type}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderPets = () => {
        if (!Array.isArray(results) || results.length === 0) {
            return (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                    Aucun résultat trouvé
                </p>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((pet: Pet) => (
                    <div
                        key={pet.id}
                        className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-3">
                            {pet.photo && (
                                <img
                                    src={pet.photo}
                                    alt={pet.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            )}
                            <div className="flex-1">
                                <h5 className="font-semibold text-sm text-gray-900 dark:text-white">
                                    {pet.name}
                                </h5>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {pet.species} - {pet.breed}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderStatistics = () => {
        if (typeof results !== 'object' || Array.isArray(results)) {
            return null;
        }

        const stats = results as Record<string, any>;

        return (
            <div className="grid grid-cols-2 gap-3">
                {Object.entries(stats).map(([key, value]) => (
                    <div
                        key={key}
                        className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {key
                                .replace(/([A-Z])/g, ' $1')
                                .trim()
                                .replace(/^./, (str) => str.toUpperCase())}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {typeof value === 'object'
                                ? JSON.stringify(value)
                                : value}
                        </p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 mt-3">
            <div className="flex items-center gap-2 mb-3">
                <FontAwesomeIcon
                    icon={getIcon()}
                    className="text-purple-600 dark:text-purple-400"
                />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                    Résultats de recherche
                </h4>
                <span className="ml-auto text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
                    {totalCount} résultat{totalCount > 1 ? 's' : ''}
                </span>
            </div>

            {summary && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 italic">
                    {summary}
                </p>
            )}

            {queryType === 'events' && renderEvents()}
            {queryType === 'pets' && renderPets()}
            {queryType === 'statistics' && renderStatistics()}
            {queryType === 'history' && renderEvents()}
        </div>
    );
};

export default QueryResults;
