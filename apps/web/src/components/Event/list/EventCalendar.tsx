// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { dateStartOfDay, dateEndOfDay } from "../../../helpers";
import { eventService } from "../../../services";

import EventCard from "./EventCard";
import EventSummary from "./EventSummary";
import EventCalendarDropdown from "./EventCalendarDropdown";

import DisplaySettingsDropdown from "../../Calendar/DisplaySettingsDropdown";
import CalendarGrid from "../../Calendar/CalendarGrid";
import WeekView from "../../Calendar/WeekView";
import DayView from "../../Calendar/DayView";
import EventQuickView from "../../Calendar/EventQuickView";
import { EventTypes } from "../../../enums/EventTypes";
import { useEvents } from "../../../contexts/EventsContext";
import { SkeletonCard } from "../../Skeleton";

const VIEW_MODES = {
    DAY: "day",
    WEEK: "week",
    MONTH: "month",
};
const VIEW_STYLES = {
    CARD: "card",
    FEEDING: "feeding",
    CARE: "care",
};

const EventCalendar = () => {
    const { events, isLoading, fetchEvents } = useEvents();
    const [searchParams] = useSearchParams();

    const [filters, setFilters] = useState({
        pet_species: ["cat", "dog"],
        is_done: false,
    });

    const [viewMode, setViewMode] = useState(() => {
        const urlView = searchParams.get("view");
        if (urlView && Object.values(VIEW_MODES).includes(urlView)) {
            return urlView;
        }
        return VIEW_MODES.MONTH;
    });
    const [viewStyle, setViewStyle] = useState(VIEW_STYLES.CARD);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<EventFormData | null>(
        null,
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInitialDate, setModalInitialDate] = useState<
        Date | undefined
    >();

    useEffect(() => {
        const { start_date, end_date } = getDateRange(currentDate, viewMode);
        fetchEvents(start_date, end_date);
    }, []);

    const handleRefetchEvents = () => {
        const { start_date, end_date } = getDateRange(currentDate);
        fetchEvents(start_date, end_date);
    };

    const filteredEvents = events.filter((event: EventFormData) => {
        if ("is_done" in filters && filters.is_done) {
            return event.is_done;
        }
        return true;
    });

    const formatDateToIso = (date: any) => {
        return new Date(
            date.getTime() - date.getTimezoneOffset() * 60000,
        ).toISOString();
    };

    const getDateRange = (date: Date, mode: string | null = null) => {
        if (!mode) {
            mode = viewMode;
        }

        if (mode === VIEW_MODES.DAY) {
            return {
                start_date: formatDateToIso(dateStartOfDay(new Date(date))),
                end_date: formatDateToIso(dateEndOfDay(new Date(date))),
            };
        }
        if (mode === VIEW_MODES.WEEK) {
            const startOfWeek = new Date(date);
            const day = date.getDay();
            const diffToMonday = day === 0 ? -6 : 1 - day;
            startOfWeek.setDate(date.getDate() + diffToMonday);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            return {
                start_date: formatDateToIso(dateStartOfDay(startOfWeek)),
                end_date: formatDateToIso(dateEndOfDay(endOfWeek)),
            };
        }
        const startOfMonth = new Date(date);
        startOfMonth.setDate(1);
        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(startOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        return {
            start_date: formatDateToIso(dateStartOfDay(startOfMonth)),
            end_date: formatDateToIso(dateEndOfDay(endOfMonth)),
        };
    };

    const formatDate = (date: any) => {
        if (viewMode === VIEW_MODES.DAY) {
            return date.toLocaleDateString("fr-FR", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        }
        if (viewMode === VIEW_MODES.WEEK) {
            const startOfWeek = new Date(date);
            const day = date.getDay();
            const diffToMonday = day === 0 ? -6 : 1 - day;
            startOfWeek.setDate(date.getDate() + diffToMonday);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            return `${startOfWeek.toLocaleDateString("fr-FR", {
                month: "short",
                day: "numeric",
            })} - ${endOfWeek.toLocaleDateString("fr-FR", {
                month: "short",
                day: "numeric",
            })}`;
        }
        return date.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
        });
    };

    const handleSetViewMode = async (mode: any) => {
        await setViewMode(mode);

        const { start_date, end_date } = getDateRange(currentDate, mode);

        fetchEvents(start_date, end_date);
    };

    const handleSetViewStyle = async (style: any) => {
        await setViewStyle(style);
    };

    const handlePrev = async () => {
        const newDate = new Date(currentDate);
        if (viewMode === VIEW_MODES.DAY) newDate.setDate(newDate.getDate() - 1);
        else if (viewMode === VIEW_MODES.WEEK)
            newDate.setDate(newDate.getDate() - 7);
        else newDate.setMonth(newDate.getMonth() - 1);

        await setCurrentDate(newDate);

        const { start_date, end_date } = getDateRange(newDate);
        fetchEvents(start_date, end_date);
    };

    const handleNext = async () => {
        const newDate = new Date(currentDate);
        if (viewMode === VIEW_MODES.DAY) newDate.setDate(newDate.getDate() + 1);
        else if (viewMode === VIEW_MODES.WEEK)
            newDate.setDate(newDate.getDate() + 7);
        else newDate.setMonth(newDate.getMonth() + 1);
        await setCurrentDate(newDate);

        const { start_date, end_date } = getDateRange(newDate);
        fetchEvents(start_date, end_date);
    };

    const handleToday = async () => {
        const newDate = new Date();
        await setCurrentDate(newDate);

        const { start_date, end_date } = getDateRange(newDate);
        fetchEvents(start_date, end_date);
    };

    const handleDateClick = (date: Date) => {
        setModalInitialDate(date);
        setSelectedEvent(null);
        setIsModalOpen(true);
    };

    const handleTimeSlotClick = (date: Date, hour: number) => {
        const slotDate = new Date(date);
        slotDate.setHours(hour, 0, 0, 0);
        setModalInitialDate(slotDate);
        setSelectedEvent(null);
        setIsModalOpen(true);
    };

    const handleEventClick = (event: EventFormData) => {
        setSelectedEvent(event);
        setModalInitialDate(undefined);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
        setModalInitialDate(undefined);
    };

    const handleModalUpdate = () => {
        handleRefetchEvents();
    };

    const handleEventMove = async (event: EventFormData, newDate: Date) => {
        try {
            const updatedEvent = {
                ...event,
                start_date: newDate.toISOString(),
            };

            // @ts-ignore
            await eventService.update(event.id!, updatedEvent);

            handleRefetchEvents();

            const { addToast } =
                require("../../../providers/ToastProvider").useToast();
            addToast({
                message: `"${event.title}" déplacé avec succès`,
                type: "success",
            });
        } catch (error) {
            console.error("Error moving event:", error);
            const { addToast } =
                require("../../../providers/ToastProvider").useToast();
            addToast({
                message: "Erreur lors du déplacement de l'événement",
                type: "error",
            });
        }
    };

    const handleEventResize = async (
        event: EventFormData,
        newDuration: number,
    ) => {
        try {
            const startDate = new Date(event.start_date);
            const endDate = new Date(
                startDate.getTime() + newDuration * 60 * 60 * 1000,
            );

            const updatedEvent = {
                ...event,
                end_date: endDate.toISOString(),
            };

            await eventService.update(event.id!, updatedEvent);

            handleRefetchEvents();

            const { addToast } =
                require("../../../providers/ToastProvider").useToast();
            addToast({
                message: `Durée de "${event.title}" modifiée`,
                type: "success",
            });
        } catch (error) {
            console.error("Error resizing event:", error);
            const { addToast } =
                require("../../../providers/ToastProvider").useToast();
            addToast({
                message: "Erreur lors de la modification de la durée",
                type: "error",
            });
        }
    };

    return (
        <div className="event-calendar" data-testid="event-calendar">
            <div className="toolbar flex items-center justify-between mb-4 mx-3 gap-3 flex-wrap">
                {/* Navigation */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={handlePrev}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-lin-0 hover:bg-lin-2 shadow-ds-xs transition-colors"
                    >
                        <CaretLeft size={18} className="text-[#6B6B6B]" />
                    </button>
                    <span className="font-nunito font-bold text-[#1A1A1A] whitespace-nowrap min-w-[100px] text-center">
                        {formatDate(currentDate)}
                    </span>
                    <button
                        onClick={handleNext}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-lin-0 hover:bg-lin-2 shadow-ds-xs transition-colors"
                    >
                        <CaretRight size={18} className="text-[#6B6B6B]" />
                    </button>
                    <button
                        onClick={handleToday}
                        className="text-sm font-semibold text-primary-700 hover:bg-primary-50 px-4 py-2 rounded-full transition-colors ml-1"
                        data-testid="calendar-today-button"
                    >
                        Aujourd'hui
                    </button>
                </div>

                {/* Segmented Control + Actions */}
                <div className="flex items-center gap-2">
                    {/* View Mode Segmented Control */}
                    <div className="flex bg-lin-2 rounded-full p-1">
                        {[
                            { mode: "day", label: "Jour" },
                            { mode: "week", label: "Semaine" },
                            { mode: "month", label: "Mois" },
                        ].map(({ mode, label }) => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => handleSetViewMode(mode)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                    viewMode === mode
                                        ? "bg-lin-0 shadow-ds-sm text-[#1A1A1A]"
                                        : "text-[#6B6B6B] hover:text-[#4A4A4A]"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* More Options */}
                    <DisplaySettingsDropdown
                        onChangeViewStyle={handleSetViewStyle}
                    />

                    {/* Filters */}
                    <EventCalendarDropdown
                        filters={filters}
                        onFiltersChange={(filters: any) => {
                            setFilters(filters);
                        }}
                    />
                </div>
            </div>

            {/* Calendar Views */}
            <div className="mx-3">
                {isLoading ? (
                    <div className="space-y-3">
                        <SkeletonCard height="h-64" />
                        <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <SkeletonCard key={i} height="h-8" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {viewMode === VIEW_MODES.MONTH && (
                            <CalendarGrid
                                currentDate={currentDate}
                                events={filteredEvents}
                                onDateClick={handleDateClick}
                                onEventClick={handleEventClick}
                            />
                        )}

                        {viewMode === VIEW_MODES.WEEK && (
                            <WeekView
                                currentDate={currentDate}
                                events={filteredEvents}
                                onTimeSlotClick={handleTimeSlotClick}
                                onEventClick={handleEventClick}
                                onEventMove={handleEventMove}
                                onEventResize={handleEventResize}
                            />
                        )}

                        {viewMode === VIEW_MODES.DAY && (
                            <DayView
                                currentDate={currentDate}
                                events={filteredEvents}
                                onTimeSlotClick={handleTimeSlotClick}
                                onEventClick={handleEventClick}
                                onEventMove={handleEventMove}
                                onEventResize={handleEventResize}
                            />
                        )}
                    </>
                )}
            </div>

            {/* Legacy List Views (optional fallback) */}
            {viewStyle !== VIEW_STYLES.CARD && (
                <div className="mx-3 mt-4">
                    {viewStyle === VIEW_STYLES.FEEDING && (
                        <EventSummary
                            events={filteredEvents.filter(
                                (event) => event.type === EventTypes.Feeding,
                            )}
                        />
                    )}
                    {viewStyle === VIEW_STYLES.CARE && (
                        <div className="p-4 bg-lin-0 rounded-[16px]">
                            <p className="text-[#6B6B6B]">
                                Vue soins médicaux à implémenter
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Event Quick View Modal */}
            <EventQuickView
                event={selectedEvent}
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onUpdate={handleModalUpdate}
                initialDate={modalInitialDate}
            />
        </div>
    );
};

export default EventCalendar;
