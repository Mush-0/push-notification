/**
 * Describe sub status in #result div
 * @param {Boolean|String} status true | false | "error"
 */
export default function setSubStatus(status) {
  const result = document.querySelector("#result");
  if (status === true) {
    result.textContent = "You already subscribed, Thanks ♥";
  } else if (status === "error") {
    result.textContent =
      "Error happened during subscribe process, would u click the button again please T_T";
  } else result.textContent = "Would u reconsider subscribing ? ♥";
}
