import axiosClient from "../providers/apiClientProvider/axiosClient";

export default class RestEventRepository {
    /**
     * Fetch events within a specific period.
     * @param start_date - The start date of the period (ISO string).
     * @param end_date - The end date of the period (ISO string).
     * @returns Promise<any[]> - List of events within the period.
     */
    async fetchEventsForPeriod(
        start_date: string,
        end_date: string,
    ): Promise<any[]> {
        if (!start_date || !end_date) {
            throw new Error("Both start_date and end_date are required.");
        }

        try {
            const response: any = await axiosClient.get("events/for-calendar", {
                params: {
                    filters: {
                        start_date,
                        end_date,
                    },
                },
            });
            return response.data.data;
        } catch (error: any) {
            console.error("Error fetching events for period:", error);
            throw new Error(`Failed to fetch events: ${error.message}`);
        }
    }

    /**
     * Add a new event.
     * @returns Promise<string> - ID of the created event.
     * @param payload
     */
    async changeDoneStatus(payload: any): Promise<string> {
        try {
            const response: any = await axiosClient.post(
                "events/change-done-status",
                payload,
            );
            return response.data.id;
        } catch (error: any) {
            console.error("Error adding event:", error);
            throw new Error(`Failed to add event: ${error.message}`);
        }
    }

    /**
     * Update an existing event.
     * @param event
     * @param withRecurrences
     * @param date
     * @returns Promise<void>
     */
    async update(
        event: EventFormData,
        withRecurrences: boolean = false,
        date: string | Date | null = null,
    ): Promise<void> {
        console.log("date", date);
        try {
            await axiosClient.put(
                `events/${event.id ?? event.master_id}?with_recurrences=${withRecurrences}&date=${date}`,
                event,
            );
        } catch (error: any) {
            console.error("Error updating event:", error);
            throw new Error(`Failed to update event: ${error.message}`);
        }
    }

    /**
     * Delete an event.
     * @param eventId - ID of the event to delete.
     * @returns Promise<void>
     */
    async deleteEvent(eventId: string): Promise<void> {
        try {
            await axiosClient.delete(`events/${eventId}`);
        } catch (error: any) {
            console.error("Error deleting event:", error);
            throw new Error(`Failed to delete event: ${error.message}`);
        }
    }
}
