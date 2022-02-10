/**
 * Describe sub status in #result div
 * @param {Boolean|String} status true | false | "error"
 */
export default function setSubStatus(status) {
  const result = document.querySelector("#result");
  const subBtn = document.querySelector("input#subscribe");
  if (status === true) {
    result.textContent = "You already subscribed, Thanks ♥";
    subBtn.disabled = true;
  } else if (status === "error") {
    result.textContent =
      "Error happened during subscribe process, would u click the button again please T_T";
    subBtn.disabled = false;
  } else {
    result.textContent = "Would u reconsider subscribing ? ♥";
    subBtn.disabled = false;
  }
}
