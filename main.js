// setSubStatus:shows subscription status in #result div (subscribed or not yet)
import setSubStatus from "./scripts/subStatus.js";
import startSubProcess from "./scripts/startSubProcess.js";
import tokenGenerator from "./scripts/tokenGenerator.js";

const token = tokenGenerator();
try {
  localStorage.setItem("token", token);
} catch (err) {
  console.log("Couldn't add token to localStorage");
}

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
  registeration.pushManager
    .permissionState({ userVisibleOnly: true })
    .then((permission) => {
      if (permission == "granted") {
        setSubStatus(true);
        // If user already subbed send subData to server to re-check
        // so if error happened 1st time we can get subData again
        startSubProcess();
      } else if (permission === "denied") {
        setSubStatus(false);
      }
    });
});
// Start sub process onClick
const form = document.querySelector("form#sub");
form.onsubmit = (e) => {
  e.preventDefault();
  console.log(token);
  document.querySelector("#token").value = token;
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
//#region App installation (PWA)
const appDiv = document.querySelector(".app-dw");
let deferredPrompt;

window.addEventListener("beforeinstallprompt", function (e) {
  // Prevent installing the app w/o clicking btn
  e.preventDefault();
  appDiv.classList.remove("hidden");
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
});

// Installation will be done with button click
appDiv.addEventListener("click", (e) => {
  // Show the prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted") {
      console.log("User installing the App...");
      appDiv.classList.add("hidden");
    } else {
      console.log("User declined installing...");
    }
    deferredPrompt = null;
  });
});
//#endregion
