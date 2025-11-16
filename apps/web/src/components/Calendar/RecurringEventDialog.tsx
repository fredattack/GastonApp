import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRepeat, faCalendar, faCalendarDay } from '@fortawesome/free-solid-svg-icons';

interface RecurringEventDialogProps {
    isOpen: boolean;
    eventTitle: string;
    onSelectOption: (option: 'this' | 'all') => void;
    onCancel: () => void;
    action?: 'edit' | 'delete';
}

const RecurringEventDialog: React.FC<RecurringEventDialogProps> = ({
    isOpen,
    eventTitle,
    onSelectOption,
    onCancel,
    action = 'edit',
}) => {
    if (!isOpen) return null;

    const actionText = action === 'delete' ? 'supprimer' : 'modifier';
    const actionTextCapitalized = action === 'delete' ? 'Supprimer' : 'Modifier';

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <FontAwesomeIcon icon={faRepeat} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Événement récurrent
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {eventTitle}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                            Voulez-vous {actionText} seulement cet événement ou tous les événements de cette série récurrente ?
                        </p>

                        {/* Options */}
                        <div className="space-y-3">
                            {/* This event only */}
                            <button
                                onClick={() => onSelectOption('this')}
                                className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group text-left"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <FontAwesomeIcon icon={faCalendarDay} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900 dark:text-white mb-1">
                                            Cet événement uniquement
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {actionTextCapitalized} seulement cette occurrence de l'événement
                                        </div>
                                    </div>
                                </div>
                            </button>

                            {/* All events */}
                            <button
                                onClick={() => onSelectOption('all')}
                                className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group text-left"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <FontAwesomeIcon icon={faCalendar} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900 dark:text-white mb-1">
                                            Tous les événements de la série
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {actionTextCapitalized} tous les événements futurs de cette série récurrente
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RecurringEventDialog;
