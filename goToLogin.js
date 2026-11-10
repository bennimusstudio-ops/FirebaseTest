import { auth } from "./firebase.js";
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const loginStatus = document.getElementById("login-status");
const signInOutButton = document.getElementById("sign-in-out-button");

onAuthStateChanged(auth, (user) => {
    if (loginStatus) {
        loginStatus.textContent = user ? "Logged In" : "Logged Out";
    }

    if (user) {
        signInOutButton.textContent = "Sign Out";
    } else {
        signInOutButton.textContent = "Sign In";
    }
});

signInOutButton.onclick = async () => {
    if (auth.currentUser) {
        await signOut(auth);
    } else {
        window.location.href = "./loginPage.html";
    }
};
