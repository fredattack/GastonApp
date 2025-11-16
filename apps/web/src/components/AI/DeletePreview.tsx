import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrash,
    faExclamationTriangle,
    faCalendar,
    faPaw,
} from '@fortawesome/free-solid-svg-icons';
import ConfirmationDialog from './ConfirmationDialog';

interface DeletePreviewProps {
    deleteData: DeleteData;
    requestType: 'deleteEvent' | 'deletePet';
    onDelete: () => void;
    isLoading?: boolean;
}

const DeletePreview: React.FC<DeletePreviewProps> = ({
    deleteData,
    requestType,
    onDelete,
    isLoading = false,
}) => {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const { filters, confirmationRequired, itemsToDelete, estimatedCount } =
        deleteData;

    const getIcon = () => {
        return requestType === 'deleteEvent' ? faCalendar : faPaw;
    };

    const getTitle = () => {
        return requestType === 'deleteEvent'
            ? 'Suppression d\'événements'
            : 'Suppression d\'animaux';
    };

    const renderFilters = () => {
        const filterItems: string[] = [];

        if (filters.petIds && filters.petIds.length > 0) {
            filterItems.push(
                `Animal(x): ${filters.petIds.length} sélectionné(s)`,
            );
        }

        if (filters.type) {
            filterItems.push(`Type: ${filters.type}`);
        }

        if (filters.startDate || filters.endDate) {
            const dateRange = [
                filters.startDate || '...',
                filters.endDate || '...',
            ].join(' au ');
            filterItems.push(`Période: ${dateRange}`);
        }

        if (filters.eventId) {
            filterItems.push(`ID: ${filters.eventId}`);
        }

        return filterItems;
    };

    const handleConfirm = () => {
        setShowConfirmation(false);
        onDelete();
    };

    const handleCancel = () => {
        setShowConfirmation(false);
    };

    const formatItemsForDialog = (): string[] => {
        if (itemsToDelete && itemsToDelete.length > 0) {
            return itemsToDelete.map((item) => {
                const parts = [item.title];
                if (item.type) parts.push(`[${item.type}]`);
                if (item.date) {
                    parts.push(
                        `- ${new Date(item.date).toLocaleDateString('fr-FR')}`,
                    );
                }
                return parts.join(' ');
            });
        }
        return [];
    };

    return (
        <>
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-4 mt-3">
                <div className="flex items-center gap-2 mb-3">
                    <FontAwesomeIcon
                        icon={getIcon()}
                        className="text-red-600 dark:text-red-400"
                    />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                        {getTitle()}
                    </h4>
                    {estimatedCount !== undefined && (
                        <span className="ml-auto text-xs bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 px-2 py-1 rounded-full">
                            {estimatedCount} élément
                            {estimatedCount > 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {/* Warning */}
                {confirmationRequired && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-3">
                        <div className="flex items-start gap-2">
                            <FontAwesomeIcon
                                icon={faExclamationTriangle}
                                className="text-yellow-600 dark:text-yellow-400 mt-0.5"
                            />
                            <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                <strong>Attention:</strong> Cette action est
                                irréversible. Veuillez confirmer avant de
                                continuer.
                            </p>
                        </div>
                    </div>
                )}

                {/* Filters */}
                {renderFilters().length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Critères de sélection:
                        </p>
                        <ul className="space-y-1">
                            {renderFilters().map((filter, index) => (
                                <li
                                    key={index}
                                    className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2"
                                >
                                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                    {filter}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Items to Delete */}
                {itemsToDelete && itemsToDelete.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Éléments à supprimer:
                        </p>
                        <ul className="space-y-1 max-h-32 overflow-y-auto">
                            {itemsToDelete.map((item, index) => (
                                <li
                                    key={index}
                                    className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2"
                                >
                                    <span className="w-1 h-1 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                    <div>
                                        <span className="font-medium">
                                            {item.title}
                                        </span>
                                        {item.type && (
                                            <span className="text-gray-500 ml-1">
                                                [{item.type}]
                                            </span>
                                        )}
                                        {item.date && (
                                            <span className="text-gray-500 ml-1">
                                                -{' '}
                                                {new Date(
                                                    item.date,
                                                ).toLocaleDateString('fr-FR')}
                                            </span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowConfirmation(true)}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <FontAwesomeIcon icon={faTrash} size="sm" />
                        {isLoading ? 'Suppression...' : 'Supprimer'}
                    </button>
                </div>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmation && (
                <ConfirmationDialog
                    title={getTitle()}
                    message={`Êtes-vous sûr de vouloir supprimer ${estimatedCount || itemsToDelete?.length || 'ces'} élément(s) ? Cette action ne peut pas être annulée.`}
                    itemsToDelete={formatItemsForDialog()}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                />
            )}
        </>
    );
};

export default DeletePreview;
