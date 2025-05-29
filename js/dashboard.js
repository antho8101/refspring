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

// 🔐 Redirection si utilisateur non connecté
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

// 🔁 Réinjection du lien si bloqué
const link = document.querySelector('.campaign-link');
const defaultUrl = "https://refspring.app/c/oridium";

if (link) {
  const observer = new MutationObserver(() => {
    if (!link.textContent.trim()) {
      link.textContent = defaultUrl;
    }
  });
  observer.observe(link, { childList: true });
} else {
  console.warn("⚠️ Élément '.affiliate-link' introuvable. Skip MutationObserver.");
}

// 🟢 Ouverture modale
const createBtn = document.getElementById("createCampaignBtn");
if (createBtn) {
  createBtn.addEventListener("click", openCreateCampaignModal);
}

async function openCreateCampaignModal() {
  console.log("🟣 Clic sur le bouton 'Créer une campagne'");
  const modalContainer = document.getElementById("modalContainer");

  try {
    const response = await fetch("modals/create-campaign.html");
    const html = await response.text();
    modalContainer.innerHTML = html;
    modalContainer.style.display = "flex";

    const step1 = modalContainer.querySelector(".step-1");
    const step2 = modalContainer.querySelector(".step-2");

    if (step1 && step2) {
      step1.style.display = "flex";
      step2.style.display = "none";

      const nextBtn = modalContainer.querySelector("#next-step-btn");
      nextBtn.addEventListener("click", () => {
        step1.style.display = "none";
        step2.style.display = "flex";

        // ⬇️ Bouton Terminer désormais visible → on peut l'écouter ici
        const finishBtn = modalContainer.querySelector("#finish-btn");
        if (finishBtn) {
          finishBtn.addEventListener("click", () => {
            modalContainer.innerHTML = "";
            modalContainer.style.display = "none";
          });
        }
      });
    }

    modalContainer.addEventListener("click", (e) => {
      if (e.target === modalContainer) {
        modalContainer.innerHTML = "";
        modalContainer.style.display = "none";
      }
    });

    const copyBtn = modalContainer.querySelector("#copy-integration-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const code = modalContainer.querySelector("#integration-code");
        code.select();
        document.execCommand("copy");
        copyBtn.textContent = "Copié ! ✅";
        setTimeout(() => {
          copyBtn.innerHTML = `<img src="../assets/mingcute_copy-2-line.svg" width="16" height="16" /> Copier`;
        }, 2000);
      });
    }

    const copyLinkBtn = modalContainer.querySelector("#copy-link-btn");
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener("click", () => {
        const linkInput = modalContainer.querySelector("#generated-link");
        const range = document.createRange();
        range.selectNode(linkInput);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
        copyLinkBtn.textContent = "Copié ! ✅";
        setTimeout(() => {
          copyLinkBtn.innerHTML = `<img src="../assets/mingcute_copy-2-line.svg" width="16" height="16" /> Copier`;
        }, 2000);
      });
    }

  } catch (error) {
    console.error("Erreur lors du chargement de la modale :", error);
  }
}

const copyDashboardLinkBtn = document.getElementById("copy-dashboard-link-btn");
const campaignLinkInput = document.querySelector(".campaign-link");

if (copyDashboardLinkBtn && campaignLinkInput) {
  copyDashboardLinkBtn.addEventListener("click", () => {
    campaignLinkInput.select();
    document.execCommand("copy");
    copyDashboardLinkBtn.src = "assets/mingcute_check-fill.svg";

    setTimeout(() => {
      copyDashboardLinkBtn.src = "assets/mingcute_copy-2-line.svg";
    }, 2000);
  });
}