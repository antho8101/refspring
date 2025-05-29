import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

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
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    await renderCampaigns();
  }
});

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

const campaignList = document.querySelector(".campaign-list");
const campaignTitle = document.querySelector(".dashboard-main .campaign-title");
const statsSection = document.querySelector(".stats-section");
const tableSection = document.querySelector(".table-section");
const headerBar = document.querySelector(".header-bar-container");
const dashboardMain = document.querySelector(".dashboard-main");

async function renderCampaigns() {
  if (!campaignList) return;
  campaignList.innerHTML = "";
  dashboardMain.innerHTML = ""; // Nettoyage

  const q = query(collection(db, "campaigns"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    const emptyContainer = document.createElement("div");
    emptyContainer.className = "empty-state";
    emptyContainer.style.flex = "1";
    emptyContainer.style.display = "flex";
    emptyContainer.style.flexDirection = "column";
    emptyContainer.style.alignItems = "center";
    emptyContainer.style.justifyContent = "center";
    emptyContainer.style.padding = "40px";
    emptyContainer.style.gap = "20px";
    emptyContainer.innerHTML = `
      <h2>Aucune campagne pour le moment</h2>
      <p>Crée ta première campagne pour démarrer ton programme d'affiliation !</p>
      <button class="btn" id="createCampaignBtnEmpty">
        <img src="assets/mingcute_plus-fill.svg" alt="+" width="16" height="16" />
        Créer ma première campagne
      </button>
    `;

    dashboardMain.appendChild(emptyContainer);

    document.getElementById("createCampaignBtnEmpty").addEventListener("click", openCreateCampaignModal);
    return;
  }

  // Affichage des blocs du dashboard
  dashboardMain.innerHTML = `
    <div class="header-bar-container"> ... </div>
    <div class="separator"></div>
    <div class="stats-section"> ... </div>
    <div class="table-section"> ... </div>
  `;

  // Remplir le menu de gauche avec les campagnes
  snapshot.forEach((docSnap, index) => {
    const li = document.createElement("li");
    li.className = "campaign-item";
    if (index === 0) li.classList.add("active");
    li.textContent = docSnap.data().name;
    li.dataset.id = docSnap.id;
    li.addEventListener("click", () => selectCampaign(docSnap.id, docSnap.data().name));
    campaignList.appendChild(li);

    if (index === 0) {
      selectCampaign(docSnap.id, docSnap.data().name);
    }
  });
}

async function selectCampaign(campaignId, campaignName) {
  campaignTitle.textContent = campaignName;
  const campaignLinkInput = document.querySelector(".campaign-link");
  if (campaignLinkInput) {
    campaignLinkInput.value = `https://refspring.app/c/${campaignName.toLowerCase().replace(/\s+/g, '-')}`;
  }
}

const createBtn = document.getElementById("createCampaignBtn");
if (createBtn) {
  createBtn.addEventListener("click", openCreateCampaignModal);
}

async function openCreateCampaignModal() {
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

        const finishBtn = modalContainer.querySelector("#finish-btn");
        if (finishBtn) {
          finishBtn.addEventListener("click", async () => {
            await createCampaign(modalContainer);
            modalContainer.innerHTML = "";
            modalContainer.style.display = "none";
            await renderCampaigns();
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
  } catch (error) {
    console.error("Erreur lors du chargement de la modale :", error);
  }
}

async function createCampaign(modalContainer) {
  const nameInput = modalContainer.querySelector("#campaign-name");
  const commissionInput = modalContainer.querySelector("#commission-amount");
  const typeSelect = modalContainer.querySelector("#commission-type");

  const name = nameInput?.value.trim();
  const commission = parseFloat(commissionInput?.value);
  const commissionType = typeSelect?.value;

  if (!name || isNaN(commission) || !commissionType) {
    alert("Merci de remplir tous les champs.");
    return;
  }

  try {
    await addDoc(collection(db, "campaigns"), {
      name,
      commission,
      commissionType,
      createdAt: serverTimestamp(),
    });
    console.log("✅ Campagne créée avec succès !");
  } catch (err) {
    console.error("❌ Erreur lors de la création de la campagne :", err);
    alert("Erreur lors de la création de la campagne.");
  }
}