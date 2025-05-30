import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  serverTimestamp
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
const db = getFirestore(app);

const modalContainer = document.getElementById("modalContainer");

document.addEventListener("click", async (e) => {
  const target = e.target;

  if (target.matches(".add-affiliate-btn")) {
    try {
      const response = await fetch("modals/create-affiliate.html");
      const html = await response.text();

      modalContainer.innerHTML = html;
      modalContainer.style.display = "flex";

      // 🟢 Charger dynamiquement les campagnes depuis Firestore
      const campaignSelect = modalContainer.querySelector("#campaign-select");
      if (campaignSelect) {
        const campaignsSnapshot = await getDocs(query(collection(db, "campaigns")));
        campaignsSnapshot.forEach((doc) => {
          const option = document.createElement("option");
          option.value = doc.id;
          option.textContent = doc.data().name || doc.id;
          campaignSelect.appendChild(option);
        });
      }

      setTimeout(() => {
        const step1 = modalContainer.querySelector(".step-1");
        const step2 = modalContainer.querySelector(".step-2");

        const generateBtn = modalContainer.querySelector("#generate-link-btn");
        const closeBtn = modalContainer.querySelector("#close-affiliate-modal-btn");
        const copyBtn = modalContainer.querySelector("#copy-affiliate-link-btn");

        if (generateBtn) {
          generateBtn.addEventListener("click", async () => {
            const campaign = modalContainer.querySelector("#campaign-select").value.trim();
            const username = modalContainer.querySelector("#affiliate-username").value.trim();
            const commissionType = modalContainer.querySelector("#commission-type").value;
            const commissionValue = modalContainer.querySelector("#commission-value").value.trim();

            if (!campaign || !username || !commissionType || !commissionValue) {
              alert("Veuillez remplir tous les champs obligatoires.");
              return;
            }

            const affiliateLink = `https://refspring.app/c/${campaign}?ref=${username}`;
            console.log("✅ Lien généré :", affiliateLink);

            try {
              await addDoc(collection(db, "affiliates"), {
                campaign,
                username,
                commissionType,
                commissionValue: Number(commissionValue),
                createdAt: serverTimestamp()
              });
              console.log("✅ Affilié enregistré dans Firestore");
            } catch (err) {
              console.error("❌ Erreur Firestore :", err);
              alert("Erreur lors de l'enregistrement dans la base.");
              return;
            }

            step1.style.display = "none";
            step2.style.display = "flex";

            // ✅ Correction ici
            setTimeout(() => {
              const linkEl = modalContainer.querySelector("#affiliate-link");
              if (!linkEl) {
                console.error("❌ Élément #affiliate-link introuvable !");
              } else {
                linkEl.value = affiliateLink;
                console.log("✅ Lien inséré dans l’input avec succès");
              }
            }, 10);
          });
        }

        if (copyBtn) {
          copyBtn.addEventListener("click", () => {
            const input = modalContainer.querySelector("#affiliate-link");
            if (!input) return;

            input.select();
            document.execCommand("copy");

            copyBtn.src = "../assets/mingcute_check-fill.svg";
            setTimeout(() => {
              copyBtn.src = "../assets/mingcute_copy-2-line.svg";
            }, 2000);
          });
        }

        if (closeBtn) {
          closeBtn.addEventListener("click", () => {
            modalContainer.innerHTML = "";
            modalContainer.style.display = "none";
          });
        }

        modalContainer.addEventListener("click", (e) => {
          if (e.target === modalContainer) {
            modalContainer.innerHTML = "";
            modalContainer.style.display = "none";
          }
        });
      }, 0);
    } catch (err) {
      console.error("❌ Erreur lors du chargement de la modale affilié :", err);
    }
  }
});