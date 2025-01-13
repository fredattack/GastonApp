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
            const events = await this.eventRepository.fetchEventsForPeriod(startDate, endDate);
            let allEvents: EventFormData[] = [];

            events?.forEach((event: any) => {
                const formattedEvent = this.formatEvent(event);
                allEvents.push(formattedEvent);

                // Handle recurring events
                if (formattedEvent.is_recurring) {
                    const recurrences = this.generateRecurrences(formattedEvent, startDate, endDate);
                    allEvents = allEvents.concat(recurrences);
                }
            });
            return allEvents;
        } catch (error) {
            console.error("Error fetching events for period:", error);
            throw error;
        }
    }

    /**
     * Generate recurring events within the specified period.
     * @param event - The base event.
     * @param startDate - The start date of the period.
     * @param endDate - The end date of the period.
     * @returns EventFormData[] - List of recurring event instances.
     */
    private generateRecurrences(event: EventFormData, startDate: string, endDate: string): EventFormData[] {
        const recurrences: EventFormData[] = [];
        const frequencyMap = {
            daily: 1,
            weekly: 7,
            monthly: 30
        };

        let currentDate = new Date(event.startDate);
        const periodEndDate = new Date(endDate);
        const recurrenceEndDate = event.recurrence.has_end_reccurence ? new Date(event.recurrence.endRecurrenceDate) : periodEndDate;
        const interval = frequencyMap[event.recurrence.frequencyType as 'daily' | 'weekly' | 'monthly'] || 1;

        while (currentDate <= recurrenceEndDate && currentDate <= periodEndDate) {
            if (currentDate >= new Date(startDate)) {
                recurrences.push({
                    ...event,
                    startDate: new Date(currentDate),
                    endDate: new Date(new Date(currentDate).getTime() + (new Date(event.endDate).getTime() - new Date(event.startDate).getTime())),
                });
            }
            currentDate.setDate(currentDate.getDate() + (interval * event.recurrence.frequency));
        }

        return recurrences;
    }

    /**
     * Format the event data into EventFormData structure.
     * @param event - The raw event data from the database.
     * @returns EventFormData - Formatted event data.
     */
    private formatEvent(event: any): EventFormData {
        return {
            id: event.id,
            title: event.title || "Untitled Event",
            petId: event.petId,
            type: event.type || "General",
            startDate: event.startDate,
            endDate: event.endDate,
            is_recurring: event.is_recurring || false,
            isFullDay: event.isFullDay || false,
            recurrence: event.recurrence ? {
                frequencyType: event.recurrence.frequencyType || 'daily',
                end_recurrence_date: event.recurrence.endRecurrenceDate || null,
                frequency: event.recurrence.frequency || 1,
                days: event.recurrence.days || []
            } : {
                frequencyType: 'daily',
                endRecurrenceDate: null,
                frequency: 1,
                days: []
            },
            notes: event.notes || ""
        };
    }
}
