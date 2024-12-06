/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom'; // Importer le composant Link
import UserNavbar from '../UserNavbar'; 

const UserDashboard = () => {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 min-h-screen flex flex-col">
      <UserNavbar />

      <div className="flex-1 p-10 flex flex-col items-center justify-center bg-white rounded-lg shadow-md">
        <h1 className="text-5xl font-extrabold text-center mb-4 text-gray-800">BIENVENUE</h1>
        <p className="text-xl text-gray-600 text-center mb-6">
          Découvrez notre calendrier d'événements pour ne rien manquer des activités à venir !
        </p>
        {/* Utilisation du composant Link autour du bouton pour la navigation */}
        <Link to="/userevent">
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition">
            Voir les événements
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
