import RestEventRepository from "../Repository/RestEventRepository";
export default class EventService {

    private eventRepository: RestEventRepository;

    constructor() {
        this.eventRepository = new RestEventRepository();
    }

    /**
     * Fetch and format events within a specific period, including past recurrences.
     * @param startDate - The start date of the period (ISO string).
     * @param endDate - The end date of the period (ISO string).
     * @param collection - The collection name where events are stored.
     * @returns Promise<EventFormData[]> - List of formatted events.
     */
    async getEventsForPeriod(startDate: string, endDate: string): Promise<EventFormData[]> {
        try {

            return   await this.eventRepository.fetchEventsForPeriod(startDate, endDate);
        } catch (error) {
            console.error("Error fetching events for period:", error);
            throw error;
        }
    }

}
