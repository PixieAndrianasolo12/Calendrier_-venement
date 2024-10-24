// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBg5ajns9ax4lchmaDw7zoui0XK6hgG44",
  authDomain: "calendrier-evenement-4e080.firebaseapp.com",
  projectId: "calendrier-evenement-4e080",
  storageBucket: "calendrier-evenement-4e080.appspot.com",
  messagingSenderId: "170015981917",
  appId: "1:170015981917:web:696065d010d35e277d28b4"
};
// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app)

 export {auth}
 export const db = getFirestore(app)

