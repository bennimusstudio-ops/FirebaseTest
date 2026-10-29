javascript
import { auth, googleProvider } from "./firebase.js";

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Google login.
document.getElementById("googleLogin").onclick = async () => {
  await signInWithPopup(auth, googleProvider);

  window.location.href = "./firebaseTest.html";
};

// Email login.
document.getElementById("emailLogin").onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await signInWithEmailAndPassword(auth, email, password);

  window.location.href = "./firebaseTest.html";
};

// Create account.
document.getElementById("createAccount").onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await createUserWithEmailAndPassword(auth, email, password);

  window.location.href = "./firebaseTest.html";
};
