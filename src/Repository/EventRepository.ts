import { query, where, getDocs, DocumentData,orderBy } from "firebase/firestore";
import ModelRepository from "./ModelRepository";

export default class EventRepository extends ModelRepository {
    constructor() {
        super();
    }

    /**
     * Fetch events within a specific period.
     * @param startDate - The start date of the period (ISO string).
     * @param endDate - The end date of the period (ISO string).
     * @param collection - The collection name where events are stored.
     * @returns Promise<DocumentData[]> - List of events within the period.
     */
    async fetchEventsForPeriod(startDate: string, endDate: string): Promise<DocumentData[]> {
        console.log('fetchEventsForPeriod',startDate,endDate);
        if (!startDate || !endDate) {
            throw new Error("Both startDate and endDate are required.");
        }

        const collectionRef = this.getCollectionRef('events');

        const q = query(
            collectionRef,
            where("startDate", "<=", endDate),
            where("endDate", ">=", startDate),
            orderBy("startDate"),
            orderBy("endDate")
        );


        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
}
