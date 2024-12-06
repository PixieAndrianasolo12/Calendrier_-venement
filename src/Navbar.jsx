/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; 
import { auth, logout } from './firebase';
import { useAuth } from './Contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); 
  const { currentUser } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Déconnecté avec succès");
      navigate('/');
    } catch (error) {
      console.error("Erreur lors de la déconnexion : ", error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-[#4c6ef5] to-[#f39c12] p-4 shadow-md"> 
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Agenda Clone</h1>

        <div className="hidden md:flex space-x-6">
          <Link to="/event" className="text-white hover:text-gray-300 transition-colors duration-300">
            Evenement
          </Link>
          <Link to="/calendrier" className="text-white hover:text-gray-300 transition-colors duration-300">
            Calendrier
          </Link>
          <Link to="/groupe" className="text-white hover:text-gray-300 transition-colors duration-300">
            Groupes
          </Link>
          
          {currentUser && (
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-300 transition-colors duration-300"
            >
              Déconnexion
            </button>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isOpen ? (
              <FaTimes className="w-6 h-6" /> 
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden flex flex-col space-y-4 mt-4">
          <Link to="/" className="text-white hover:text-gray-300 transition-colors duration-300">
            Tâches
          </Link>
          <Link to="/calendrier" className="text-white hover:text-gray-300 transition-colors duration-300">
            Calendrier
          </Link>
          {currentUser && (
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-300 transition-colors duration-300"
            >
              Déconnexion
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
