// src/contexts/EventsContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { modelService } from "../services/index";

interface EventsContextType {
    events: Event[];
    refreshEvents: () => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [events, setEvents] = useState<Event[]>([]);

    const fetchEvents = async () => {
        try {
            const data = await modelService.getModels("events");
            setEvents(data);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <EventsContext.Provider
            value={{
                events,
                refreshEvents: fetchEvents,
            }}
        >
            {children}
        </EventsContext.Provider>
    );
};

export const useEvents = (): EventsContextType => {
    const context = useContext(EventsContext);
    if (!context) {
        throw new Error("useEvents must be used within a EventsProvider");
    }
    return context;
};
