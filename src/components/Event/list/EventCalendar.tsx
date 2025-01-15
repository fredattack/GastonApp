import React, {
    useEffect,
    useState
} from 'react';
import Dropdown
    from '../../Dropdown'; // Assumed Dropdown component path
import {
    dateStartOfDay,
    dateEndOfDay
} from '../../../helpers';
import {
    eventService
} from '../../../services';


import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';

const VIEW_MODES = {
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month'
};
import {
    useIcons
} from '../../../providers/FontawesomeProvider';
import EventCard
    from './EventCard';


import DisplaySettingsDropdown
    from '../../Calendar/DisplaySettingsDropdown';



const EventCalendar = () => {
    const icons = useIcons();

    const [viewMode, setViewMode] = useState(VIEW_MODES.DAY);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<EventFormData[]>([]);


    useEffect(() => {
        const {
            startDate,
            endDate
        } = getDateRange(currentDate);
        fetchEvents(startDate, endDate);
    }, []);

    const fetchEvents = async (startDate: any, endDate: any) => {
        let events = await eventService.getEventsForPeriod(formatDateToIso(startDate), formatDateToIso(endDate));
        setEvents(events);
    };

    const formatDateToIso = (date: any) => {
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    };
    const getDateRange = (date: Date, mode: string | null = null) => {
        if (!mode) {
            mode = viewMode;
        }

        if (mode === VIEW_MODES.DAY) {
            return {
                startDate: dateStartOfDay(new Date(date)),  // Start of the day (00:00:00.000)
                endDate: dateEndOfDay(new Date(date))
            };
        } else if (mode === VIEW_MODES.WEEK) {
            const startOfWeek = new Date(date);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
            const endOfWeek = new Date(date);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            return {
                startDate: dateStartOfDay(startOfWeek),
                endDate: dateEndOfDay(endOfWeek)
            };
        } else {
            const startOfMonth = new Date(currentDate);
            startOfMonth.setDate(1);
            const endOfMonth = new Date(startOfMonth);
            endOfMonth.setMonth(startOfMonth.getMonth() + 1);
            endOfMonth.setDate(0);
            return {
                startDate: dateStartOfDay(startOfMonth),
                endDate: dateEndOfDay(endOfMonth)
            };
        }
    };

    const formatDate = (date: any) => {
        if (viewMode === VIEW_MODES.DAY) {
            return date.toLocaleDateString('fr-FR', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } else if (viewMode === VIEW_MODES.WEEK) {

            const startOfWeek = new Date(date);
            startOfWeek.setDate(date.getDate() - date.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            return `${startOfWeek.toLocaleDateString('fr-FR', {
                month: 'short',
                day: 'numeric'
            })} - ${endOfWeek.toLocaleDateString('fr-FR', {
                month: 'short',
                day: 'numeric'
            })}`;
        } else {
            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long'
            });
        }
    };

    const handleSetViewMode = async (mode: any) => {

        await setViewMode(mode);


        const {
            startDate,
            endDate
        } = getDateRange(currentDate,mode);

        fetchEvents(startDate, endDate);
    };
    const handlePrev = async () => {
        const newDate = new Date(currentDate);
        if (viewMode === VIEW_MODES.DAY) newDate.setDate(newDate.getDate() - 1);
        else if (viewMode === VIEW_MODES.WEEK) newDate.setDate(newDate.getDate() - 7);
        else newDate.setMonth(newDate.getMonth() - 1);

        await setCurrentDate(newDate);

        const {
            startDate,
            endDate
        } = getDateRange(newDate);
        fetchEvents(startDate, endDate);
    };

    const handleNext = async () => {
        const newDate = new Date(currentDate);
        if (viewMode === VIEW_MODES.DAY) newDate.setDate(newDate.getDate() + 1);
        else if (viewMode === VIEW_MODES.WEEK) newDate.setDate(newDate.getDate() + 7);
        else newDate.setMonth(newDate.getMonth() + 1);
        await setCurrentDate(newDate);

        const {
            startDate,
            endDate
        } = getDateRange(newDate);
        fetchEvents(startDate, endDate);
    };

    const handleToday = async () => {
        const newDate = new Date();
        await setCurrentDate(newDate);

        const {
            startDate,
            endDate
        } = getDateRange(newDate);
        fetchEvents(startDate, endDate);
    };

    const filteredEvents = events;
    return (
        <div
            key={viewMode}
            className="event-calendar"
        >
            <div
                className="toolbar flex items-center justify-end mb-4 mx-3">
               <DisplaySettingsDropdown
                   key={viewMode}
                onChangeViewMode={handleSetViewMode}
                viewMode={viewMode}
               />

            </div>
            <div
                className="toolbar flex items-center justify-between mb-4 mx-3">



                    <div
                        className="navigation-buttons flex items-center gap-2">
                        <button
                            onClick={handlePrev}
                            className="text-gray-500">
                            {/*@ts-ignore*/}
                            <FontAwesomeIcon
                                // @ts-ignore
                                icon={icons?.anglesLeft}
                                className="m-auto" />
                        </button>

                        <span>{formatDate(currentDate)}</span>


                        <button
                            onClick={handleNext}
                            className="text-gray-500">
                            {/*@ts-ignore*/}
                            <FontAwesomeIcon
                                // @ts-ignore
                                icon={icons?.anglesRight}
                                className="m-auto" />
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={handleToday}
                            className="btn btn-outline-dark btn-sm">
                            Today
                        </button>
                    </div>
                </div>

                <div
                    className="event-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.length > 0 ? (
                        events.map((event, index) => (
                            <div
                                key={index}
                                className="event-card">
                                <EventCard
                                    // @ts-ignore
                                    event={event} />
                            </div>
                        ))
                    ) : (
                        <p>Aucun
                            événement
                            à
                            afficher.</p>
                    )}
                </div>
            </div>
            );
            };

            export
            default
            EventCalendar;
