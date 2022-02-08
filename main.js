// const process = { env: { SERVER_URL: "NO" } };

const serverUrl = "https://pushing-server.herokuapp.com";

// Show subscription status in #result div (subscribed or not yet)
function userSubbed(boolean) {
  const result = document.querySelector("#result");
  if (boolean === true) {
    result.textContent = "You already subscribed, Thanks ♥";
  } else {
    result.textContent =
      "You didn't subscribe yet, would u click the button please ^_^";
  }
}

// Using the onload method to load SW
window.onload = () => {
  if (!"serviceWorker" in navigator) {
    console.log("This browser doesn't support Service Workers");
  } else {
    navigator.serviceWorker.register("./service-worker.js");
    userSubbed(false);
    // We use the registration object to subscribe in pushManager
    startSubProcess();
  }
};

// Subscription process
function startSubProcess() {
  navigator.serviceWorker.ready.then((registration) => {
    return registration.pushManager
      .getSubscription()
      .then((subscription) => reqVapidFromServer(subscription, registration))
      .then(sendSubToServer);
  });
}
// Request Vapid puplicKey from the server
async function reqVapidFromServer(subscription, registration) {
  // If user already subed we return, else we ask user to sub
  if (subscription) {
    userSubbed(true);
    return subscription;
  } else {
    console.log("User didn't subscribe yet, starting subscribing process");
  }
  // Fetching the Vapid puplicKey
  const response = await fetch(`${serverUrl}/vapid_puplic_key`);
  const vapidPublicKey = await response.text();
  // console.log("vapidPublicKey: ", vapidPublicKey);
  // Chrome needs the vapid puplicKey to be Unit8Array
  // I read that the bug was fixed to i give same key without any conversion to test it on chrome
  // const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
  const convertedVapidKey = vapidPublicKey;
  // Returning the subscription object after subscribing
  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey,
  });
}

// Sending subscription object to the server to handle it (send push notifications from it)
async function sendSubToServer(subscription) {
  // console.log(`Sending :${JSON.stringify(subscription)} to the server...`);
  const res = await fetch(`${serverUrl}/register`, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      subscription: subscription,
    }),
  });
  res.status === 204 ? userSubbed(true) : userSubbed(false);
}

const btn = document.querySelector("input");
btn.onclick = (e) => {
  Notification.requestPermission().then((e) => {
    if (e === "granted") {
      console.log("Permission granted ♥");
      userSubbed(true);
      startSubProcess();
    } else {
      console.log("Permission denied T_T");
      userSubbed(false);
    }
  });
};
