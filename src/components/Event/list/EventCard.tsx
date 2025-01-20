import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faAngleUp,
    faPills, // medical
    faHeart, // care
    faUtensils,
    faBone, // feeding
    faCalendarCheck, // appointment
    faDumbbell, // training
    faUsers,
    faClock,
    faCheckSquare, // social
} from "@fortawesome/free-solid-svg-icons";
import { useIcons } from "../../../providers/FontawesomeProvider";
import EventDropdown from "./EventDropdown";

const EVENT_TYPE_STYLES = {
    medical: {
        icon: faPills,
        color: "text-danger",
        bg: "danger",
    },
    care: {
        icon: faHeart,
        color: "text-danger-light",
        bg: "danger-light",
    },
    feeding: {
        icon: faUtensils,
        color: "text-info",
        bg: "info",
    },
    appointment: {
        icon: faCalendarCheck,
        color: "text-blue-500",
        bg: "blue-100",
    },
    training: {
        icon: faDumbbell,
        color: "text-success",
        bg: "success",
    },
    social: {
        icon: faUsers,
        color: "text-warning",
        bg: "warning",
    },
};

const EventCard: React.FC<{
    event: Event;
}> = ({ event }) => {
    const icons = useIcons();

    const { title, type, start_date, end_date, notes } = event;

    const [isExpanded, setIsExpanded] = useState(false);
    const donestyle = event.is_done
        ? {
              class: "text-green-600",
              icon: faCheckSquare,
          }
        : { class: "text-red-600" };
    const style =
        EVENT_TYPE_STYLES[type as keyof typeof EVENT_TYPE_STYLES] || {};
    return (
        <div className=" overflow-visible flex flex-col border rounded-md">
            <a href="#" />

            <div className="mb-auto border grid grid-cols-12 py-3">
                <div className="text-xs flex items-center justify-center  col-span-2 hover:bg-white  transition duration-500 ease-in-out">
                    <div
                        className={`btn btn-outline-${style.bg} flex items-center justify-center w-9 h-9 p-0 rounded-full`}
                    >
                        <FontAwesomeIcon
                            icon={style.icon}
                            className={`${style.color}`}
                        />
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
                    <FontAwesomeIcon
                        icon={isExpanded ? faAngleUp : faAngleDown}
                        className="text-gray-500"
                    />
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
                    {donestyle.icon && (
                        <FontAwesomeIcon
                            icon={donestyle.icon}
                            size="lg"
                            className="mr-2"
                        />
                    )}
                </div>
                <div className="p-2 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                    <FontAwesomeIcon icon={faClock} className="mr-2" />
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
                    onDelete={() => {}}
                    onEdit={() => {}}
                    onViewDetails={() => {}}
                />
            </div>
        </div>
    );
};

export default EventCard;
