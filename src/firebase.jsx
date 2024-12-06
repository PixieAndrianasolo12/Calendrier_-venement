import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBg5ajns9ax4lchmaDw7zoui0XK6hgG44",
  authDomain: "calendrier-evenement-4e080.firebaseapp.com",
  projectId: "calendrier-evenement-4e080",
  storageBucket: "calendrier-evenement-4e080.appspot.com",
  messagingSenderId: "170015981917",
  appId: "1:170015981917:web:696065d010d35e277d28b4"
};

// Initialisez Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Activer la persistance hors ligne pour Firestore
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log('Persistance non activée : un autre onglet utilise Firestore.');
  } else if (err.code === 'unimplemented') {
    console.log('Persistance non prise en charge dans ce navigateur.');
  }
});

// Fonction de déconnexion
const logout = async () => {
  try {
    await signOut(auth);
    console.log("Déconnexion réussie");
  } catch (error) {
    console.error("Erreur lors de la déconnexion : ", error);
  }
};

export { auth, db, logout };
