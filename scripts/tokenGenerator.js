/**
 * string of 10[A-z0-9] token
 */
export default function tokenGenerator() {
  // Search localStorage for token
  try {
    const token = localStorage.getItem("token");
    if (token) {
      return token;
    }
  } catch (error) {
    console.log("Couldn't access localStorage");
  }
  // If not found in localStorage, Generate new token
  const letters =
    "thequickbrownfoxjumpsoverthelazydogTHEQUICKBROWNFOXJUMPSOVERTHELAZYDOG";
  const numbers = "0123456789";
  const token = [];
  for (let i = 0; i < 10; i++) {
    const randomLetter = Math.floor(Math.random() * 70);
    const randomNum = Math.floor(Math.random() * 10);
    const randomizer = Math.floor(Math.random() * 2);
    if (randomizer) {
      token.push(letters[randomLetter]);
    } else token.push(numbers[randomNum]);
  }
  return token.join("");
}
