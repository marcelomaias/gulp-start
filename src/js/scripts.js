import User from "./inc/component.js";

const user = new User("Bob", 38);
console.log(user);

const box = document.getElementById("box");
if (box) {
  const text = document.createElement("p");
  text.innerHTML = "I am a text inserted by JavaScript only in the Home page!";
  box.append(text);
}
