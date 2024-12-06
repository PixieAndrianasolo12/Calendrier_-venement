import React from 'react';
import ReactDOM from 'react-dom/client';  // Import depuis react-dom/client
import App from './App';
import './index.css';

// Enregistrement du service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker enregistré:', registration);
      })
      .catch((registrationError) => {
        console.log('Échec de l\'enregistrement du Service Worker:', registrationError);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
