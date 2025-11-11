import RestEventRepository from "../repository/RestEventRepository";

/**
 * Service class for managing events in the application.
 * Provides business logic for event operations including CRUD, recurrence handling,
 * and completion status management.
 *
 * @class EventService
 * @example
 * ```typescript
 * const eventService = new EventService();
 * const events = await eventService.getEventsForPeriod('2025-11-01', '2025-11-30');
 * ```
 */
export default class EventService {
    private eventRepository: RestEventRepository;

    /**
     * Creates an instance of EventService.
     * Initializes the RestEventRepository for data access.
     */
    constructor() {
        this.eventRepository = new RestEventRepository();
    }

    /**
     * Retrieves all events within a specified date range.
     * Used primarily for calendar view to display events for a specific period.
     *
     * @param {string} start_date - Start date in ISO 8601 format (e.g., '2025-11-01T00:00:00Z')
     * @param {string} end_date - End date in ISO 8601 format (e.g., '2025-11-30T23:59:59Z')
     * @returns {Promise<EventFormData[]>} Array of events within the specified period
     * @throws {Error} If dates are invalid or if there's a database error
     *
     * @example
     * ```typescript
     * const events = await eventService.getEventsForPeriod(
     *   '2025-11-01T00:00:00Z',
     *   '2025-11-30T23:59:59Z'
     * );
     * // Returns all events in November 2025
     * ```
     */
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

    /**
     * Toggles the completion status of an event.
     * If the event is marked as done, it will be marked as not done, and vice versa.
     *
     * @param {Event} event - The event object whose status should be toggled
     * @returns {Promise<boolean>} True if the status was successfully changed
     * @throws {Error} If the event doesn't exist or if there's an update error
     *
     * @example
     * ```typescript
     * const event = { id: 'evt_123', is_done: false, ... };
     * await eventService.changeDoneStatus(event);
     * // Event is now marked as done
     * ```
     */
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

    /**
     * Updates an existing event.
     * Can update a single occurrence or all occurrences of a recurring event.
     *
     * @param {EventFormData} event - The event data with updated fields
     * @param {boolean} withRecurrences - If true, updates all occurrences of a recurring event;
     *                                    if false, updates only the specified occurrence
     * @param {string | Date | null} [date=null] - Specific date for single occurrence update.
     *                                             Used when updating one instance of a recurring event.
     * @returns {Promise<void>}
     * @throws {Error} If the event doesn't exist or if there's an update error
     *
     * @example
     * ```typescript
     * // Update all occurrences of a recurring event
     * await eventService.update(eventData, true);
     *
     * // Update only a specific occurrence
     * await eventService.update(eventData, false, '2025-11-12T08:00:00Z');
     * ```
     */
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
