import {
    query,
    where,
    getDocs,
    DocumentData,
    orderBy,
} from "firebase/firestore";
import ModelRepository from "./ModelRepository";

export default class EventRepository extends ModelRepository {
    constructor() {
        super();
    }

    /**
     * Fetch events within a specific period.
     * @param start_date - The start date of the period (ISO string).
     * @param end_date - The end date of the period (ISO string).
     * @param collection - The collection name where events are stored.
     * @returns Promise<DocumentData[]> - List of events within the period.
     */
    async fetchEventsForPeriod(
        start_date: string,
        end_date: string,
    ): Promise<DocumentData[]> {
        if (!start_date || !end_date) {
            throw new Error("Both start_date and end_date are required.");
        }

        const collectionRef = this.getCollectionRef("events");

        const q = query(
            collectionRef,
            where("start_date", "<=", end_date),
            where("end_date", ">=", start_date),
            orderBy("start_date"),
            orderBy("end_date"),
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
}
