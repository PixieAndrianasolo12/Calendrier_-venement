/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { useAuth } from '../Contexts/AuthContext';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import UserNavbar from '../UserNavbar';

const UserEventCalendar = () => {
  const { currentUser, userGroups } = useAuth();
  const [events, setEvents] = useState([]);
  const [input, setInput] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      if (!currentUser) return;
      try {
        const eventsCollection = collection(db, 'events');
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsData = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    fetchEvents();
  }, [currentUser]);

  const getAccessibleEvents = () => {
    const userId = currentUser ? currentUser.uid : null;

    return events.filter(event =>
      event.participants?.includes(userId) ||
      userGroups.includes(event.group)
    );
  };

  const accessibleEvents = getAccessibleEvents();

  const createEvent = async (evt) => {
    evt.preventDefault();
    if (!input || !date || !time) return;

    try {
      const eventsCollection = collection(db, 'events');
      await addDoc(eventsCollection, {
        title: input,
        date: date,
        time: time,
        user: currentUser.uid,
        group: selectedGroup,
        participants: [currentUser.uid],
      });

      setInput('');
      setDate('');
      setTime('');
      setSelectedGroup('');
    } catch (error) {
      console.error("Error creating event: ", error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-100 to-pink-100 min-h-screen flex flex-col">
      <UserNavbar />
      <div className="container mx-auto p-8">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8">Calendrier des événements</h2>

        <ul className="space-y-4">
          {accessibleEvents.length > 0 ? (
            accessibleEvents.map(event => (
              <li key={event.id} className="bg-gray-100 p-6 rounded-xl shadow-md hover:shadow-2xl transition-transform duration-300 transform hover:scale-105">
                <h3 className="font-bold text-2xl text-blue-700 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-500">Date : {event.date}</p>
                <p className="text-sm text-gray-500">Heure : {event.time}</p>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-400">Aucun événement accessible pour le moment.</p>
          )}
        </ul>

      </div>
    </div>
  );
};

export default UserEventCalendar;
