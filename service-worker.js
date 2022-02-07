console.log("service worker is RDY...");

self.addEventListener("push", function (event) {
  // console.log(`Push event received: ${event}`);
  const payload = event.data ? event.data.text() : "no payload";
  event.waitUntil(
    self.registration.showNotification("Mush0 Message", {
      body: payload,
    })
  );
});
