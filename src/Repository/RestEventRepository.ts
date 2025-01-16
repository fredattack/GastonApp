import axios, { AxiosInstance, AxiosResponse } from "axios";

export default class RestEventRepository {
    private apiClient: AxiosInstance;
    private endpoint: string;

    constructor() {
        const apiUrl="";
       const baseUrl = import.meta.env.VITE_API_URL + apiUrl;
        this.endpoint = "/events";
        this.apiClient = axios.create({
            baseURL: baseUrl,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    /**
     * Fetch events within a specific period.
     * @param start_date - The start date of the period (ISO string).
     * @param end_date - The end date of the period (ISO string).
     * @returns Promise<any[]> - List of events within the period.
     */
    async fetchEventsForPeriod(start_date: string, end_date: string): Promise<any[]> {


        if (!start_date || !end_date) {
            throw new Error("Both start_date and end_date are required.");
        }

        try {
            const response: AxiosResponse = await this.apiClient.get(this.endpoint + '/for-calendar', {
                params: {
                    filters:{
                        start_date: start_date,
                        end_date: end_date,
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
     * @param eventData - Data for the new event.
     * @returns Promise<string> - ID of the created event.
     */
    async addEvent(eventData: any): Promise<string> {
        try {
            const response: AxiosResponse = await this.apiClient.post(this.endpoint, eventData);
            return response.data.id;
        } catch (error: any) {
            console.error("Error adding event:", error);
            throw new Error(`Failed to add event: ${error.message}`);
        }
    }

    /**
     * Update an existing event.
     * @param eventId - ID of the event to update.
     * @param updatedData - Updated event data.
     * @returns Promise<void>
     */
    async updateEvent(eventId: string, updatedData: any): Promise<void> {
        try {
            await this.apiClient.put(`${this.endpoint}/${eventId}`, updatedData);
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
            await this.apiClient.delete(`${this.endpoint}/${eventId}`);
        } catch (error: any) {
            console.error("Error deleting event:", error);
            throw new Error(`Failed to delete event: ${error.message}`);
        }
    }
}
