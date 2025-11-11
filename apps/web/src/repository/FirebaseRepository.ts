import { Firestore, getFirestore, collection, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default class FirebaseRepository {
    protected db: Firestore;

    constructor(db: Firestore) {
        this.db = db;
    }

    protected getCollectionRef(collectionName: string) {
        return collection(this.db, collectionName);
    }

    protected getDocRef(collectionName: string, id: string) {
        return doc(this.db, collectionName, id);
    }
}
