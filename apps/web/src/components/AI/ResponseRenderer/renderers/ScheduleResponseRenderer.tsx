import React from "react";
import { CalendarBlank, Clock } from "@phosphor-icons/react";
import DataBlockRenderer from "../DataBlockRenderer";

interface ScheduleResponseRendererProps {
    content: string;
    blocks?: StructuredBlock[];
    aiResponse?: AIResponse;
}

const ScheduleResponseRenderer: React.FC<ScheduleResponseRendererProps> = ({
    content,
    blocks,
}) => {
    return (
        <div className="space-y-3">
            {content && (
                <div className="flex items-start gap-2">
                    <CalendarBlank
                        size={18}
                        className="text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                        {content}
                    </p>
                </div>
            )}
            {blocks && blocks.length > 0 && (
                <div className="space-y-2">
                    {blocks.map((block) => {
                        if (block.type === "schedule_calendar") {
                            return (
                                <ScheduleCalendar
                                    key={block.id}
                                    events={
                                        block.data.events as Array<{
                                            title: string;
                                            date: string;
                                            time: string;
                                            type: string;
                                        }>
                                    }
                                />
                            );
                        }
                        return (
                            <DataBlockRenderer key={block.id} block={block} />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const ScheduleCalendar: React.FC<{
    events: Array<{
        title: string;
        date: string;
        time: string;
        type: string;
    }>;
}> = ({ events }) => {
    const getTypeColor = (type: string) => {
        switch (type) {
            case "medical":
                return "border-l-red-400";
            case "feeding":
                return "border-l-green-400";
            case "appointment":
                return "border-l-blue-400";
            case "training":
                return "border-l-purple-400";
            default:
                return "border-l-gray-400";
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
                {events.map((event, index) => (
                    <div
                        key={index}
                        className={`border-l-3 pl-3 py-1.5 ${getTypeColor(event.type)}`}
                    >
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {event.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <CalendarBlank size={12} />
                            <span>{event.date}</span>
                            <Clock size={12} />
                            <span>{event.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScheduleResponseRenderer;
