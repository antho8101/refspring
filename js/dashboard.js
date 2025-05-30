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
  dashboardMain.innerHTML = ""; // On vide tout au début

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

  // ✅ NE PAS afficher le dashboard ici. On attend un clic utilisateur.
  // Donc PAS de dashboardMain.innerHTML ici.

  // Remplir la liste des campagnes (menu de gauche)
  snapshot.forEach((docSnap) => {
    const li = document.createElement("li");
    li.className = "campaign-item";
    li.textContent = docSnap.data().name;
    li.dataset.id = docSnap.id;

    li.addEventListener("click", () => {
      // Retirer la classe active de tous les éléments
      document.querySelectorAll(".campaign-item").forEach(el => el.classList.remove("active"));
      li.classList.add("active");
      selectCampaign(docSnap.id, docSnap.data().name);
    });

    campaignList.appendChild(li);
  });
}

async function selectCampaign(campaignId, campaignName) {
  if (!dashboardMain) return;

  dashboardMain.innerHTML = `
    <div class="header-bar-container">
      <h2 class="campaign-title">${campaignName}</h2>

      <div class="link-bar">
        <input type="text" class="campaign-link" value="https://refspring.app/c/${campaignName.toLowerCase().replace(/\s+/g, '-')}" readonly />
        <img src="assets/mingcute_copy-2-line.svg" alt="Copier le lien" class="icon copy-icon" id="copy-dashboard-link-btn" />
      </div>

      <button class="btn">
        <img src="assets/mingcute_gear.svg" alt="Paramètres" />
      </button>

      <button class="btn add-affiliate-btn">
        <span class="h2-style">Ajouter un affilié</span>
      </button>

      <button class="btn send-link-btn">
        <img src="assets/mingcute_send-plane-line.svg" alt="Envoyer le lien" />
        <span class="h2-style">Envoyer le lien</span>
      </button>
    </div>

    <div class="separator"></div>

    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-title">
          <img src="assets/mingcute_seal-line.svg" />
          <span>Nombre d’affiliés</span>
        </div>
        <div class="stat-value"><span>-</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-title">
          <img src="assets/mingcute_inspect-line.svg" />
          <span>Total clics</span>
        </div>
        <div class="stat-value"><span>-</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-title">
          <img src="assets/mingcute_bank-card-line.svg" />
          <span>Total paiements</span>
        </div>
        <div class="stat-value"><span>-</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-title">
          <img src="assets/mingcute_aiming-line.svg" />
          <span>Taux de conversion</span>
        </div>
        <div class="stat-value"><span>-</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-title">
          <img src="assets/mingcute_pig-money-line.svg" />
          <span>Total CA généré</span>
        </div>
        <div class="stat-value"><span>-</span></div>
      </div>
    </div>

    <div class="table-section">
      <div class="table-col">
        <p class="table-title">Affilié</p>
        <div class="separator"></div>
        <div class="table-value placeholder"><span>-</span></div>
      </div>
      <div class="table-col">
        <p class="table-title">Produit</p>
        <div class="separator"></div>
        <div class="table-value placeholder"><span>-</span></div>
      </div>
      <div class="table-col">
        <p class="table-title">Clics</p>
        <div class="separator"></div>
        <div class="table-value placeholder"><span>-</span></div>
      </div>
      <div class="table-col">
        <p class="table-title">Paiements</p>
        <div class="separator"></div>
        <div class="table-value placeholder"><span>-</span></div>
      </div>
      <div class="table-col">
        <p class="table-title">CA généré</p>
        <div class="separator"></div>
        <div class="table-value placeholder"><span>-</span></div>
      </div>
      <div class="table-col">
        <p class="table-title">Commission</p>
        <div class="separator"></div>
        <div class="table-value placeholder"><span>-</span></div>
      </div>
    </div>
  `;

  document.querySelector(".add-affiliate-btn")?.addEventListener("click", openAddAffiliateModal);
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
        const name = modalContainer.querySelector("#campaign-name")?.value.trim();
        const url = modalContainer.querySelector("#redirect-url")?.value.trim();

        if (!name || !url) {
          alert("Merci de remplir tous les champs.");
          return;
        }

        // Générer le slug
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

        // Injecter le lien et le script dans la deuxième étape
        modalContainer.querySelector("#generated-link").value = `https://refspring.app/c/${slug}`;
        modalContainer.querySelector("#integration-code").value = 
`<script src="https://refspring.app/sdk.js"></script>
<script>
  RefSpring.init({
    campaign: "${slug}"
  });
</script>`;

        step1.style.display = "none";
        step2.style.display = "flex";

        // Ajouter fonction copier
        modalContainer.querySelector("#copy-link-btn")?.addEventListener("click", () => {
          const input = modalContainer.querySelector("#generated-link");
          input.select();
          document.execCommand("copy");
        });

        modalContainer.querySelector("#copy-integration-btn")?.addEventListener("click", () => {
          const textarea = modalContainer.querySelector("#integration-code");
          textarea.select();
          document.execCommand("copy");
        });

        // Bouton "Terminer"
        modalContainer.querySelector("#finish-btn")?.addEventListener("click", async () => {
          await createCampaign(modalContainer, slug, url);
          modalContainer.innerHTML = "";
          modalContainer.style.display = "none";
          await renderCampaigns();
        });
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
  const urlInput = modalContainer.querySelector("#redirect-url");
  const trackClicks = modalContainer.querySelector("#track-clicks")?.checked;
  const trackPayments = modalContainer.querySelector("#track-payments")?.checked;

  const name = nameInput?.value.trim();
  const redirectUrl = urlInput?.value.trim();

  if (!name || !redirectUrl) {
    alert("Merci de remplir tous les champs.");
    return;
  }

  try {
    await addDoc(collection(db, "campaigns"), {
      name,
      redirectUrl,
      trackClicks,
      trackPayments,
      createdAt: serverTimestamp(),
    });
    console.log("✅ Campagne créée avec succès !");
  } catch (err) {
    console.error("❌ Erreur lors de la création de la campagne :", err);
    alert("Erreur lors de la création de la campagne.");
  }
}

