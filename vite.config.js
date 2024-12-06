import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    port: 3000, 
  },
  plugins: [
    react(),
    VitePWA({
      srcDir: 'src',
      filename: 'service-worker.js',
      manifest: {
        short_name: "Calendrier",
        name: "Calendrier d'Événements",
        icons: [
          {
            src: "public/vite.svg",
            type: "image/png",
            sizes: "192x192"
          },
          {
            src: "public/vite.svg",
            type: "image/png",
            sizes: "512x512"
          }
        ],
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#1976d2",
        description: "Une application de calendrier d'événements",
        orientation: "portrait"
      },
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'public/*'], // Inclure les fichiers importants
      strategies: 'generateSW', // Utiliser un service worker généré pour le précaching
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg}'], // Précache tous les fichiers nécessaires
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document' || request.destination === 'script' || request.destination === 'style',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-shell',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 1 semaine
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
              },
            },
          },
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'firebase-images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
              },
            },
          },
          {
            urlPattern: ({ url }) => url.origin === self.location.origin && !url.pathname.startsWith('/src/'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'local-assets',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 1 semaine
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true, // Tester PWA en développement
      },
    })
  ]
});
