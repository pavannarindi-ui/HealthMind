// Service Worker for offline medical resources functionality
const CACHE_NAME = 'medicare-offline-v1';
const STATIC_CACHE_NAME = 'medicare-static-v1';

// Essential medical resources to cache for offline use
const ESSENTIAL_ROUTES = [
  '/',
  '/offline-resources',
  '/api/medical-resources?category=emergency',
  '/api/medical-resources?category=first-aid',
  '/api/medical-resources?category=drugs',
];

// Static assets to cache
const STATIC_ASSETS = [
  '/src/main.tsx',
  '/src/index.css',
  '/src/App.tsx',
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      }),
      
      // Cache essential medical routes
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching essential medical resources');
        return cache.addAll(ESSENTIAL_ROUTES.map(url => new Request(url, { cache: 'reload' })));
      })
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      // Force activation of new service worker
      return self.skipWaiting();
    }).catch((error) => {
      console.error('Service Worker: Installation failed', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches that don't match current version
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      // Claim all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // Handle other requests (CSS, JS, images)
  event.respondWith(handleResourceRequest(request));
});

// Handle API requests with offline fallback
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try network first for API requests
    const networkResponse = await fetch(request);
    
    // Cache successful GET requests to medical resources
    if (request.method === 'GET' && 
        url.pathname.includes('/api/medical-resources') && 
        networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed for API request, trying cache', url.pathname);
    
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('Service Worker: Serving API request from cache', url.pathname);
      return cachedResponse;
    }
    
    // Return offline response for medical resources
    if (url.pathname.includes('/api/medical-resources')) {
      return new Response(JSON.stringify([
        {
          id: 'offline-emergency-1',
          title: 'Emergency: Call 911',
          category: 'emergency',
          content: 'For life-threatening emergencies, call 911 immediately. Signs include: chest pain, difficulty breathing, severe bleeding, loss of consciousness, severe allergic reactions.',
          tags: ['emergency', '911', 'critical'],
          priority: 1,
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'offline-emergency-2',
          title: 'CPR Instructions',
          category: 'emergency',
          content: '1. Check responsiveness and breathing. 2. Call 911. 3. Position hands on center of chest. 4. Push hard and fast at least 2 inches deep. 5. Give 30 compressions then 2 rescue breaths. 6. Repeat until help arrives.',
          tags: ['cpr', 'emergency', 'cardiac'],
          priority: 1,
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'offline-first-aid-1',
          title: 'Severe Bleeding Control',
          category: 'first-aid',
          content: '1. Apply direct pressure with clean cloth. 2. Elevate injured area above heart if possible. 3. Apply pressure bandage. 4. If bleeding continues, apply pressure to pressure points. 5. Seek immediate medical attention.',
          tags: ['bleeding', 'first-aid', 'emergency'],
          priority: 1,
          lastUpdated: new Date().toISOString()
        }
      ]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Return generic offline response
    return new Response(JSON.stringify({ 
      error: 'Offline - This feature requires an internet connection',
      offline: true 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed for navigation, serving offline page');
    
    // Serve cached index.html for offline navigation
    const cachedResponse = await caches.match('/');
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback offline page
    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MediCare Pro - Offline</title>
        <style>
          body { 
            font-family: system-ui, -apple-system, sans-serif; 
            text-align: center; 
            padding: 2rem; 
            background: #f8fafc;
            color: #334155;
          }
          .container { 
            max-width: 500px; 
            margin: 0 auto; 
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .icon { 
            font-size: 3rem; 
            color: #2563eb; 
            margin-bottom: 1rem; 
          }
          h1 { 
            color: #1e293b; 
            margin-bottom: 1rem; 
          }
          .emergency {
            background: #fee2e2;
            border: 1px solid #fecaca;
            border-radius: 0.5rem;
            padding: 1rem;
            margin: 1rem 0;
            color: #991b1b;
          }
          .emergency strong {
            color: #dc2626;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">🏥</div>
          <h1>MediCare Pro</h1>
          <h2>You're currently offline</h2>
          <p>Some features may be limited while offline. Please check your internet connection to access the full medical assistance platform.</p>
          
          <div class="emergency">
            <strong>Emergency Information:</strong><br>
            For life-threatening emergencies, call 911 immediately regardless of internet connectivity.
          </div>
          
          <p>Essential medical information is cached for offline use. The app will automatically reconnect when your internet connection is restored.</p>
          
          <button onclick="window.location.reload()" style="
            background: #2563eb; 
            color: white; 
            border: none; 
            padding: 0.75rem 1.5rem; 
            border-radius: 0.5rem; 
            cursor: pointer;
            font-size: 1rem;
          ">
            Try Again
          </button>
        </div>
      </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Handle resource requests (CSS, JS, images)
async function handleResourceRequest(request) {
  // Try cache first for static assets
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Try network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Failed to fetch resource', request.url);
    
    // Return empty response for failed resources
    return new Response('', { status: 408, statusText: 'Offline' });
  }
}

// Handle background sync for offline medical data
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'medical-data-sync') {
    event.waitUntil(syncMedicalData());
  }
});

// Sync medical data when connection is restored
async function syncMedicalData() {
  try {
    console.log('Service Worker: Syncing medical data...');
    
    // Update cached medical resources
    const cache = await caches.open(CACHE_NAME);
    
    for (const route of ESSENTIAL_ROUTES) {
      if (route.startsWith('/api/')) {
        try {
          const response = await fetch(route);
          if (response.ok) {
            await cache.put(route, response);
            console.log('Service Worker: Updated cache for', route);
          }
        } catch (error) {
          console.log('Service Worker: Failed to sync', route, error);
        }
      }
    }
    
    console.log('Service Worker: Medical data sync complete');
  } catch (error) {
    console.error('Service Worker: Sync failed', error);
  }
}

// Handle push notifications for medical reminders
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Medical reminder from MediCare Pro',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'medical-reminder',
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'View Details'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ],
      data: {
        url: data.url || '/',
        timestamp: Date.now()
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'MediCare Pro', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'view') {
    const url = event.notification.data?.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Try to focus existing window
        for (const client of clientList) {
          if (client.url.includes(url) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'CACHE_MEDICAL_RESOURCES') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    event.ports[0].postMessage({
      isOfflineReady: true,
      cacheSize: 0 // This would be calculated dynamically
    });
  }
});

console.log('Service Worker: Script loaded successfully');