async function openAddAffiliateModal() {
  const modalContainer = document.getElementById("modalContainer");
  if (!modalContainer) return;

  const res = await fetch("modals/create-affiliate.html");
  const html = await res.text();
  modalContainer.innerHTML = html;
  modalContainer.style.display = "flex";
  modalContainer.classList.add("active");

  // 🧠 Remplir dynamiquement la liste des campagnes
  const selectEl = modalContainer.querySelector("#campaign-select");
  if (selectEl) {
    const q = query(collection(db, "campaigns"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const option = document.createElement("option");
      option.value = data.name.toLowerCase().replace(/\s+/g, '-'); // valeur utilisée dans l'URL
      option.textContent = data.name; // affichage utilisateur
      selectEl.appendChild(option);
    });
  }

  const generateBtn = modalContainer.querySelector("#generate-link-btn");
  if (!generateBtn) return;

  generateBtn.addEventListener("click", async () => {
    const campaign = modalContainer.querySelector("#campaign-select")?.value;
    const username = modalContainer.querySelector("#affiliate-username")?.value.trim();
    const type = modalContainer.querySelector("#commission-type")?.value;
    const value = modalContainer.querySelector("#commission-value")?.value.trim();

    if (!campaign || !username || !type || !value) {
      alert("Merci de remplir tous les champs.");
      return;
    }

    try {
      await addDoc(collection(db, "affiliates"), {
        campaign,
        username,
        commissionType: type,
        commissionValue: Number(value),
        createdAt: serverTimestamp(),
      });

      const affiliateLink = `https://refspring.app/c/${campaign}?ref=${username}`;
      modalContainer.querySelector("#affiliate-link").textContent = affiliateLink;

      modalContainer.querySelector(".step-1").style.display = "none";
      modalContainer.querySelector(".step-2").style.display = "flex";

      const copyBtn = modalContainer.querySelector("#copy-affiliate-link-btn");
      if (copyBtn) {
        copyBtn.addEventListener("click", () => {
          navigator.clipboard.writeText(affiliateLink);
        });
      }

      const closeBtn = modalContainer.querySelector("#close-affiliate-modal-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          modalContainer.classList.remove("active");
          modalContainer.innerHTML = "";
          document.querySelector(".dashboard-main")?.classList.remove("blurred");
        });
      }

    } catch (err) {
      console.error("Erreur lors de la création de l’affilié :", err);
      alert("Erreur lors de la création de l’affilié.");
    }
  });

  // Clique en dehors de la modale
  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer || e.target.classList.contains("close-modal")) {
      modalContainer.classList.remove("active");
      modalContainer.innerHTML = "";
      modalContainer.style.display = "none";
      document.querySelector(".dashboard-main")?.classList.remove("blurred");
    }
  });
}