import RestEventRepository from "../Repository/RestEventRepository";
export default class EventService {

    private eventRepository: RestEventRepository;

    constructor() {
        this.eventRepository = new RestEventRepository();
    }

    /**
     * Fetch and format events within a specific period, including past recurrences.
     * @param start_date - The start date of the period (ISO string).
     * @param end_date - The end date of the period (ISO string).
     * @param collection - The collection name where events are stored.
     * @returns Promise<EventFormData[]> - List of formatted events.
     */
    async getEventsForPeriod(start_date: string, end_date: string): Promise<EventFormData[]> {
        try {

            return   await this.eventRepository.fetchEventsForPeriod(start_date, end_date);
        } catch (error) {
            console.error("Error fetching events for period:", error);
            throw error;
        }
    }

}
