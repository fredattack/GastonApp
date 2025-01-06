// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAALr315jUv-45ltJAQuqXytBTi3WYcK10",
    authDomain: "gastonapp-f329e.firebaseapp.com",
    projectId: "gastonapp-f329e",
    storageBucket: "gastonapp-f329e.firebasestorage.app",
    messagingSenderId: "500657563390",
    appId: "1:500657563390:web:b55c42e193cd8424cb27af",
    measurementId: "G-FGJJZ088J9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
