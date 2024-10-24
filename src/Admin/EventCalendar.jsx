/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { db } from '../firebase';
import { collection, onSnapshot, query, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import EventList from './EventList';

function EventCalendar() {
  const [events, setEvents] = useState([]);
  const [input, setInput] = useState('');
  const [inputEdit, setInputEdit] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

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

  const createEvent = async (e) => {
    e.preventDefault();
    if (!inputEdit) {
      await addDoc(collection(db, 'events'), {
        title: input,
        date: date,
        time: time
      });
    } else {
      await updateDoc(doc(db, 'events', inputEdit.id), {
        title: input,
        date: date,
        time: time
      });
      setInputEdit(null);
    }
    setInput('');
    setDate('');
    setTime('');
  };

  const toggleEdit = (event) => {
    setInputEdit(event);
    setInput(event.title);
    setDate(event.date);
    setTime(event.time);
  };

  const toggleDelete = async (id) => {
    await deleteDoc(doc(db, 'events', id));
  };

  return (
    <div className="app-main">
      <div className="app-container">
        <h3 className="text-white text-3xl font-bold mb-4 text-center">Calendrier des Événements</h3>
        <form onSubmit={createEvent}>
          <input
            className="app-input"
            type="text"
            placeholder="Ajouter un événement..."
            value={input}
            onChange={(evt) => setInput(evt.target.value)}
          />
          <input
            className="app-input"
            type="date"
            value={date}
            onChange={(evt) => setDate(evt.target.value)}
          />
          <input
            className="app-input"
            type="time"
            value={time}
            onChange={(evt) => setTime(evt.target.value)}
          />
          <button className="app-button" type="submit">
            <AiOutlinePlus size={30} />
          </button>
        </form>
        <ul>
          {events.map((event) => (
            <EventList
              key={event.id}
              event={event}
              toggleEdit={toggleEdit}
              toggleDelete={toggleDelete}
            />
          ))}
        </ul>
        <p className="app-count text-white text-center font-semibold">
          <span>{events.length}</span> Événements
        </p>
      </div>
    </div>
  );
}

export default EventCalendar;
