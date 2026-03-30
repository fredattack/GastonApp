import React, { useState } from "react";
import { Plus, CheckCircle } from "@phosphor-icons/react";
import { getEventTypeColor } from "../../constants/eventColors";

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

    return (
        <div className="calendar-grid bg-lin-0 rounded-[20px] shadow-ds-md border border-lin-4 overflow-hidden">
            <div className="grid grid-cols-7 border-b border-lin-4">
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className="text-center py-3 text-[#6B6B6B] font-semibold text-xs uppercase tracking-wider"
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
                    const todayCell = isToday(date);

                    return (
                        <div
                            key={index}
                            className={`
                                group min-h-[120px] border-b border-r border-lin-4 p-2
                                ${date ? "bg-lin-0 hover:bg-primary-50 cursor-pointer" : "bg-lin-1"}
                                ${todayCell ? "bg-primary/5 ring-2 ring-primary ring-inset" : ""}
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
                                                    todayCell
                                                        ? "bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center"
                                                        : "text-[#4A4A4A]"
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
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-[#8E8E8E] hover:text-primary p-1"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-1 overflow-y-auto max-h-[80px]">
                                        {dayEvents
                                            .slice(0, 3)
                                            .map((event, idx) => {
                                                const typeColors = getEventTypeColor(event.type);
                                                return (
                                                    <div
                                                        key={event.id || idx}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onEventClick(event);
                                                        }}
                                                        className={`
                                                            rounded-full px-2 py-0.5 text-xs font-semibold truncate cursor-pointer
                                                            border-l-2 ${typeColors.border}
                                                            ${typeColors.bgLight} ${typeColors.text}
                                                            hover:opacity-80 transition-opacity
                                                        `}
                                                        title={event.title}
                                                    >
                                                        {event.is_done && (
                                                            <CheckCircle
                                                                size={12}
                                                                weight="fill"
                                                                className="inline-block text-success shrink-0 -ml-0.5"
                                                            />
                                                        )}
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
                                                        <span className={event.is_done ? "line-through opacity-60" : ""}>
                                                            {event.title}
                                                        </span>
                                                    </div>
                                                );
                                            })}

                                        {dayEvents.length > 3 && (
                                            <div className="text-primary-500 font-semibold text-xs cursor-pointer hover:underline px-2 py-1">
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
