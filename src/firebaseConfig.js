
import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWRpnt-4JLE_-ch21WazSvwcAybdEZddU",
  authDomain: "prayerpalace-d6159.firebaseapp.com",
  projectId: "prayerpalace-d6159",
  storageBucket: "prayerpalace-d6159.appspot.com",
  messagingSenderId: "373492551063",
  appId: "1:373492551063:web:63997782a5c3258f5248d2",
  measurementId: "G-BLPF9P0Q6C"
};

const app = initializeApp(firebaseConfig);

// Get the Auth instance from the initialized app
export const auth = getAuth(app);
export const storage = getStorage(app);
// Set authentication persistence to local
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Authentication persistence mode set to local");
  })
  .catch((error) => {
    console.error("Error setting authentication persistence:", error);
  });


export const db = getFirestore(app);
// Export the Firebase app instance if needed (optional)
export default app;