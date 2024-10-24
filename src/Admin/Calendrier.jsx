/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import Calendar from 'react-calendar';
import './Calendar.css';

const Calendrier = () => {
  const [events, setEvents] = useState([]);
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    const q = query(collection(db, "events"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventArr = [];
      querySnapshot.forEach((doc) => {
        eventArr.push({ ...doc.data(), id: doc.id });
      });
      setEvents(eventArr);
    });
    return () => unsubscribe();
  }, []);

  // Function to get events for the selected date
  const getEventsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0]; // Format "YYYY-MM-DD"
    return events.filter(event => event.date === dateString);
  };

  const handleDateChange = (newDate) => {
    setValue(newDate);
  };

  const eventsForDate = getEventsForDate(value);

  // Function to render custom content for each tile
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const eventsForTileDate = events.filter(event => event.date === dateString);
      return eventsForTileDate.length > 0 ? (
        <div className="event-indicator"></div>
      ) : null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-10 bg-white rounded-lg shadow-lg border border-gray-300">
      <h3 className="text-blue-600 text-3xl font-bold mb-4 text-center">Calendrier des Événements</h3>
      <div className="flex justify-center">
        <Calendar
          onChange={handleDateChange}
          value={value}
          className="mb-4 border border-gray-500 w-full lg:w-3/4 xl:w-2/3"
          tileContent={tileContent}
        />
      </div>
      <h4 className="text-blue-600 text-xl mb-2">Événements pour {value.toDateString()} :</h4>
      <ul className="bg-blue-50 rounded-md p-4 mb-6 border border-gray-300">
        {eventsForDate.length > 0 ? (
          eventsForDate.map((event) => (
            <li key={event.id} className="flex justify-between items-center border-b border-blue-200 py-2">
              <span className="text-blue-800">{event.title}</span>
              <span className="text-gray-500">{event.date} à {event.time}</span>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">Aucun événement pour cette date.</p>
        )}
      </ul>
      {/* Display all events */}
      <h4 className="text-blue-600 text-xl mb-2">Tous les Événements :</h4>
      <ul className="bg-blue-50 rounded-md p-4 border border-gray-300">
        {events.map((event) => (
          <li key={event.id} className="flex justify-between items-center border-b border-blue-200 py-2">
            <span className="text-blue-800">{event.title}</span>
            <span className="text-gray-500">{event.date} à {event.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Calendrier;
