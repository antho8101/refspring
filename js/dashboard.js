import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
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

      <button class="btn" id="settings-btn">
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

  document.querySelector("#settings-btn")?.addEventListener("click", () => {
  openSettingsModal(campaignId, campaignName);
});
  document.querySelector(".add-affiliate-btn")?.addEventListener("click", openAddAffiliateModal);

  // 🟢 Injecter les affiliés de cette campagne dans le tableau
  const affiliatesQuery = query(collection(db, "affiliates"));
  const snapshot = await getDocs(affiliatesQuery);

  // Filtrer les affiliés de cette campagne
  const affiliates = snapshot.docs
    .map(doc => doc.data())
    .filter(aff => aff.campaign === campaignName.toLowerCase().replace(/\s+/g, '-'));

  if (!affiliates.length) return;

  // Supprimer les placeholders
  document.querySelectorAll(".table-value.placeholder").forEach(el => el.remove());

  // Ajouter dynamiquement les lignes du tableau
  affiliates.forEach(aff => {
    const row = [
      aff.username,
      "—", // Produit (à compléter plus tard)
      "—", // Clics
      "—", // Paiements
      "—", // CA
      `${aff.commissionValue} ${aff.commissionType === "percentage" ? "%" : "€"}`
    ];

    const cols = document.querySelectorAll(".table-col");
    cols.forEach((col, index) => {
      const div = document.createElement("div");
      div.className = "table-value";
      div.textContent = row[index];
      col.appendChild(div);
    });
  });

  // Mettre à jour la stat "Nombre d’affiliés"
  const statEl = document.querySelectorAll(".stat-card .stat-value span")[0];
  if (statEl) statEl.textContent = affiliates.length.toString();
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

  const selectEl = modalContainer.querySelector("#campaign-select");
  if (selectEl) {
    const q = query(collection(db, "campaigns"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const option = document.createElement("option");
      option.value = data.name.toLowerCase().replace(/\s+/g, '-');
      option.textContent = data.name;
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

  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer || e.target.classList.contains("close-modal")) {
      modalContainer.classList.remove("active");
      modalContainer.innerHTML = "";
      modalContainer.style.display = "none";
      document.querySelector(".dashboard-main")?.classList.remove("blurred");
    }
  });
}

// ✅ Gestion du bouton paramètres (sans fetch)
const openBtn = document.getElementById('settings-btn');
const modal = document.getElementById('settings-modal');
const closeBtn = modal?.querySelector('.close-modal');

if (openBtn && modal && closeBtn) {
  openBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal.querySelector('#delete-campaign')?.addEventListener('click', () => {
    if (confirm('Supprimer la campagne ?')) {
      console.log('Suppression de la campagne...');
      // TODO: logique réelle
    }
  });

  modal.querySelector('#delete-affiliate')?.addEventListener('click', () => {
    if (confirm('Supprimer un affilié ?')) {
      console.log('Suppression d’un affilié...');
      // TODO: logique réelle
    }
  });
}

async function openSettingsModal(campaignId, campaignName) {
  const modalContainer = document.getElementById("modalContainer");
  if (!modalContainer) return;

  try {
    const res = await fetch("modals/settings.html");
    const html = await res.text();
    modalContainer.innerHTML = html;
    modalContainer.style.display = "flex";
    modalContainer.classList.add("active");

    const currentCampaignSlug = campaignName.toLowerCase().replace(/\s+/g, '-');
    console.log("🔍 currentCampaignSlug =", currentCampaignSlug);
    console.log("🔧 campaignId =", campaignId);

    // Fermer la modale
    const closeBtn = modalContainer.querySelector(".close-modal");
    closeBtn?.addEventListener("click", () => {
      modalContainer.innerHTML = "";
      modalContainer.style.display = "none";
      modalContainer.classList.remove("active");
    });

    // 🗑 Supprimer la campagne
    const deleteCampaignBtn = modalContainer.querySelector("#delete-campaign");
    deleteCampaignBtn?.addEventListener("click", async () => {
      if (confirm("Supprimer la campagne ?")) {
        try {
          console.log("🔥 Tentative suppression Firestore : campaigns/" + campaignId);
          await deleteDoc(doc(db, "campaigns", campaignId));
          alert("Campagne supprimée.");
          modalContainer.innerHTML = "";
          modalContainer.style.display = "none";
          await renderCampaigns();
        } catch (err) {
          console.error("❌ Erreur lors de la suppression de la campagne :", err);
          alert("Erreur lors de la suppression de la campagne.");
        }
      }
    });

    // 🔄 Charger les affiliés liés à cette campagne
    const affRes = await getDocs(collection(db, "affiliates"));
    const affiliates = affRes.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(aff => aff.campaign === currentCampaignSlug);

    const selectEl = modalContainer.querySelector("#affiliate-select");
    affiliates.forEach((aff) => {
      const opt = document.createElement("option");
      opt.value = aff.id;
      opt.textContent = aff.username;
      selectEl.appendChild(opt);
    });

    // 🪪 Remplir la commission de l’affilié sélectionné
    selectEl.addEventListener("change", (e) => {
      const selected = affiliates.find(a => a.id === e.target.value);
      if (selected) {
        const value = selected.commissionType === "percentage"
          ? `${selected.commissionValue}%`
          : `${selected.commissionValue}`;
        modalContainer.querySelector("#commission-value").value = value;
      }
    });

    // ✏️ Mettre à jour la commission
    modalContainer.querySelector("#update-affiliate")?.addEventListener("click", async () => {
      const id = selectEl.value;
      const val = modalContainer.querySelector("#commission-value").value.trim();

      if (!id || !val) {
        alert("Merci de sélectionner un affilié et d’entrer une commission.");
        return;
      }

      const value = parseFloat(val.replace("%", ""));
      const type = val.includes("%") ? "percentage" : "fixed";

      try {
        await updateDoc(doc(db, "affiliates", id), {
          commissionValue: value,
          commissionType: type,
        });
        alert("Commission mise à jour !");
      } catch (err) {
        console.error("❌ Erreur mise à jour commission :", err);
        alert("Erreur lors de la mise à jour.");
      }
    });

    // 🗑 Supprimer un affilié
    modalContainer.querySelector("#delete-affiliate")?.addEventListener("click", async () => {
      const id = selectEl.value;
      if (!id) return alert("Aucun affilié sélectionné.");

      if (confirm("Supprimer cet affilié ?")) {
        try {
          await deleteDoc(doc(db, "affiliates", id));
          alert("Affilié supprimé.");
          modalContainer.innerHTML = "";
          modalContainer.style.display = "none";
          await selectCampaign(campaignId, campaignName);
        } catch (err) {
          console.error("❌ Erreur suppression affilié :", err);
          alert("Erreur lors de la suppression.");
        }
      }
    });

    // Fermer en cliquant hors de la modale
    modalContainer.addEventListener("click", (e) => {
      if (e.target === modalContainer) {
        modalContainer.innerHTML = "";
        modalContainer.style.display = "none";
        modalContainer.classList.remove("active");
      }
    });

  } catch (error) {
    console.error("❌ Erreur chargement modale settings :", error);
  }
}
