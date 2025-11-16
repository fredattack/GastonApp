import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

interface WeekViewProps {
    currentDate: Date;
    events: Event[];
    onTimeSlotClick: (date: Date, hour: number) => void;
    onEventClick: (event: Event) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
    currentDate,
    events,
    onTimeSlotClick,
    onEventClick,
}) => {
    const [hoveredSlot, setHoveredSlot] = useState<{ day: number; hour: number } | null>(null);

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
    const getEventsForSlot = (day: Date, hour: number): Event[] => {
        return events.filter(event => {
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

    const getEventColor = (type: string) => {
        const colors: Record<string, string> = {
            medical: 'bg-red-500 border-red-600',
            care: 'bg-pink-400 border-pink-500',
            feeding: 'bg-blue-500 border-blue-600',
            appointment: 'bg-purple-500 border-purple-600',
            training: 'bg-green-500 border-green-600',
            social: 'bg-yellow-500 border-yellow-600',
            other: 'bg-gray-500 border-gray-600',
        };
        return colors[type] || 'bg-gray-500 border-gray-600';
    };

    const weekDayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    return (
        <div className="week-view bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header with days */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                {/* Time column header */}
                <div className="p-3 border-r border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                </div>

                {/* Day headers */}
                {weekDays.map((day, index) => (
                    <div
                        key={index}
                        className={`
                            text-center py-3 border-r border-gray-200 dark:border-gray-700
                            ${isToday(day) ? 'bg-primary/10' : ''}
                        `}
                    >
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                            {weekDayNames[index]}
                        </div>
                        <div
                            className={`
                                text-lg font-bold mt-1
                                ${isToday(day)
                                    ? 'bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto'
                                    : 'text-gray-900 dark:text-gray-100'
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
                        className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-200 dark:border-gray-700"
                    >
                        {/* Hour label */}
                        <div className="py-2 px-3 text-xs text-gray-500 dark:text-gray-400 text-right border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            {hour.toString().padStart(2, '0')}:00
                        </div>

                        {/* Day cells */}
                        {weekDays.map((day, dayIndex) => {
                            const slotEvents = getEventsForSlot(day, hour);
                            const isHovered = hoveredSlot?.day === dayIndex && hoveredSlot?.hour === hour;
                            const isCurrentHour = isToday(day) && hour === getCurrentHour();

                            return (
                                <div
                                    key={dayIndex}
                                    className={`
                                        min-h-[60px] p-1 border-r border-gray-200 dark:border-gray-700
                                        hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors
                                        ${isCurrentHour ? 'bg-primary/5' : ''}
                                        relative
                                    `}
                                    onClick={() => onTimeSlotClick(day, hour)}
                                    onMouseEnter={() => setHoveredSlot({ day: dayIndex, hour })}
                                    onMouseLeave={() => setHoveredSlot(null)}
                                >
                                    {/* Current time indicator */}
                                    {isCurrentHour && (
                                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary z-10" />
                                    )}

                                    {/* Events */}
                                    <div className="space-y-1">
                                        {slotEvents.map((event, idx) => (
                                            <div
                                                key={event.id || idx}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEventClick(event);
                                                }}
                                                className={`
                                                    text-xs px-2 py-1 rounded border-l-2 cursor-pointer
                                                    ${getEventColor(event.type)} text-white
                                                    hover:opacity-80 transition-opacity
                                                    truncate
                                                `}
                                                title={`${event.title} - ${event.pets?.map(p => p.name).join(', ')}`}
                                            >
                                                <div className="font-semibold truncate">{event.title}</div>
                                                {event.pets && event.pets.length > 0 && (
                                                    <div className="text-xs opacity-90 truncate">
                                                        {event.pets.map(p => p.name).join(', ')}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Hover indicator */}
                                    {isHovered && slotEvents.length === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs opacity-50">
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
