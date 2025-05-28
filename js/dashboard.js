import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

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

// 🔐 Protection : rediriger si non connecté
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

// 🔓 Déconnexion
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "index.html";
    } catch (error) {
      alert("Erreur lors de la déconnexion : " + error.message);
    }
  });
}

const link = document.querySelector('.affiliate-link');
const defaultUrl = "https://refspring.app/c/oridium";

// Boucle de réinjection si une extension le vide
const observe = new MutationObserver(() => {
  if (!link.textContent.trim()) {
    link.textContent = defaultUrl;
  }
});

observe.observe(link, { childList: true });