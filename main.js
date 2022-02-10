// setSubStatus:shows subscription status in #result div (subscribed or not yet)
import setSubStatus from "./scripts/subStatus.js";
// Push notification subscription process
import startSubProcess from "./scripts/startSubProcess.js";

// Register SW process
window.onload = () => {
  if (!"serviceWorker" in navigator) {
    console.log("This browser doesn't support Service Workers");
  } else {
    navigator.serviceWorker.register("./service-worker.js");
  }
};
// Check if user already subed and set status to true
navigator.serviceWorker.ready.then((registeration) => {
  registeration.pushManager.getSubscription().then((subscription) => {
    if (subscription) {
      setSubStatus(true);
      // If user already subbed send subData to server to re-check
      // so if error happened 1st time we can get subData again
      startSubProcess();
    }
  });
});
// Start sub process onClick
const btn = document.querySelector("input");
btn.onclick = (e) => {
  Notification.requestPermission().then((e) => {
    if (e === "granted") {
      console.log("Permission granted ♥");
      setSubStatus(true);
      startSubProcess();
    } else {
      console.log("Permission denied T_T");
      setSubStatus(false);
    }
  });
};
