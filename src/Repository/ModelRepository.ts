import {
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    getDoc,
    query,
    DocumentData,
} from "firebase/firestore";
import FirebaseRepository from "./FirebaseRepository";
import { db } from "../../firebaseConfig";

export default class ModelRepository extends FirebaseRepository {

    constructor() {
        super(db);
    }

    async getModels(ownerId: string | null, collection: string): Promise<DocumentData[]> {
        if (!ownerId) {
            throw new Error("User not authenticated");
        }

        const collectionRef = this.getCollectionRef(collection);
        const q = query(collectionRef);
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    async getModelById(id: string | null, collection: string): Promise<DocumentData | null> {
        if (!id) {
            throw new Error("Document ID is required");
        }

        const docRef = this.getDocRef(collection, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.warn("No document found with the provided ID.");
            return null;
        }
    }

    async getModelsByOwner(ownerId: string | null, collection: string): Promise<DocumentData[]> {
        if (!ownerId) {
            throw new Error("User not authenticated");
        }

        const collectionRef = this.getCollectionRef(collection);
        const q = query(collectionRef);
        const snapshot = await getDocs(q);
        const docs = snapshot.docs;

        return docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    async add(collection:string,eventData: any): Promise<string> {
        const collectionRef = this.getCollectionRef(collection);
        const docRef = await addDoc(collectionRef, eventData);
        return docRef.id;
    }

    async update(collection:string,eventId: string, updatedData: any): Promise<void> {
        const docRef = this.getDocRef(collection, eventId);
        await updateDoc(docRef, updatedData);
    }

    async delete(collection:string,eventId: string): Promise<void> {
        const docRef = this.getDocRef(collection, eventId);
        await deleteDoc(docRef);
    }
}
