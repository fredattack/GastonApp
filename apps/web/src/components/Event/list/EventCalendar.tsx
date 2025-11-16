// @ts-nocheck
import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dateStartOfDay, dateEndOfDay } from "../../../helpers";
import { eventService } from "../../../services";

import { useIcons } from "../../../providers/FontawesomeProvider";
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
    const icons = useIcons();
    const { events, fetchEvents } = useEvents();

    const [filters, setFilters] = useState({
        pet_species: ["cat", "dog"],
        is_done: false,
    });

    const [viewMode, setViewMode] = useState(VIEW_MODES.MONTH);
    const [viewStyle, setViewStyle] = useState(VIEW_STYLES.CARD);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<EventFormData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInitialDate, setModalInitialDate] = useState<Date | undefined>();

    useEffect(() => {
        const { start_date, end_date } = getDateRange(currentDate);
        fetchEvents(start_date, end_date);
    }, []);

    // const fetchEvents = async (start_date: any, end_date: any) => {
    //     const events = await eventService.getEventsForPeriod(
    //         formatDateToIso(start_date),
    //         formatDateToIso(end_date),
    //     );
    //
    //     setEvents(
    //         events.map((event: EventFormData) => ({
    //             ...event,
    //             // Ensure all required Event type fields are set here, as necessary
    //         })),
    //     );
    // };

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
                start_date: formatDateToIso(dateStartOfDay(new Date(date))), // Start of the day (00:00:00.000)
                end_date: formatDateToIso(dateEndOfDay(new Date(date))),
            };
        }
        if (mode === VIEW_MODES.WEEK) {
            const startOfWeek = new Date(date);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
            const endOfWeek = new Date(date);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            return {
                start_date: formatDateToIso(dateStartOfDay(startOfWeek)),
                end_date: formatDateToIso(dateEndOfDay(endOfWeek)),
            };
        }
        const startOfMonth = new Date(currentDate);
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
            startOfWeek.setDate(date.getDate() - date.getDay());
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

        fetchEvents(formatDateToIso(start_date), formatDateToIso(end_date));
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
            // Update event with new date
            const updatedEvent = {
                ...event,
                start_date: newDate.toISOString(),
            };

            // @ts-ignore
            await eventService.update(event.id!, updatedEvent);

            // Refresh events
            handleRefetchEvents();

            // Show success toast
            const { addToast } = require('../../../providers/ToastProvider').useToast();
            addToast({
                message: `"${event.title}" déplacé avec succès`,
                type: 'success',
            });
        } catch (error) {
            console.error('Error moving event:', error);
            const { addToast } = require('../../../providers/ToastProvider').useToast();
            addToast({
                message: 'Erreur lors du déplacement de l\'événement',
                type: 'error',
            });
        }
    };

    const handleEventResize = async (event: EventFormData, newDuration: number) => {
        try {
            // Calculate new end date based on duration
            const startDate = new Date(event.start_date);
            const endDate = new Date(startDate.getTime() + newDuration * 60 * 60 * 1000);

            const updatedEvent = {
                ...event,
                end_date: endDate.toISOString(),
            };

            await eventService.update(event.id!, updatedEvent);

            // Refresh events
            handleRefetchEvents();

            const { addToast } = require('../../../providers/ToastProvider').useToast();
            addToast({
                message: `Durée de "${event.title}" modifiée`,
                type: 'success',
            });
        } catch (error) {
            console.error('Error resizing event:', error);
            const { addToast } = require('../../../providers/ToastProvider').useToast();
            addToast({
                message: 'Erreur lors de la modification de la durée',
                type: 'error',
            });
        }
    };

    // console.log("filters", filters);
    return (
        <div key={viewMode} className="event-calendar">
            <div className="toolbar flex items-center justify-end mb-4 mx-3">
                <DisplaySettingsDropdown
                    key={viewMode}
                    onChangeViewMode={handleSetViewMode}
                    onChangeViewStyle={handleSetViewStyle}
                    viewMode={viewMode}
                />
            </div>
            <div className="toolbar flex items-center justify-between mb-4 mx-3">
                <div className="navigation-buttons flex items-center gap-2">
                    <button onClick={handlePrev} className="text-gray-500">
                        {/* @ts-ignore */}
                        <FontAwesomeIcon
                            // @ts-ignore
                            icon={icons?.anglesLeft}
                            className="m-auto"
                        />
                    </button>

                    <span>{formatDate(currentDate)}</span>

                    <button onClick={handleNext} className="text-gray-500">
                        {/* @ts-ignore */}
                        <FontAwesomeIcon
                            // @ts-ignore
                            icon={icons?.anglesRight}
                            className="m-auto"
                        />
                    </button>
                </div>
                <div>
                    <button
                        onClick={handleToday}
                        className="btn btn-outline-dark btn-sm"
                    >
                        Today
                    </button>
                </div>
                <div>
                    <EventCalendarDropdown
                        filters={filters}
                        onFiltersChange={(filters: any) => {
                            // console.log("filters in calendar", filters);
                            setFilters(filters);
                        }}
                    />
                </div>
            </div>

            {/* Calendar Views */}
            <div className="mx-3">
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
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400">Vue soins médicaux à implémenter</p>
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
