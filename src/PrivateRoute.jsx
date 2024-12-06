/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './Contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
          <span className="text-xl font-semibold text-gray-800">Chargement...</span>
        </div>
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/" />;
};

export default PrivateRoute;


