import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPlus } from '@fortawesome/free-solid-svg-icons';

interface DayViewProps {
    currentDate: Date;
    events: Event[];
    onTimeSlotClick: (date: Date, hour: number) => void;
    onEventClick: (event: Event) => void;
}

const DayView: React.FC<DayViewProps> = ({
    currentDate,
    events,
    onTimeSlotClick,
    onEventClick,
}) => {
    const [hoveredHour, setHoveredHour] = useState<number | null>(null);
    const currentHourRef = useRef<HTMLDivElement>(null);

    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Scroll to current hour on mount
    useEffect(() => {
        if (currentHourRef.current && isToday()) {
            currentHourRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, []);

    // Get events for a specific hour
    const getEventsForHour = (hour: number): Event[] => {
        return events.filter(event => {
            const eventDate = new Date(event.start_date);
            return (
                eventDate.getDate() === currentDate.getDate() &&
                eventDate.getMonth() === currentDate.getMonth() &&
                eventDate.getFullYear() === currentDate.getFullYear() &&
                eventDate.getHours() === hour
            );
        });
    };

    const isToday = (): boolean => {
        const today = new Date();
        return (
            currentDate.getDate() === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        );
    };

    const getCurrentHour = (): number => {
        return new Date().getHours();
    };

    const getCurrentMinutes = (): number => {
        return new Date().getMinutes();
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

    // Calculate position of current time indicator
    const getCurrentTimePosition = () => {
        const minutes = getCurrentMinutes();
        return (minutes / 60) * 100; // Percentage within the hour
    };

    return (
        <div className="day-view bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {currentDate.toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </h3>
                    {isToday() && (
                        <p className="text-sm text-primary font-semibold">Aujourd'hui</p>
                    )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <FontAwesomeIcon icon={faClock} />
                    <span>{events.length} événement{events.length > 1 ? 's' : ''}</span>
                </div>
            </div>

            {/* Timeline */}
            <div className="overflow-y-auto max-h-[600px]">
                {hours.map((hour) => {
                    const hourEvents = getEventsForHour(hour);
                    const isHovered = hoveredHour === hour;
                    const isCurrentHour = isToday() && hour === getCurrentHour();

                    return (
                        <div
                            key={hour}
                            ref={isCurrentHour ? currentHourRef : null}
                            className="flex border-b border-gray-200 dark:border-gray-700 relative"
                        >
                            {/* Hour label */}
                            <div className="w-20 flex-shrink-0 py-3 px-3 text-sm text-gray-500 dark:text-gray-400 text-right bg-gray-50 dark:bg-gray-900">
                                {hour.toString().padStart(2, '0')}:00
                            </div>

                            {/* Event area */}
                            <div
                                className={`
                                    flex-1 min-h-[80px] p-2
                                    hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors
                                    ${isCurrentHour ? 'bg-primary/5' : ''}
                                    relative
                                `}
                                onClick={() => onTimeSlotClick(currentDate, hour)}
                                onMouseEnter={() => setHoveredHour(hour)}
                                onMouseLeave={() => setHoveredHour(null)}
                            >
                                {/* Current time indicator */}
                                {isCurrentHour && (
                                    <div
                                        className="absolute left-0 right-0 h-0.5 bg-primary z-10 flex items-center"
                                        style={{ top: `${getCurrentTimePosition()}%` }}
                                    >
                                        <div className="w-3 h-3 rounded-full bg-primary -ml-1.5 shadow-md" />
                                        <div className="flex-1 h-full" />
                                    </div>
                                )}

                                {/* Events */}
                                <div className="space-y-2">
                                    {hourEvents.map((event, idx) => (
                                        <div
                                            key={event.id || idx}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEventClick(event);
                                            }}
                                            className={`
                                                p-3 rounded-lg border-l-4 cursor-pointer
                                                ${getEventColor(event.type)} text-white
                                                hover:opacity-90 transition-all hover:shadow-md
                                            `}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-sm mb-1">
                                                        {event.title}
                                                    </div>
                                                    {event.pets && event.pets.length > 0 && (
                                                        <div className="text-xs opacity-90 mb-2">
                                                            <FontAwesomeIcon icon={faClock} className="mr-1" />
                                                            {new Date(event.start_date).toLocaleTimeString('fr-FR', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                            {' • '}
                                                            {event.pets.map(p => p.name).join(', ')}
                                                        </div>
                                                    )}
                                                    {event.notes && (
                                                        <div className="text-xs opacity-80 line-clamp-2">
                                                            {event.notes}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-2 opacity-50">
                                                    <div className="text-xs">
                                                        {event.end_date && new Date(event.end_date).getHours() !== new Date(event.start_date).getHours() && (
                                                            <>
                                                                → {new Date(event.end_date).toLocaleTimeString('fr-FR', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Hover indicator */}
                                {isHovered && hourEvents.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 opacity-50">
                                        <FontAwesomeIcon icon={faPlus} size="lg" />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DayView;
