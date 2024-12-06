/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa';

const UserEventList = ({ event, toggleEdit, toggleDelete }) => {
  if (!event) return null;
  return (
    <li className={`flex justify-between items-center p-4 my-2 rounded border ${event.completed ? 'bg-green-200 border-green-400' : 'bg-white border-gray-300'} shadow-sm`}>
      <div className='flex items-center'>
        
        <p className={`ml-2 cursor-pointer ${event.completed ? 'line-through text-gray-500' : 'text-black'}`}>
          {event.title}
        </p>
      </div>
      <div className="ml-2 text-gray-500">
        <p>Date: {event.date}</p>
        <p>Heure: {event.time}</p>
      </div>
      
      
    </li>
  );
}

export default UserEventList;
