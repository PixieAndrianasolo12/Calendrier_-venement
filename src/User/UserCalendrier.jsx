/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import Calendar from 'react-calendar';
import UserNavbar from '../UserNavbar';
import { FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../Contexts/AuthContext';

const UserCalendrier = () => {
  const { currentUser, userGroups } = useAuth();
  const [events, setEvents] = useState([]);
  const [value, setValue] = useState(new Date());

  // Récupère les événements de Firestore
  useEffect(() => {
    const q = query(collection(db, "events"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventArr = [];
      querySnapshot.forEach((doc) => {
        eventArr.push({ ...doc.data(), id: doc.id });
      });
      console.log("Événements récupérés:", eventArr);
      setEvents(eventArr);
    });
    return () => unsubscribe();
  }, []);

 
  // Filtre les événements pour l'utilisateur actuel
  const getUserEvents = () => {
    if (!currentUser || !userGroups) return [];

    return events.filter(event => {
      const participantsExist = Array.isArray(event.participants) && event.participants.includes(currentUser.uid);
      const groupExists = event.group && Array.isArray(userGroups) && userGroups.includes(event.group);
      return participantsExist || groupExists;
    });
  };

  
  // Fonction pour obtenir les événements pour la date sélectionnée
  const getEventsForDate = (date) => {
    const dateString = date.toLocaleDateString('fr-CA');
    const userEvents = getUserEvents();
    const eventsForDate = userEvents.filter(event => event.date === dateString);
    console.log("Événements pour la date sélectionnée:", eventsForDate);
    return eventsForDate;
  };

  const handleDateChange = (newDate) => {
    setValue(newDate);
  };

  const eventsForDate = getEventsForDate(value);

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toLocaleDateString('fr-CA');
      const userEventsForTile = getUserEvents().filter(event => event.date === dateString);
  
      return userEventsForTile.length > 0 ? (
        <div className="event-indicator flex justify-center items-center">
          <div className="bg-blue-600 w-6 h-6 flex items-center justify-center rounded-md">
            <FaCalendarAlt className="text-white w-4 h-4" />
          </div>
        </div>
      ) : null;
    }
  };
  

  return (
    <div className="bg-gray-100 min-h-screen">
      <UserNavbar />
      <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg border border-gray-300">
        <h3 className="text-blue-600 text-3xl font-bold mb-4 text-center">Calendrier des Événements</h3>
        <div className="flex justify-center mb-4">
      
        <Calendar
          onChange={handleDateChange}
          value={value}
          className="border border-gray-300 w-full lg:w-3/4 xl:w-2/3 rounded-lg shadow-lg p-4"
          tileContent={tileContent}
        />


        </div>
        <h4 className="text-blue-600 text-xl mb-2">Événements pour {value.toDateString()} :</h4>
        <ul className="bg-blue-50 rounded-md p-4 mb-6 border border-gray-300">
          {eventsForDate.length > 0 ? (
            eventsForDate.map((event) => (
              <li key={event.id} className="flex justify-between items-center border-b border-blue-200 py-2">
                <span className="text-blue-800 font-semibold">{event.title}</span>
                <span className="text-gray-500">{event.date} à {event.time}</span>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">Aucun événement pour cette date.</p>
          )}
        </ul>

        <h4 className="text-blue-600 text-xl mb-2">Tous mes Événements :</h4>
        <ul className="bg-blue-50 rounded-md p-4 border border-gray-300">
          {getUserEvents().length > 0 ? (
            getUserEvents().map((event) => (
              <li key={event.id} className="flex justify-between items-center border-b border-blue-200 py-2">
                <span className="text-blue-800 font-semibold">{event.title}</span>
                <span className="text-gray-500">{event.date} à {event.time}</span>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">Aucun événement accessible.</p>
          )}
          
        </ul>
      </div>
    </div>
  );
};

export default UserCalendrier;
