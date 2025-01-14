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
     * @param startDate - The start date of the period (ISO string).
     * @param endDate - The end date of the period (ISO string).
     * @returns Promise<any[]> - List of events within the period.
     */
    async fetchEventsForPeriod(startDate: string, endDate: string): Promise<any[]> {


        if (!startDate || !endDate) {
            throw new Error("Both startDate and endDate are required.");
        }

        try {
            const response: AxiosResponse = await this.apiClient.get(this.endpoint + '/for-calendar', {
                params: {
                    filters:{
                        start_date: startDate,
                        end_date: endDate,
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
