console.log("service worker is RDY...");

// Trying to cache assets
// Code copied from: https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage
const assetsToCache = [
  "/imgs/kitty.png",
  "/imgs/paw.png",
  "/index.html",
  "/main.js",
  "/style.css",
];
const cacheVersion = "v1";
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(cacheVersion).then(function (cache) {
      return cache.addAll(assetsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // caches.match() always resolves
      // but in case of success response will have value
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request)
          .then(function (response) {
            // response may be used only once
            // we need to save clone to put one copy in cache
            // and serve second one
            let responseClone = response.clone();

            caches.open(cacheVersion).then(function (cache) {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(function () {
            return caches.match("/imgs/kitty.png");
          });
      }
    })
  );
});

self.addEventListener("push", function (event) {
  // console.log(`Push event received: ${event}`);
  const payload = event.data ? event.data.text() : "no payload";
  const testMsg = payload.substring(0, 4);

  // If msg starts with "$test" we wont send any notifications
  if (testMsg !== "$test") {
    event.waitUntil(
      self.registration.showNotification("Mush0 Message", {
        body: payload,
        icon: "./imgs/kitty.png",
        badge: "./imgs/paw.png",
        vibrate: [200, 100, 300, 200, 400],
      })
    );
  }
  console.log("Received push notification");
});

self.onnotificationclick = function (event) {
  console.log("On notification click: ", event);
  // event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url == "/" && "focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow("/");
      })
  );
};
