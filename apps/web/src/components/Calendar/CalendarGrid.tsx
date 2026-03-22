import React, { useState } from "react";
import { Plus } from "@phosphor-icons/react";

interface CalendarGridProps {
    currentDate: Date;
    events: EventFormData[];
    onDateClick: (date: Date) => void;
    onEventClick: (event: EventFormData) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
    currentDate,
    events,
    onDateClick,
    onEventClick,
}) => {
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        return firstDay === 0 ? 6 : firstDay - 1;
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfWeek = getFirstDayOfMonth(currentDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const calendarDays: (Date | null)[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
        calendarDays.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(new Date(year, month, day));
    }

    const remainingCells = 7 - (calendarDays.length % 7);
    if (remainingCells < 7) {
        for (let i = 0; i < remainingCells; i++) {
            calendarDays.push(null);
        }
    }

    const getEventsForDate = (date: Date | null): EventFormData[] => {
        if (!date) return [];

        return events.filter((event) => {
            const eventDate = new Date(event.start_date);
            return (
                eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear()
            );
        });
    };

    const isToday = (date: Date | null): boolean => {
        if (!date) return false;
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

    const getEventColor = (type: string) => {
        const colors: Record<string, string> = {
            medical: "bg-red-500",
            care: "bg-pink-400",
            feeding: "bg-blue-500",
            appointment: "bg-purple-500",
            training: "bg-green-500",
            social: "bg-yellow-500",
            other: "bg-gray-500",
        };
        return colors[type] || "bg-gray-500";
    };

    return (
        <div className="calendar-grid bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className="text-center py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {calendarDays.map((date, index) => {
                    const dayEvents = getEventsForDate(date);
                    const isHovered =
                        hoveredDate &&
                        date &&
                        hoveredDate.toDateString() === date.toDateString();

                    return (
                        <div
                            key={index}
                            className={`
                                min-h-[120px] border-b border-r border-gray-200 dark:border-gray-700 p-2
                                ${date ? "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" : "bg-gray-50 dark:bg-gray-900"}
                                ${isToday(date) ? "ring-2 ring-primary ring-inset" : ""}
                                transition-colors relative
                            `}
                            onClick={() => date && onDateClick(date)}
                            onMouseEnter={() => setHoveredDate(date)}
                            onMouseLeave={() => setHoveredDate(null)}
                        >
                            {date && (
                                <>
                                    <div className="flex items-center justify-between mb-1">
                                        <span
                                            className={`
                                                text-sm font-semibold
                                                ${
                                                    isToday(date)
                                                        ? "bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center"
                                                        : "text-gray-700 dark:text-gray-300"
                                                }
                                            `}
                                        >
                                            {date.getDate()}
                                        </span>

                                        {isHovered && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDateClick(date);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-primary p-1"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-1 overflow-y-auto max-h-[80px]">
                                        {dayEvents
                                            .slice(0, 3)
                                            .map((event, idx) => (
                                                <div
                                                    key={event.id || idx}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEventClick(event);
                                                    }}
                                                    className={`
                                                    text-xs px-2 py-1 rounded truncate cursor-pointer
                                                    ${getEventColor(event.type)} text-white
                                                    hover:opacity-80 transition-opacity
                                                `}
                                                    title={event.title}
                                                >
                                                    <span className="font-medium">
                                                        {new Date(
                                                            event.start_date,
                                                        ).toLocaleTimeString(
                                                            "fr-FR",
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            },
                                                        )}
                                                    </span>{" "}
                                                    {event.title}
                                                </div>
                                            ))}

                                        {dayEvents.length > 3 && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                                                +{dayEvents.length - 3} autre
                                                {dayEvents.length - 3 > 1
                                                    ? "s"
                                                    : ""}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarGrid;
