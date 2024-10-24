/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SignUpForm from './Auth/SignUpForm';
import Login from './Auth/Login';
import AdminDashboard from './Admin/AdminDashboard';
import UserDashboard from './User/UserDashboard';
import EventCalendar from "./Admin/EventCalendar";
import Calendrier from './Admin/Calendrier'; 
import Navbar from './Navbar';

const App = () => {
    const location = useLocation(); // Utilisation correcte à l'intérieur de Router

    return (
        <>
            {/* Afficher Navbar sauf si on est sur Login ou SignUp */}
            {location.pathname !== '/' && location.pathname !== '/signup' && location.pathname !== '/user-dashboard' && <Navbar />}

            <Routes>
                <Route path="/event" element={<EventCalendar />} /> {/* Correction ici : utiliser EventCalendar */}
                <Route path="/calendrier" element={<Calendrier />} />
                <Route path="/signup" element={<SignUpForm />} />
                <Route path="/" element={<Login />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
            </Routes>
        </>
    );
}

const Main = () => (
    <Router>
        <App />
    </Router>
);

export default Main;
