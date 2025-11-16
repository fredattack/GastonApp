import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';

interface ConfirmationDialogProps {
    title: string;
    message: string;
    itemsToDelete?: string[];
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    title,
    message,
    itemsToDelete,
    onConfirm,
    onCancel,
    isLoading = false,
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full shadow-xl animate-fadeIn">
                {/* Header */}
                <div className="flex items-start justify-between p-6 pb-4">
                    <div className="flex items-start gap-3 flex-1">
                        <FontAwesomeIcon
                            icon={faExclamationTriangle}
                            className="text-yellow-500 mt-1 flex-shrink-0"
                            size="lg"
                        />
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {message}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
                    >
                        <FontAwesomeIcon
                            icon={faTimes}
                            className="text-gray-500 dark:text-gray-400"
                        />
                    </button>
                </div>

                {/* Items List */}
                {itemsToDelete && itemsToDelete.length > 0 && (
                    <div className="px-6 pb-4">
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Éléments concernés ({itemsToDelete.length}):
                            </p>
                            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 max-h-32 overflow-y-auto">
                                {itemsToDelete.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-2"
                                    >
                                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full flex-shrink-0 mt-1"></span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Suppression...
                            </>
                        ) : (
                            'Confirmer la suppression'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
