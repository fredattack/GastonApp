import React, { useState } from "react";
import Toggle from "../../Form/Toggle";
import { eventService } from "../../../services";
import { useToast } from "../../../providers/ToastProvider";
import EventTable from "./EventTable";

interface EventSummaryProps {
    events: EventFormData[] | Event[];
}

const PERIODES = {
    MORNING: "morning",
    AFTERNOON: "afternoon",
    OTHER: "other",
    EVENING: "evening",
    ALL: "all",
};
const EventSummary: React.FC<EventSummaryProps> = ({ events }) => {
    const [periode, setPeriode] = useState(PERIODES.ALL);
    console.log("Events", events);
    const { addToast } = useToast();
    const isInPeriod = (start_date: Date | string) => {
        const date = new Date(start_date);
        // console.log('date', date);
        switch (periode) {
            case PERIODES.MORNING:
                return date.getHours() >= 6 && date.getHours() < 12;
            case PERIODES.AFTERNOON:
                return date.getHours() >= 12 && date.getHours() < 17;
            case PERIODES.EVENING:
                return date.getHours() >= 17 && date.getHours() < 20;
            case PERIODES.OTHER:
                return date.getHours() >= 20 || date.getHours() < 6;
            default:
                return true;
        }
    };

    const groupedEvents = Object.values(
        (events as Event[])
            .filter((event) => isInPeriod(event.start_date))
            .reduce(
                (acc, event) => {
                    event.pets.forEach((pet) => {
                        if (!acc[pet.id]) {
                            acc[pet.id] = {
                                pet: {
                                    name: pet.name,
                                    // @ts-ignore
                                    pivot: pet.pivot ?? {},
                                },
                                events: [],
                            };
                        }
                        if (isInPeriod(event.start_date)) {
                            acc[pet.id].events.push({
                                id: event.id,
                            });
                        }
                    });
                    return acc;
                },
                {} as Record<
                    string,
                    {
                        pet: {
                            name: string;
                            pivot?: {
                                item?: string;
                                quantity?: number;
                            };
                        };
                        events: {
                            id: string;
                        }[];
                    }
                >,
            ),
    );

    const handleSetPeriode = (periode: string) => () => {
        setPeriode(periode);
    };

    const handleChangeDoneStatus = async (event: Event) => {
        try {
            const resp = await eventService.changeDoneStatus(event);
            console.log("resp", resp);
            addToast({
                message: "Event successfully updated!",
                type: "success",
            });
        } catch (error) {
            console.error("Error updating event:", error);
            addToast({
                message: "Error updating event!",
                type: "error",
            });
        }
    };

    const renderEventToggle = (event: Event) => (
        <div className="my-1" key={event.id}>
            <Toggle
                label={event.title}
                initialState={event.is_done}
                onChange={(isToggled) => handleChangeDoneStatus(event)}
            />
        </div>
    );
    return (
        <div className="event-summary">
            <span className="isolate inline-flex rounded-md shadow-sm m-auto py-2">
                <button
                    type="button"
                    className={`btn-sm relative inline-flex items-center rounded-l-md px-2 py-2 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 ${periode === PERIODES.MORNING ? "bg-gray-300" : "bg-white"}`}
                    onClick={handleSetPeriode(PERIODES.MORNING)}
                >
                    Morning
                </button>
                <button
                    type="button"
                    className={`btn-sm relative inline-flex items-center  px-2 py-2 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 ${periode === PERIODES.AFTERNOON ? "bg-gray-300" : "bg-white"}`}
                    onClick={handleSetPeriode(PERIODES.AFTERNOON)}
                >
                    Afternoon
                </button>
                <button
                    type="button"
                    className={`btn-sm relative inline-flex items-center  px-2 py-2 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 ${periode === PERIODES.EVENING ? "bg-gray-300" : "bg-white"}`}
                    onClick={handleSetPeriode(PERIODES.EVENING)}
                >
                    Evening
                </button>
                <button
                    type="button"
                    className={`btn-sm relative inline-flex items-center  px-2 py-2 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 ${periode === PERIODES.OTHER ? "bg-gray-300" : "bg-white"}`}
                    onClick={handleSetPeriode(PERIODES.OTHER)}
                >
                    Other
                </button>
                <button
                    type="button"
                    className={`btn-sm relative inline-flex items-center rounded-r-md px-2 py-2 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 ${periode === PERIODES.ALL ? "bg-gray-300" : "bg-white"}`}
                    onClick={handleSetPeriode(PERIODES.ALL)}
                >
                    All
                </button>
            </span>
            <div className="pet-summary  p-4 rounded-md shadow-md mb-4  border border-lime-300">
                {(events as Event[]).map(renderEventToggle)}
                <EventTable groupedEvents={groupedEvents} />
            </div>
        </div>
    );
};

export default EventSummary;
