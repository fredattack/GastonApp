// @ts-nocheck
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
    X,
    PencilSimple,
    Trash,
    Clock,
    NoteBlank,
    ArrowsClockwise,
    CheckCircle,
    Circle,
} from "@phosphor-icons/react";
import EventForm from "../Event/Form/EventForm";
import RecurringEventDialog from "./RecurringEventDialog";
import { eventService } from "../../services";
import { useToast } from "../../providers/ToastProvider";
import {
    getEventTypeColor,
    getEventTypeLabel,
} from "../../constants/eventColors";

interface EventQuickViewProps {
    event: EventFormData | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
    initialDate?: Date;
}

const BLANK_EVENT: EventFormData = {
    id: null,
    master_id: null,
    petId: "",
    type: "",
    title: "",
    start_date: "",
    end_date: "",
    is_recurring: false,
    is_full_day: false,
    is_done: false,
    recurrence: {
        frequency_type: "",
        frequency: 1,
        days: [],
        end_date: "",
        occurrences: 1,
    },
    notes: "",
    pets: [],
};

const EventQuickView: React.FC<EventQuickViewProps> = ({
    event,
    isOpen,
    onClose,
    onUpdate,
    initialDate,
}) => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const modalRef = useRef<HTMLDivElement>(null);
    const [mode, setMode] = useState<"view" | "edit" | "create">("view");
    const [isDeleting, setIsDeleting] = useState(false);
    const [localIsDone, setLocalIsDone] = useState(event?.is_done ?? false);
    const [showRecurringDialog, setShowRecurringDialog] = useState(false);
    const [recurringAction, setRecurringAction] = useState<"edit" | "delete">(
        "edit",
    );

    const getInitialEvent = useCallback((): EventFormData => {
        if (event) {
            return {
                ...event,
                id: event.id ?? null,
                master_id: event.master_id ?? null,
                petId: event.petId ?? "",
                pets: event.pets ?? [],
                recurrence: event.recurrence ?? {
                    frequency_type: "",
                    frequency: 1,
                    days: [],
                    end_date: "",
                    occurrences: 1,
                },
            };
        }

        const startDate = initialDate || new Date();
        return {
            ...BLANK_EVENT,
            start_date: startDate.toISOString(),
        };
    }, [event, initialDate]);

    const [eventData, setEventData] =
        useState<EventFormData>(getInitialEvent());

    useEffect(() => {
        if (isOpen) {
            if (event) {
                setMode("view");
                setEventData(getInitialEvent());
                setLocalIsDone(event.is_done ?? false);
            } else {
                setMode("create");
                setLocalIsDone(false);
                // Force clean slate for creation
                const startDate = initialDate || new Date();
                setEventData({
                    ...BLANK_EVENT,
                    start_date: startDate.toISOString(),
                });
            }
        }
    }, [isOpen, event, initialDate, getInitialEvent]);

    // Focus trap & escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    const handleDeleteClick = () => {
        if (!event) return;
        if (event.is_recurring) {
            setRecurringAction("delete");
            setShowRecurringDialog(true);
        } else {
            handleDeleteConfirm();
        }
    };

    const handleDeleteConfirm = async (scope?: "this" | "all") => {
        if (!event?.id) return;

        const confirmMessage =
            scope === "all"
                ? `Supprimer TOUS les événements de la série "${event.title}" ?`
                : `Supprimer "${event.title}" ?`;

        if (!confirm(confirmMessage)) return;

        setIsDeleting(true);
        try {
            if (scope === "all" && event.master_id) {
                await eventService.delete(event.master_id, { scope: "series" });
            } else if (scope === "this" && event.is_recurring) {
                await eventService.delete(event.id, { scope: "single" });
            } else {
                await eventService.delete(event.id);
            }
            addToast({
                message: t("event.deleted_success"),
                type: "success",
            });
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Error deleting event:", error);
            addToast({
                message: "Erreur lors de la suppression",
                type: "error",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditClick = () => {
        if (!event) return;
        if (event.is_recurring) {
            setRecurringAction("edit");
            setShowRecurringDialog(true);
        } else {
            setMode("edit");
        }
    };

    const handleRecurringChoice = (option: "this" | "all") => {
        setShowRecurringDialog(false);
        if (recurringAction === "delete") {
            handleDeleteConfirm(option);
        } else if (recurringAction === "edit") {
            setEventData({
                ...eventData,
                _editScope: option,
            } as any);
            setMode("edit");
        }
    };

    const handleToggleDone = async () => {
        if (!event?.id) return;

        const newDoneState = !localIsDone;
        // Optimistic update
        setLocalIsDone(newDoneState);

        try {
            await eventService.changeDoneStatus({
                ...event,
                is_done: newDoneState,
            });
            addToast({
                message: newDoneState
                    ? "Marqué comme fait"
                    : "Marqué comme non fait",
                type: "success",
            });
            onUpdate();
        } catch (error) {
            // Revert on failure
            setLocalIsDone(!newDoneState);
            console.error("Error toggling done:", error);
            addToast({
                message: "Erreur lors de la mise à jour",
                type: "error",
            });
        }
    };

    const handleFormSubmit = () => {
        onUpdate();
        onClose();
    };

    const handleFormCancel = () => {
        if (mode === "create") {
            onClose();
        } else {
            setMode("view");
        }
    };

    if (!isOpen) return null;

    const typeColors = event ? getEventTypeColor(event.type) : null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1300] animate-[fadeIn_200ms_ease-out]"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-[1400] p-4">
                <div
                    ref={modalRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="event-modal-title"
                    className="bg-lin-0 rounded-[20px] shadow-ds-xl max-w-[95vw] sm:max-w-lg md:max-w-2xl w-full max-h-[90vh] overflow-hidden animate-[scaleIn_250ms_ease-out]"
                >
                    {mode === "view" && event ? (
                        <>
                            {/* Header with gradient */}
                            <div
                                className={`p-6 bg-gradient-to-br ${typeColors?.gradient} relative`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/70 bg-white/40 rounded-full px-3 py-1">
                                                {getEventTypeLabel(event.type)}
                                            </span>
                                            {event.is_recurring && (
                                                <ArrowsClockwise
                                                    size={14}
                                                    className="text-[#1A1A1A]/60"
                                                />
                                            )}
                                        </div>
                                        <h2
                                            id="event-modal-title"
                                            className="text-2xl font-bold text-[#1A1A1A] mb-2"
                                        >
                                            {event.title}
                                        </h2>
                                        {event.pets &&
                                            event.pets.length > 0 && (
                                                <div className="flex gap-2 flex-wrap">
                                                    {event.pets.map(
                                                        (pet: any) => (
                                                            <span
                                                                key={pet.id}
                                                                className="text-sm bg-white/50 text-[#1A1A1A] px-3 py-1 rounded-full font-semibold"
                                                            >
                                                                {pet.name}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/30 text-[#1A1A1A]/70 transition-colors"
                                        aria-label="Fermer"
                                    >
                                        <X size={20} weight="bold" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
                                {/* Date & Time */}
                                <div className="flex items-start gap-3">
                                    <Clock
                                        size={20}
                                        className="text-[#6B6B6B] mt-0.5 shrink-0"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-[#1A1A1A]">
                                            {new Date(
                                                event.start_date,
                                            ).toLocaleDateString("fr-FR", {
                                                weekday: "long",
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                        <p className="text-sm text-[#6B6B6B]">
                                            {new Date(
                                                event.start_date,
                                            ).toLocaleTimeString("fr-FR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                            {event.end_date && (
                                                <>
                                                    {" → "}
                                                    {new Date(
                                                        event.end_date,
                                                    ).toLocaleTimeString(
                                                        "fr-FR",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        },
                                                    )}
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Notes */}
                                {event.notes && (
                                    <div className="flex items-start gap-3">
                                        <NoteBlank
                                            size={20}
                                            className="text-[#6B6B6B] mt-0.5 shrink-0"
                                        />
                                        <p className="text-sm text-[#4A4A4A] whitespace-pre-wrap">
                                            {event.notes}
                                        </p>
                                    </div>
                                )}

                                {/* Status */}
                                <div className="flex items-center gap-3 pt-4 border-t border-lin-4">
                                    {localIsDone ? (
                                        <CheckCircle
                                            size={20}
                                            weight="fill"
                                            className="text-success"
                                        />
                                    ) : (
                                        <Circle
                                            size={20}
                                            className="text-lin-6"
                                        />
                                    )}
                                    <span className="text-sm text-[#6B6B6B]">
                                        {localIsDone
                                            ? t("event.status_done")
                                            : t("event.status_todo")}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-5 bg-lin-1 flex items-center justify-between border-t border-lin-4">
                                <button
                                    onClick={handleToggleDone}
                                    className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-semibold text-primary-700 hover:bg-primary-50 rounded-full transition-colors"
                                >
                                    {localIsDone ? (
                                        <Circle size={18} />
                                    ) : (
                                        <CheckCircle size={18} />
                                    )}
                                    {localIsDone
                                        ? "Marquer non fait"
                                        : t("event.mark_done")}
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDeleteClick}
                                        disabled={isDeleting}
                                        className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-semibold text-danger hover:bg-danger/10 rounded-full transition-colors disabled:opacity-50"
                                    >
                                        <Trash size={18} />
                                        {t("event.delete")}
                                    </button>
                                    <button
                                        onClick={handleEditClick}
                                        className="flex items-center gap-2 px-6 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-[#1A1A1A] hover:bg-[#333] rounded-full shadow-ds-sm transition-all"
                                    >
                                        <PencilSimple size={18} />
                                        {t("Modify")}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Edit/Create Mode */}
                            <div className="p-6 border-b border-lin-4 flex items-center justify-between">
                                <h2
                                    id="event-modal-title"
                                    className="text-xl font-bold text-[#1A1A1A]"
                                >
                                    {mode === "create"
                                        ? t("event.new")
                                        : t("event.edit")}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-lin-3 text-[#6B6B6B] transition-colors"
                                    aria-label="Fermer"
                                >
                                    <X size={20} weight="bold" />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[70vh]">
                                <EventForm
                                    event={eventData}
                                    onChange={(updatedEvent) =>
                                        setEventData(updatedEvent)
                                    }
                                    onSubmit={handleFormSubmit}
                                    onCancel={handleFormCancel}
                                    submittable
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Recurring Event Dialog */}
            <RecurringEventDialog
                isOpen={showRecurringDialog}
                eventTitle={event?.title || ""}
                onSelectOption={handleRecurringChoice}
                onCancel={() => setShowRecurringDialog(false)}
                action={recurringAction}
            />
        </>
    );
};

export default EventQuickView;
