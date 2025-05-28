import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAlHsC-w7Sx18XKJ6dIcxvqj-AUdqkjqSE",
  authDomain: "refspring-8c3ac.firebaseapp.com",
  projectId: "refspring-8c3ac",
  storageBucket: "refspring-8c3ac.firebasestorage.app",
  messagingSenderId: "519439687826",
  appId: "1:519439687826:web:c0644e224f4ca23b57864b",
  measurementId: "G-QNK35Y7EE4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (signInError) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";
    } catch (signUpError) {
      alert("Erreur : " + signUpError.message);
    }
  }
});