/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid); 
        const userDoc = await getDoc(userDocRef);

        console.log('User Document:', userDoc.data());

        setCurrentUser(user);
        if (userDoc.exists()) {
          const groups = userDoc.data().group ? [userDoc.data().group] : [];
          setUserGroups(groups);
          console.log('User Groups:', groups);
        } else {
          console.log('No such user document!');
        }
      } else {
        setCurrentUser(null);
        setUserGroups([]);
      }
      setLoading(false);
      console.log('User state changed: ', user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading, userGroups }}>
      {children}
    </AuthContext.Provider>
  );
};
