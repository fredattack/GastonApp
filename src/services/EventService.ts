import RestEventRepository from "../repository/RestEventRepository";

export default class EventService {
    private eventRepository: RestEventRepository;

    constructor() {
        this.eventRepository = new RestEventRepository();
    }

    async getEventsForPeriod(
        start_date: string,
        end_date: string,
    ): Promise<EventFormData[]> {
        try {
            return await this.eventRepository.fetchEventsForPeriod(
                start_date,
                end_date,
            );
        } catch (error) {
            console.error("Error fetching events for period:", error);
            throw error;
        }
    }

    async changeDoneStatus(event: Event) {
        const payload = {
            id: event.id,
            master_id: event.master_id,
            is_done: !event.is_done,
            date: event.start_date,
        };
        try {
            return await this.eventRepository
                .changeDoneStatus(payload)
                .then((resp) => {
                    console.log("resp in service", resp);
                    return true;
                });
        } catch (error) {
            console.error("Error changing done status:", error);
            throw error;
        }
    }

    async update(
        event: EventFormData,
        withRecurrences: boolean,
        date: string | Date | null = null,
    ) {
        console.log("date", date);
        try {
            return await this.eventRepository.update(
                event,
                withRecurrences,
                date,
            );
        } catch (error) {
            console.error("Error updating event:", error);
            throw error;
        }
    }
}
