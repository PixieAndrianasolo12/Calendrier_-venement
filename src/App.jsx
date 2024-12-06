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
import { AuthProvider } from './Contexts/AuthContext';
import { NotificationsProvider } from './Contexts/NotificationsContext';
import PrivateRoute from './PrivateRoute';
import Groupe from './Admin/Groupe';
import UserCalendrier from './User/UserCalendrier';
import UserEventCalendar from './User/UserEventCalendar';

const App = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname !== '/' && 
       location.pathname !== '/signup' && 
       location.pathname !== '/login' && 
       location.pathname !== '/user-dashboard' &&
       location.pathname !== '/userevent' && 
       location.pathname !== '/usercalendar' && 
       <Navbar />
      }
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/event" element={<PrivateRoute><EventCalendar /></PrivateRoute>} />
        <Route path="/calendrier" element={<PrivateRoute><Calendrier /></PrivateRoute>} />
        <Route path="/groupe" element={<PrivateRoute><Groupe /></PrivateRoute>} />
        <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/user-dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
        <Route path="/userevent" element={<PrivateRoute><UserEventCalendar /></PrivateRoute>} />
        <Route path="/usercalendar" element={<PrivateRoute><UserCalendrier /></PrivateRoute>} />
      </Routes>
    </>
  );
};

const Main = () => (
  <Router>
    <AuthProvider>
      <NotificationsProvider>
        <App />
      </NotificationsProvider>
    </AuthProvider>
  </Router>
);

export default Main;
