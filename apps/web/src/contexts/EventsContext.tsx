import React, { createContext, useContext, useState, useEffect } from "react";
import { eventService } from "../services";

type EventsContextType = {
    events: EventFormData[];
    isLoading: boolean;
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
    const [isLoading, setIsLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDateRange = (date: Date) => {
        // Get first day of the month
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

        // Get last day of the month
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        return {
            start_date: firstDay.toISOString().split("T")[0],
            end_date: lastDay.toISOString().split("T")[0],
        };
    };

    useEffect(() => {
        // Automatically fetch events when component mounts
        const { start_date, end_date } = getDateRange(currentDate);
        fetchEvents(start_date, end_date);
    }, []);

    // Function to fetch events
    const fetchEvents = async (start_date: any, end_date: any) => {
        setIsLoading(true);
        try {
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <EventsContext.Provider
            value={{
                events,
                isLoading,
                fetchEvents,
            }}
        >
            {children}
        </EventsContext.Provider>
    );
};
