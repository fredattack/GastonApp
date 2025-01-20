import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { dateStartOfDay, dateEndOfDay } from "../../../helpers";
import { eventService } from "../../../services";

import { useIcons } from "../../../providers/FontawesomeProvider";
import EventCard from "./EventCard";
import EventSummary from "./EventSummary";
import EventCalendarDropdown from "./EventCalendarDropdown";

import DisplaySettingsDropdown from "../../Calendar/DisplaySettingsDropdown";
import { EventTypes } from "../../../enums/EventTypes";

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

    const [filters, setFilters] = useState({
        pet_species: ["cat", "dog"],
        is_done: false,
    });

    const [viewMode, setViewMode] = useState(VIEW_MODES.DAY);
    const [viewStyle, setViewStyle] = useState(VIEW_STYLES.CARD);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<EventFormData[]>([]);

    useEffect(() => {
        const { start_date, end_date } = getDateRange(currentDate);
        fetchEvents(start_date, end_date);
    }, []);

    const fetchEvents = async (start_date: any, end_date: any) => {
        const events = await eventService.getEventsForPeriod(
            formatDateToIso(start_date),
            formatDateToIso(end_date),
        );
        setEvents(
            events.map((event: EventFormData) => ({
                ...event,
                // Ensure all required Event type fields are set here, as necessary
            })),
        );
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
                start_date: dateStartOfDay(new Date(date)), // Start of the day (00:00:00.000)
                end_date: dateEndOfDay(new Date(date)),
            };
        }
        if (mode === VIEW_MODES.WEEK) {
            const startOfWeek = new Date(date);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
            const endOfWeek = new Date(date);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            return {
                start_date: dateStartOfDay(startOfWeek),
                end_date: dateEndOfDay(endOfWeek),
            };
        }
        const startOfMonth = new Date(currentDate);
        startOfMonth.setDate(1);
        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(startOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        return {
            start_date: dateStartOfDay(startOfMonth),
            end_date: dateEndOfDay(endOfMonth),
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

            {filteredEvents.length > 0 ? (
                <div className="event-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {viewStyle === VIEW_STYLES.CARD &&
                        filteredEvents.map((event, index) => (
                            <div key={index} className="event-card">
                                <EventCard
                                    // @ts-ignore
                                    event={event}
                                />
                            </div>
                        ))}
                    {viewStyle === VIEW_STYLES.FEEDING && (
                        <EventSummary
                            events={filteredEvents.filter(
                                (event) => event.type === EventTypes.Feeding,
                            )}
                        />
                    )}
                    {viewStyle === VIEW_STYLES.CARE && <p>care</p>}
                </div>
            ) : (
                <p>Aucun événement à afficher.</p>
            )}
        </div>
    );
};

export default EventCalendar;
