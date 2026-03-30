// @ts-nocheck

import React, { useState, useRef, useEffect } from "react";
import { Clock, Plus, DotsSixVertical, CalendarBlank, CheckCircle } from "@phosphor-icons/react";
import { getEventTypeColor } from "../../constants/eventColors";

interface DayViewProps {
    currentDate: Date;
    events: EventFormData[];
    onTimeSlotClick: (date: Date, hour: number) => void;
    onEventClick: (event: EventFormData) => void;
    onEventMove?: (event: EventFormData, newDate: Date) => void;
    onEventResize?: (event: EventFormData, newDuration: number) => void;
}

const DayView: React.FC<DayViewProps> = ({
    currentDate,
    events,
    onTimeSlotClick,
    onEventClick,
    onEventMove,
    onEventResize,
}) => {
    const [hoveredHour, setHoveredHour] = useState<number | null>(null);
    const [draggedEvent, setDraggedEvent] = useState<Event | null>(null);
    const [resizingEvent, setResizingEvent] = useState<Event | null>(null);
    const [resizeStartY, setResizeStartY] = useState<number>(0);
    const currentHourRef = useRef<HTMLDivElement>(null);

    const hours = Array.from({ length: 24 }, (_, i) => i);

    useEffect(() => {
        if (currentHourRef.current && isToday()) {
            currentHourRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, []);

    const getEventsForHour = (hour: number): EventFormData[] => {
        return events.filter((event) => {
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

    const getCurrentTimePosition = () => {
        const minutes = getCurrentMinutes();
        return (minutes / 60) * 100;
    };

    const handleDragStart = (e: React.DragEvent, event: Event) => {
        e.stopPropagation();
        setDraggedEvent(event);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", e.currentTarget.innerHTML);
        (e.currentTarget as HTMLElement).style.opacity = "0.5";
    };

    const handleDragEnd = (e: React.DragEvent) => {
        (e.currentTarget as HTMLElement).style.opacity = "1";
        setDraggedEvent(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, hour: number) => {
        e.preventDefault();
        e.stopPropagation();

        if (draggedEvent && onEventMove) {
            const newDate = new Date(currentDate);
            newDate.setHours(hour, 0, 0, 0);
            onEventMove(draggedEvent, newDate);
        }
        setDraggedEvent(null);
    };

    const handleResizeStart = (e: React.MouseEvent, event: Event) => {
        e.stopPropagation();
        e.preventDefault();
        setResizingEvent(event);
        setResizeStartY(e.clientY);
    };

    const handleResizeMove = (e: MouseEvent) => {
        if (!resizingEvent) return;

        const deltaY = e.clientY - resizeStartY;
        const hourHeight = 80;
        const hoursChanged = Math.round(deltaY / hourHeight);

        if (hoursChanged !== 0) {
            const startDate = new Date(resizingEvent.start_date);
            const endDate = resizingEvent.end_date
                ? new Date(resizingEvent.end_date)
                : new Date(startDate.getTime() + 60 * 60 * 1000);
            const currentDuration =
                (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
            const newDuration = Math.max(1, currentDuration + hoursChanged);

            if (onEventResize && newDuration !== currentDuration) {
                onEventResize(resizingEvent, newDuration);
                setResizeStartY(e.clientY);
            }
        }
    };

    const handleResizeEnd = () => {
        setResizingEvent(null);
        setResizeStartY(0);
    };

    useEffect(() => {
        if (resizingEvent) {
            document.addEventListener("mousemove", handleResizeMove);
            document.addEventListener("mouseup", handleResizeEnd);
            return () => {
                document.removeEventListener("mousemove", handleResizeMove);
                document.removeEventListener("mouseup", handleResizeEnd);
            };
        }
    }, [resizingEvent, resizeStartY]);

    return (
        <div className="day-view bg-lin-0 rounded-[20px] shadow-ds-md border border-lin-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-lin-4 bg-lin-1">
                <div>
                    <h3 className="text-lg font-bold text-[#1A1A1A]">
                        {currentDate.toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </h3>
                    {isToday() && (
                        <p className="text-sm text-primary font-semibold">
                            Aujourd'hui
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                    <Clock size={16} />
                    {events.length === 0 ? (
                        <span className="flex items-center gap-1.5">
                            <CalendarBlank size={14} className="text-[#8E8E8E]" />
                            <span className="text-[#8E8E8E]">Aucun événement prévu</span>
                        </span>
                    ) : (
                        <span>
                            {events.length} événement{events.length > 1 ? "s" : ""}
                        </span>
                    )}
                </div>
            </div>

            {/* Timeline */}
            <div className="overflow-y-auto max-h-[600px]">
                {hours.map((hour) => {
                    const hourEvents = getEventsForHour(hour);
                    const isHovered = hoveredHour === hour;
                    const isCurrentHour =
                        isToday() && hour === getCurrentHour();

                    return (
                        <div
                            key={hour}
                            ref={isCurrentHour ? currentHourRef : null}
                            className="flex border-b border-lin-4 relative"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, hour)}
                        >
                            {/* Hour label */}
                            <div className="w-20 flex-shrink-0 py-3 px-3 text-sm tabular-nums text-[#6B6B6B] text-right bg-lin-1">
                                {hour.toString().padStart(2, "0")}:00
                            </div>

                            {/* Event area */}
                            <div
                                className={`
                                    flex-1 min-h-[80px] p-2
                                    hover:bg-primary-50 cursor-pointer transition-colors
                                    ${isCurrentHour ? "bg-primary/5" : ""}
                                    ${draggedEvent ? "bg-primary/10" : ""}
                                    relative
                                `}
                                onClick={() =>
                                    onTimeSlotClick(currentDate, hour)
                                }
                                onMouseEnter={() => setHoveredHour(hour)}
                                onMouseLeave={() => setHoveredHour(null)}
                            >
                                {/* Current time indicator */}
                                {isCurrentHour && (
                                    <div
                                        className="absolute left-0 right-0 h-0.5 bg-secondary-400 z-10 flex items-center"
                                        style={{
                                            top: `${getCurrentTimePosition()}%`,
                                        }}
                                    >
                                        <div className="w-3 h-3 rounded-full bg-secondary-400 -ml-1.5 shadow-md" />
                                        <div className="flex-1 h-full" />
                                    </div>
                                )}

                                {/* Events */}
                                <div className="space-y-2">
                                    {hourEvents.map((event, idx) => {
                                        const typeColors = getEventTypeColor(event.type);
                                        return (
                                            <div
                                                key={event.id || idx}
                                                draggable={!!onEventMove}
                                                onDragStart={(e) =>
                                                    onEventMove &&
                                                    handleDragStart(e, event)
                                                }
                                                onDragEnd={handleDragEnd}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEventClick(event);
                                                }}
                                                className={`
                                                    p-3 rounded-lg border-l-4 cursor-move
                                                    ${typeColors.bgLight} ${typeColors.text} ${typeColors.border}
                                                    hover:opacity-90 transition-all hover:shadow-md
                                                    ${draggedEvent?.id === event.id ? "opacity-50" : ""}
                                                    relative group
                                                `}
                                            >
                                                {/* Drag handle */}
                                                {onEventMove && (
                                                    <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-50 transition-opacity">
                                                        <DotsSixVertical
                                                            size={16}
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-sm mb-1 flex items-center gap-1">
                                                            {event.is_done && (
                                                                <CheckCircle
                                                                    size={14}
                                                                    weight="fill"
                                                                    className="text-success shrink-0"
                                                                />
                                                            )}
                                                            <span className={event.is_done ? "line-through opacity-60" : ""}>
                                                                {event.title}
                                                            </span>
                                                        </div>
                                                        {event.pets &&
                                                            event.pets.length >
                                                                0 && (
                                                                <div className="text-xs opacity-90 mb-2">
                                                                    <Clock
                                                                        size={12}
                                                                        className="mr-1 inline"
                                                                    />
                                                                    {new Date(
                                                                        event.start_date,
                                                                    ).toLocaleTimeString(
                                                                        "fr-FR",
                                                                        {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                        },
                                                                    )}
                                                                    {" • "}
                                                                    {event.pets
                                                                        .map(
                                                                            (p) =>
                                                                                p.name,
                                                                        )
                                                                        .join(", ")}
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
                                                            {event.end_date &&
                                                                new Date(
                                                                    event.end_date,
                                                                ).getHours() !==
                                                                    new Date(
                                                                        event.start_date,
                                                                    ).getHours() && (
                                                                    <>
                                                                        →{" "}
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
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Resize handle */}
                                                {onEventResize && (
                                                    <div
                                                        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
                                                        onMouseDown={(e) =>
                                                            handleResizeStart(
                                                                e,
                                                                event,
                                                            )
                                                        }
                                                    >
                                                        <div className="h-1 bg-white/50 mx-auto w-12 rounded-full mt-0.5" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Hover indicator */}
                                {isHovered &&
                                    hourEvents.length === 0 &&
                                    !draggedEvent && (
                                        <div className="absolute inset-0 flex items-center justify-center text-[#8E8E8E] opacity-50">
                                            <Plus size={24} />
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
