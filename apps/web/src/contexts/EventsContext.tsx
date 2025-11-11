import React, { createContext, useContext, useState, useEffect } from "react";
import { eventService } from "../services";

type EventsContextType = {
    events: EventFormData[];
    fetchEvents: (start_date: string, end_date: string) => void;
};

// Create Context
const EventsContext = createContext<EventsContextType | undefined>(undefined);

// Custom Hook for consuming the context
export const useEvents = () => {
    const context = useContext(EventsContext);
    if (!context) {
        throw new Error("useEvents must be used within an EventsProvider");
    }
    return context;
};

// Provider Component
export const EventsProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [events, setEvents] = useState<EventFormData[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDateRange = (date: Date) => {
        // Replace with your logic to get the date range
        return {
            start_date: "2024-01-01",
            end_date: "2024-01-31",
        };
    };

    useEffect(() => {
        // Automatically fetch events when component mounts
        const { start_date, end_date } = getDateRange(currentDate);
        fetchEvents(start_date, end_date);
    }, []);

    // Function to fetch events
    const fetchEvents = async (start_date: any, end_date: any) => {
        const events = await eventService.getEventsForPeriod(
            start_date,
            end_date,
        );

        setEvents(
            events.map((event: EventFormData) => ({
                ...event,
                // Ensure all required Event type fields are set here, as necessary
            })),
        );
    };

    return (
        <EventsContext.Provider
            value={{
                events,
                fetchEvents,
            }}
        >
            {children}
        </EventsContext.Provider>
    );
};
