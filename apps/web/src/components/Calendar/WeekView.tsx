// @ts-nocheck

import React, { useState } from "react";
import { Clock, CheckCircle } from "@phosphor-icons/react";
import { getEventTypeColor } from "../../constants/eventColors";

interface WeekViewProps {
    currentDate: Date;
    events: EventFormData[];
    onTimeSlotClick: (date: Date, hour: number) => void;
    onEventClick: (event: EventFormData) => void;
    onEventMove?: (event: EventFormData, newDate: Date) => void;
    onEventResize?: (event: EventFormData, newDuration: number) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
    currentDate,
    events,
    onTimeSlotClick,
    onEventClick,
    onEventMove,
    onEventResize,
}) => {
    const [hoveredSlot, setHoveredSlot] = useState<{
        day: number;
        hour: number;
    } | null>(null);
    const [draggedEvent, setDraggedEvent] = useState<Event | null>(null);

    // Generate week days starting from Monday
    const getWeekDays = (date: Date): Date[] => {
        const days: Date[] = [];
        const currentDay = date.getDay(); // 0 = Sunday, 1 = Monday, ...
        const monday = new Date(date);

        // Adjust to Monday
        const diff = currentDay === 0 ? -6 : 1 - currentDay;
        monday.setDate(date.getDate() + diff);

        // Generate 7 days
        for (let i = 0; i < 7; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            days.push(day);
        }

        return days;
    };

    const weekDays = getWeekDays(currentDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Get events for a specific day and hour
    const getEventsForSlot = (day: Date, hour: number): EventFormData[] => {
        return events.filter((event) => {
            const eventDate = new Date(event.start_date);
            return (
                eventDate.getDate() === day.getDate() &&
                eventDate.getMonth() === day.getMonth() &&
                eventDate.getFullYear() === day.getFullYear() &&
                eventDate.getHours() === hour
            );
        });
    };

    const isToday = (date: Date): boolean => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const getCurrentHour = (): number => {
        return new Date().getHours();
    };

    const weekDayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

    return (
        <div className="week-view bg-lin-0 rounded-[20px] shadow-ds-md border border-lin-4 overflow-hidden">
            {/* Header with days */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-lin-4 sticky top-0 bg-lin-0 z-10">
                {/* Time column header */}
                <div className="p-3 border-r border-lin-4 flex items-center justify-center">
                    <Clock size={20} className="text-[#8E8E8E]" />
                </div>

                {/* Day headers */}
                {weekDays.map((day, index) => (
                    <div
                        key={index}
                        className={`
                            text-center py-3 border-r border-lin-4
                            ${isToday(day) ? "bg-primary/10" : ""}
                        `}
                    >
                        <div className="text-xs font-semibold text-[#6B6B6B] uppercase">
                            {weekDayNames[index]}
                        </div>
                        <div
                            className={`
                                text-lg font-bold mt-1
                                ${
                                    isToday(day)
                                        ? "bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                                        : "text-[#1A1A1A]"
                                }
                            `}
                        >
                            {day.getDate()}
                        </div>
                    </div>
                ))}
            </div>

            {/* Time grid */}
            <div className="overflow-y-auto max-h-[600px]">
                {hours.map((hour) => (
                    <div
                        key={hour}
                        className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-lin-4"
                    >
                        {/* Hour label */}
                        <div className="py-2 px-3 text-xs tabular-nums text-[#6B6B6B] text-right border-r border-lin-4 bg-lin-1">
                            {hour.toString().padStart(2, "0")}:00
                        </div>

                        {/* Day cells */}
                        {weekDays.map((day, dayIndex) => {
                            const slotEvents = getEventsForSlot(day, hour);
                            const isHovered =
                                hoveredSlot?.day === dayIndex &&
                                hoveredSlot?.hour === hour;
                            const isCurrentHour =
                                isToday(day) && hour === getCurrentHour();

                            return (
                                <div
                                    key={dayIndex}
                                    className={`
                                        min-h-[60px] p-1 border-r border-lin-4
                                        hover:bg-primary-50 cursor-pointer transition-colors
                                        ${isCurrentHour ? "bg-primary/5" : ""}
                                        relative
                                    `}
                                    onClick={() => onTimeSlotClick(day, hour)}
                                    onMouseEnter={() =>
                                        setHoveredSlot({ day: dayIndex, hour })
                                    }
                                    onMouseLeave={() => setHoveredSlot(null)}
                                >
                                    {/* Current time indicator */}
                                    {isCurrentHour && (
                                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-secondary-400 z-10" />
                                    )}

                                    {/* Events */}
                                    <div className="space-y-1">
                                        {slotEvents.map((event, idx) => {
                                            const typeColors = getEventTypeColor(event.type);
                                            return (
                                                <div
                                                    key={event.id || idx}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEventClick(event);
                                                    }}
                                                    className={`
                                                        text-xs px-2 py-1 rounded border-l-2 cursor-pointer
                                                        ${typeColors.bgLight} ${typeColors.text} ${typeColors.border}
                                                        hover:opacity-80 transition-opacity
                                                        truncate
                                                    `}
                                                    title={`${event.title} - ${event.pets?.map((p) => p.name).join(", ")}`}
                                                >
                                                    <div className="font-semibold truncate flex items-center gap-1">
                                                        {event.is_done && (
                                                            <CheckCircle
                                                                size={12}
                                                                weight="fill"
                                                                className="text-success shrink-0"
                                                            />
                                                        )}
                                                        <span className={event.is_done ? "line-through opacity-60" : ""}>
                                                            {event.title}
                                                        </span>
                                                    </div>
                                                    {event.pets &&
                                                        event.pets.length > 0 && (
                                                            <div className="text-xs opacity-90 truncate">
                                                                {event.pets
                                                                    .map(
                                                                        (p) =>
                                                                            p.name,
                                                                    )
                                                                    .join(", ")}
                                                            </div>
                                                        )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Hover indicator */}
                                    {isHovered && slotEvents.length === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center text-[#8E8E8E] text-xs opacity-50">
                                            +
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeekView;
