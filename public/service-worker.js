const CACHE_NAME = 'static-v1'; // Nom du cache
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installation en cours...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Mise en cache des fichiers');
        return cache.addAll(URLS_TO_CACHE); // Ajouter les fichiers à mettre en cache
      })
      .catch((error) => {
        console.error('[Service Worker] Échec de la mise en cache:', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activation...');
  // Supprimer les caches obsolètes
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            // Supprimer les anciens caches
            console.log('[Service Worker] Suppression du cache obsolète:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Gestion des requêtes
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log('[Service Worker] Réponse trouvée dans le cache:', event.request.url);
        return cachedResponse; // Répondre à partir du cache
      }

      console.log('[Service Worker] Demande de récupération de:', event.request.url);
      return fetch(event.request).then((response) => {
        // Mettre en cache les nouvelles réponses (si nécessaire)
        return caches.open(CACHE_NAME).then((cache) => {
          if (event.request.url.startsWith(self.location.origin)) {
            // Mettre en cache les réponses des fichiers du même domaine
            cache.put(event.request, response.clone());
          }
          return response;
        });
      });
    }).catch((error) => {
      console.error('[Service Worker] Erreur lors de la récupération:', error);
      // En cas d'erreur, on peut répondre avec un fichier de secours, par exemple :
      return caches.match('/index.html');
    })
  );
});
