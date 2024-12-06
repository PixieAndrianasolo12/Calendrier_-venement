/* eslint-disable no-unused-vars */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from './Contexts/AuthContext';

const UserNavbar = () => {
    const { currentUser, logout } = useAuth(); 
    const navigate = useNavigate(); 

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
                <h1 className="text-white text-2xl font-bold">Agenda User</h1>
                <div className="flex space-x-6">
                    <Link to="/userevent" className="text-white hover:text-gray-300 transition-colors duration-300">
                        Événement
                    </Link>
                    <Link to="/usercalendar" className="text-white hover:text-gray-300 transition-colors duration-300">
                        Calendrier
                    </Link>
                    <Link to="/" className="text-white hover:text-gray-300 transition-colors duration-300">
                        Deconnexion
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default UserNavbar;
