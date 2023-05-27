import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {

  apiKey: "AIzaSyD6CgIbX4j1eWr5BEO_3Tm3V8LJaDVOH0k",

  authDomain: "savvyexpensetracker-47bf4.firebaseapp.com",

  projectId: "savvyexpensetracker-47bf4",

  storageBucket: "savvyexpensetracker-47bf4.appspot.com",

  messagingSenderId: "1013426303723",

  appId: "1:1013426303723:web:44751608852b062b8204ae",

  measurementId: "G-H2TGEDCHJP"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
