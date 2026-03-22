import React, { useState } from "react";

import {
    CaretDown,
    CaretUp,
    Pill,
    Heart,
    ForkKnife,
    CalendarCheck,
    Barbell,
    Users,
    Clock,
    CheckSquare,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

import EventDropdown from "./EventDropdown";

const EVENT_TYPE_STYLES: Record<string, { Icon: Icon; color: string; bg: string }> = {
    medical: {
        Icon: Pill,
        color: "text-danger",
        bg: "danger",
    },
    care: {
        Icon: Heart,
        color: "text-danger-light",
        bg: "danger-light",
    },
    feeding: {
        Icon: ForkKnife,
        color: "text-info",
        bg: "info",
    },
    appointment: {
        Icon: CalendarCheck,
        color: "text-blue-500",
        bg: "blue-100",
    },
    training: {
        Icon: Barbell,
        color: "text-success",
        bg: "success",
    },
    social: {
        Icon: Users,
        color: "text-warning",
        bg: "warning",
    },
};

const EventCard: React.FC<{
    event: Event;
    onRefresh: () => void;
}> = ({ event, onRefresh }) => {
    const { title, type, start_date, end_date, notes } = event;

    const [isExpanded, setIsExpanded] = useState(false);
    const donestyle = event.is_done
        ? {
              class: "text-green-600",
              hasIcon: true,
          }
        : { class: "text-red-600", hasIcon: false };
    const style =
        EVENT_TYPE_STYLES[type as keyof typeof EVENT_TYPE_STYLES] || null;

    const handleDelete = () => {
        if (onRefresh) {
            onRefresh();
        }
    };

    return (
        <div className=" overflow-visible flex flex-col border rounded-md">
            <a href="#" />

            <div className="mb-auto border grid grid-cols-12 py-3">
                <div className="text-xs flex items-center justify-center  col-span-2 hover:bg-white  transition duration-500 ease-in-out">
                    <div
                        className={`btn btn-outline-${style?.bg} flex items-center justify-center w-9 h-9 p-0 rounded-full`}
                    >
                        {style && (
                            <style.Icon
                                size={20}
                                className={style.color}
                            />
                        )}
                    </div>
                </div>
                <div className="col-span-8 px-3 overflow-hidden">
                    <div className="font-medium  hover:text-indigo-600 transition duration-500 ease-in-out inline-block ">
                        {title}
                    </div>
                    <p className="pets-list text-gray-500 text-sm whitespace-normal break-normal overflow-hidden">
                        {event.pets.map((pet) => pet.name).join(", ") ||
                            "Inconnu"}
                    </p>
                </div>
                <div
                    className="text-xs flex items-center justify-center  transition duration-500 ease-in-out"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? (
                        <CaretUp size={16} className="text-gray-500" />
                    ) : (
                        <CaretDown size={16} className="text-gray-500" />
                    )}
                </div>
            </div>
            {isExpanded && (
                <div className="px-6 py-4 mb-auto text-sm">
                    <p className="text-xs">
                        <strong>Du :</strong>{" "}
                        {start_date
                            ? `${new Date(start_date).toLocaleDateString("fr-FR", { timeZone: "UTC" })} ${new Date(start_date).toLocaleTimeString("fr-FR", { timeZone: "UTC" })}`
                            : "N/A"}
                    </p>

                    {event.type !== "feeding" && (
                        <p className="text-xs">
                            <strong>Au :</strong>{" "}
                            {end_date
                                ? new Date(end_date).toLocaleDateString("fr-FR")
                                : "N/A"}
                        </p>
                    )}
                    <p className="italic text-xs">{notes}</p>
                </div>
            )}
            <div className="grid grid-cols-12 bg-gray-100">
                <div
                    className={`p-2 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center justify-center col-span-2 ${donestyle.class}`}
                >
                    {donestyle.hasIcon && (
                        <CheckSquare size={24} className="mr-2" />
                    )}
                </div>
                <div className="p-2 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                    <Clock size={16} className="mr-2" />
                </div>
                <div className="p-2 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center col-span-7">
                    <span className="ml-1">
                        {start_date
                            ? `${new Date(start_date).toLocaleDateString("fr-FR", { timeZone: "UTC" })} ${new Date(start_date).toLocaleTimeString("fr-FR", { timeZone: "UTC" })}`
                            : "N/A"}
                    </span>
                </div>

                {/* EventDropdown */}
                <EventDropdown
                    event={event}
                    onChange={() => handleDelete()}
                    onEdit={() => {}}
                    onViewDetails={() => {}}
                />
            </div>
        </div>
    );
};

export default EventCard;
