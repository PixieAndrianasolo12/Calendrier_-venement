/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { db } from '../firebase';
import { collection, onSnapshot, query, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import EventList from './EventList';

// Fonction pour envoyer la notification push
const sendNotification = (title, message) => {
  if (Notification.permission === "granted") {
    new Notification(title, { body: message });
  }
};

function EventCalendar() {
  const [events, setEvents] = useState([]);
  const [input, setInput] = useState('');
  const [inputEdit, setInputEdit] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');

  useEffect(() => {
    const q = query(collection(db, "events"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventArr = [];
      querySnapshot.forEach((doc) => {
        const event = { ...doc.data(), id: doc.id };
        eventArr.push(event);
        scheduleNotifications(event);
      });
      setEvents(eventArr);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const groupQuery = query(collection(db, 'groups'));
    const unsubscribeGroups = onSnapshot(groupQuery, (snapshot) => {
      const groupsArray = [];
      snapshot.forEach((doc) => {
        groupsArray.push(doc.data().name);
      });
      setGroups(groupsArray);
    });
    return () => unsubscribeGroups();
  }, []);

  const scheduleNotifications = (event) => {
    const eventTime = new Date(`${event.date}T${event.time}`).getTime();
    const now = Date.now();
    const timeUntilEvent = eventTime - now;

    // Notification 20 secondes avant l'événement
    if (timeUntilEvent > 20000) {
      setTimeout(() => {
        sendNotification("Rappel d'Événement", `L'événement "${event.title}" commence dans 20 secondes.`);
      }, timeUntilEvent - 20000);
    }

    // Notification au début de l'événement
    if (timeUntilEvent > 0) {
      setTimeout(() => {
        sendNotification("Début d'Événement", `L'événement "${event.title}" commence maintenant.`);
      }, timeUntilEvent);
    }
  };

  const createEvent = async (e) => {
    e.preventDefault();
    if (!inputEdit) {
      await addDoc(collection(db, 'events'), {
        title: input,
        date: date,
        time: time,
        group: selectedGroup
      });
    } else {
      await updateDoc(doc(db, 'events', inputEdit.id), {
        title: input,
        date: date,
        time: time,
        group: selectedGroup
      });
      setInputEdit(null);
    }
    setInput('');
    setDate('');
    setTime('');
    setSelectedGroup('');
  };

  const toggleEdit = (event) => {
    setInputEdit(event);
    setInput(event.title);
    setDate(event.date);
    setTime(event.time);
    setSelectedGroup(event.group);
  };

  const toggleDelete = async (id) => {
    await deleteDoc(doc(db, 'events', id));
  };

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#4c6ef5] to-[#f39c12] min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <h3 className="text-gray-800 text-3xl font-bold mb-6 text-center">Calendrier des Événements</h3>
        <form onSubmit={createEvent} className="flex flex-col space-y-4">
          <input
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:border-blue-500"
            type="text"
            placeholder="Ajouter un événement..."
            value={input}
            onChange={(evt) => setInput(evt.target.value)}
          />
          <input
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:border-blue-500"
            type="date"
            value={date}
            onChange={(evt) => setDate(evt.target.value)}
          />
          <input
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:border-blue-500"
            type="time"
            value={time}
            onChange={(evt) => setTime(evt.target.value)}
          />
          <select
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:border-blue-500"
            value={selectedGroup}
            onChange={(evt) => setSelectedGroup(evt.target.value)}
          >
            <option value="">Sélectionner un groupe</option>
            {groups.map((group, index) => (
              <option key={index} value={group}>{group}</option>
            ))}
          </select>
          <button className="bg-blue-500 text-white rounded-md p-3 hover:bg-blue-600 transition" type="submit">
            <AiOutlinePlus size={30} />
          </button>
        </form>
        <ul className="mt-4">
          {events.map((event) => (
            <EventList
              key={event.id}
              event={event}
              toggleEdit={toggleEdit}
              toggleDelete={toggleDelete}
            />
          ))}
        </ul>
        <p className="text-gray-800 text-center font-semibold mt-4">
          <span>{events.length}</span> Événements
        </p>
      </div>
    </div>
  );
}

export default EventCalendar;
