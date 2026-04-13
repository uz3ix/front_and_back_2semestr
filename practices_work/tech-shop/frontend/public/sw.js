// ===== Service Worker — TechStore (практики 13–17) =====

const CACHE_NAME = 'techstore-shell-v1';
const DYNAMIC_CACHE = 'techstore-dynamic-v1';

// App Shell — минимальный набор для работы офлайн (практики 13, 15)
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Установка: кэшируем App Shell (практика 13)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Активация: удаляем старые кэши (практика 13)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== DYNAMIC_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: Cache First для иконок/манифеста, Network First для остального (практика 15)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Пропускаем запросы к API и сторонним сервисам
  if (url.origin !== location.origin || url.pathname.startsWith('/api/')) return;

  // Иконки и манифест — Cache First
  if (url.pathname.startsWith('/icons/') || url.pathname === '/manifest.json') {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
    return;
  }

  // Всё остальное — Network First с фолбеком на кэш (App Shell)
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => cached || caches.match('/index.html'))
      )
  );
});

// Push-уведомления (практики 16–17)
self.addEventListener('push', (event) => {
  let data = { title: 'TechStore', body: '' };
  if (event.data) data = event.data.json();

  const options = {
    body: data.body,
    icon: '/icons/icon-128x128.png',
    badge: '/icons/icon-48x48.png',
    data: { reminderId: data.reminderId || null },
  };

  if (data.reminderId) {
    options.actions = [{ action: 'snooze', title: 'Отложить на 5 минут' }];
  }

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Обработка нажатий на уведомление (практика 17)
self.addEventListener('notificationclick', (event) => {
  const { notification, action } = event;
  if (action === 'snooze') {
    const reminderId = notification.data.reminderId;
    event.waitUntil(
      fetch(`http://localhost:3000/api/push/snooze?reminderId=${reminderId}`, {
        method: 'POST',
      }).then(() => notification.close())
    );
  } else {
    notification.close();
    event.waitUntil(clients.openWindow('/'));
  }
});
