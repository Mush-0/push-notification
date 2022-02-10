import setSubStatus from "./subStatus.js";

const serverUrl = "https://pushing-server.herokuapp.com";
// const serverUrl = "test";

// Subscription process
export default function startSubProcess() {
  navigator.serviceWorker.ready.then((registration) => {
    return registration.pushManager
      .getSubscription()
      .then((subscription) => reqVapidFromServer(subscription, registration))
      .then(sendSubToServer)
      .catch((err) => {
        console.log("Error during SubProcess: ", err);
        setSubStatus("error");
      });
  });
}

// Request Vapid puplicKey from the server
async function reqVapidFromServer(subscription, registration) {
  // If user already subed we return, else we ask user to sub
  if (subscription) {
    setSubStatus(true);
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
  if (res.status === 201 || res.status === 200) {
    setSubStatus(true);
  } else setSubStatus("error");
}
