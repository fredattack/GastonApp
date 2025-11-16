import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes,
    faEdit,
    faTrash,
    faClock,
    faNoteSticky,
    faRepeat,
    faCheckCircle,
    faCircle,
} from '@fortawesome/free-solid-svg-icons';
import EventForm from '../Event/Form/EventForm';
import RecurringEventDialog from './RecurringEventDialog';
import { eventService } from '../../services';
import { useToast } from '../../providers/ToastProvider';

interface EventQuickViewProps {
    event: Event | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
    initialDate?: Date;
}

const EventQuickView: React.FC<EventQuickViewProps> = ({
    event,
    isOpen,
    onClose,
    onUpdate,
    initialDate,
}) => {
    const { addToast } = useToast();
    const [mode, setMode] = useState<'view' | 'edit' | 'create'>('view');
    const [isDeleting, setIsDeleting] = useState(false);
    const [showRecurringDialog, setShowRecurringDialog] = useState(false);
    const [recurringAction, setRecurringAction] = useState<'edit' | 'delete'>('edit');

    // Initialize for new event creation
    const getInitialEvent = (): EventFormData => {
        if (event) {
            return {
                ...event,
                id: event.id ?? null,
                master_id: event.master_id ?? null,
                petId: event.petId ?? '',
                pets: event.pets ?? [],
                recurrence: event.recurrence ?? {
                    frequency_type: '',
                    frequency: 1,
                    days: [],
                    end_date: '',
                    occurrences: 1,
                },
            };
        }

        // New event with initialDate
        const startDate = initialDate || new Date();
        return {
            id: null,
            master_id: null,
            petId: '',
            type: '',
            title: '',
            start_date: startDate.toISOString(),
            end_date: '',
            is_recurring: false,
            is_full_day: false,
            is_done: false,
            recurrence: {
                frequency_type: '',
                frequency: 1,
                days: [],
                end_date: '',
                occurrences: 1,
            },
            notes: '',
            pets: [],
        };
    };

    const [eventData, setEventData] = useState<EventFormData>(getInitialEvent());

    React.useEffect(() => {
        if (isOpen) {
            if (event) {
                setMode('view');
                setEventData(getInitialEvent());
            } else {
                setMode('create');
                setEventData(getInitialEvent());
            }
        }
    }, [isOpen, event, initialDate]);

    const handleDeleteClick = () => {
        if (!event) return;

        // If event is recurring, show dialog
        if (event.is_recurring) {
            setRecurringAction('delete');
            setShowRecurringDialog(true);
        } else {
            // Direct delete for non-recurring events
            handleDeleteConfirm();
        }
    };

    const handleDeleteConfirm = async (scope?: 'this' | 'all') => {
        if (!event?.id) return;

        const confirmMessage = scope === 'all'
            ? `Êtes-vous sûr de vouloir supprimer TOUS les événements de la série "${event.title}" ?`
            : `Êtes-vous sûr de vouloir supprimer "${event.title}" ?`;

        if (!confirm(confirmMessage)) {
            return;
        }

        setIsDeleting(true);
        try {
            if (scope === 'all' && event.master_id) {
                // Delete all events in the series
                await eventService.delete(event.master_id, { scope: 'series' });
                addToast({
                    message: 'Série d\'événements supprimée avec succès',
                    type: 'success',
                });
            } else if (scope === 'this' && event.is_recurring) {
                // Delete only this occurrence
                await eventService.delete(event.id, { scope: 'single' });
                addToast({
                    message: 'Événement supprimé avec succès',
                    type: 'success',
                });
            } else {
                // Simple delete for non-recurring
                await eventService.delete(event.id);
                addToast({
                    message: 'Événement supprimé avec succès',
                    type: 'success',
                });
            }
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error deleting event:', error);
            addToast({
                message: 'Erreur lors de la suppression',
                type: 'error',
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditClick = () => {
        if (!event) return;

        // If event is recurring, show dialog
        if (event.is_recurring) {
            setRecurringAction('edit');
            setShowRecurringDialog(true);
        } else {
            // Direct edit for non-recurring events
            setMode('edit');
        }
    };

    const handleRecurringChoice = (option: 'this' | 'all') => {
        setShowRecurringDialog(false);

        if (recurringAction === 'delete') {
            handleDeleteConfirm(option);
        } else if (recurringAction === 'edit') {
            // Store the scope choice for when form is submitted
            setEventData({
                ...eventData,
                _editScope: option, // Custom field to track edit scope
            } as any);
            setMode('edit');
        }
    };

    const handleToggleDone = async () => {
        if (!event?.id) return;

        try {
            await eventService.update(event.id, {
                ...event,
                is_done: !event.is_done,
            });
            addToast({
                message: event.is_done ? 'Marqué comme non fait' : 'Marqué comme fait',
                type: 'success',
            });
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error toggling done:', error);
            addToast({
                message: 'Erreur lors de la mise à jour',
                type: 'error',
            });
        }
    };

    const handleFormSubmit = () => {
        onUpdate();
        onClose();
    };

    const handleFormCancel = () => {
        if (mode === 'create') {
            onClose();
        } else {
            setMode('view');
        }
    };

    const getEventTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            medical: 'bg-red-500',
            care: 'bg-pink-400',
            feeding: 'bg-blue-500',
            appointment: 'bg-purple-500',
            training: 'bg-green-500',
            social: 'bg-yellow-500',
            other: 'bg-gray-500',
        };
        return colors[type] || 'bg-gray-500';
    };

    const getEventTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            medical: 'Médical',
            care: 'Soin',
            feeding: 'Repas',
            appointment: 'Rendez-vous',
            training: 'Entraînement',
            social: 'Social',
            other: 'Autre',
        };
        return labels[type] || type;
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                    {mode === 'view' && event ? (
                        <>
                            {/* Header */}
                            <div className={`p-6 ${getEventTypeColor(event.type)} text-white`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-semibold uppercase tracking-wide opacity-90">
                                                {getEventTypeLabel(event.type)}
                                            </span>
                                            {event.is_recurring && (
                                                <FontAwesomeIcon icon={faRepeat} className="text-xs opacity-75" />
                                            )}
                                        </div>
                                        <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
                                        {event.pets && event.pets.length > 0 && (
                                            <div className="flex gap-2 flex-wrap">
                                                {event.pets.map((pet) => (
                                                    <span
                                                        key={pet.id}
                                                        className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full"
                                                    >
                                                        {pet.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
                                {/* Date & Time */}
                                <div className="flex items-start gap-3">
                                    <FontAwesomeIcon icon={faClock} className="text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {new Date(event.start_date).toLocaleDateString('fr-FR', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(event.start_date).toLocaleTimeString('fr-FR', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                            {event.end_date && (
                                                <>
                                                    {' → '}
                                                    {new Date(event.end_date).toLocaleTimeString('fr-FR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Notes */}
                                {event.notes && (
                                    <div className="flex items-start gap-3">
                                        <FontAwesomeIcon icon={faNoteSticky} className="text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                {event.notes}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Status */}
                                <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <FontAwesomeIcon
                                        icon={event.is_done ? faCheckCircle : faCircle}
                                        className={event.is_done ? 'text-green-500' : 'text-gray-300'}
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {event.is_done ? 'Terminé' : 'À faire'}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-6 bg-gray-50 dark:bg-gray-900 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={handleToggleDone}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <FontAwesomeIcon
                                        icon={event.is_done ? faCircle : faCheckCircle}
                                        className="mr-2"
                                    />
                                    {event.is_done ? 'Marquer non fait' : 'Marquer fait'}
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDeleteClick}
                                        disabled={isDeleting}
                                        className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                        Supprimer
                                    </button>
                                    <button
                                        onClick={handleEditClick}
                                        className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                        Modifier
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Edit/Create Mode */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {mode === 'create' ? 'Nouvel événement' : 'Modifier l\'événement'}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[70vh]">
                                <EventForm
                                    event={eventData}
                                    onChange={(updatedEvent) => setEventData(updatedEvent)}
                                    onSubmit={handleFormSubmit}
                                    onCancel={handleFormCancel}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Recurring Event Dialog */}
            <RecurringEventDialog
                isOpen={showRecurringDialog}
                eventTitle={event?.title || ''}
                onSelectOption={handleRecurringChoice}
                onCancel={() => setShowRecurringDialog(false)}
                action={recurringAction}
            />
        </>
    );
};

export default EventQuickView;
