// E:/RefSpring/js/affiliate.js

document.addEventListener("DOMContentLoaded", () => {
  const addAffiliateBtn = document.querySelector(".add-affiliate-btn");
  const modalContainer = document.getElementById("modalContainer");

  if (!addAffiliateBtn || !modalContainer) {
    console.warn("🟡 Bouton ou conteneur de modale manquant.");
    return;
  }

  addAffiliateBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("modals/create-affiliate.html");
      const html = await response.text();

      modalContainer.innerHTML = html;
      modalContainer.style.display = "flex";

      // 💡 On attend que le DOM injecté soit bien "mis en place"
      setTimeout(() => {
        const step1 = modalContainer.querySelector(".step-1");
        const step2 = modalContainer.querySelector(".step-2");

        const generateBtn = modalContainer.querySelector("#generate-link-btn");
        const closeBtn = modalContainer.querySelector("#close-affiliate-modal-btn");
        const copyBtn = modalContainer.querySelector("#copy-affiliate-link-btn");

        if (generateBtn) {
          generateBtn.addEventListener("click", () => {
            const campaign = modalContainer.querySelector("#campaign-select").value.trim();
            const username = modalContainer.querySelector("#affiliate-username").value.trim();

            if (!campaign || !username) {
              alert("Veuillez remplir tous les champs obligatoires.");
              return;
            }

            const linkEl = modalContainer.querySelector("#affiliate-link");
            linkEl.textContent = `https://refspring.app/c/${campaign}?ref=${username}`;

            step1.style.display = "none";
            step2.style.display = "flex";
          });
        }

        if (copyBtn) {
          copyBtn.addEventListener("click", () => {
            const linkText = modalContainer.querySelector("#affiliate-link").textContent;
            navigator.clipboard.writeText(linkText).then(() => {
              copyBtn.src = "../assets/mingcute_check-fill.svg";
              setTimeout(() => {
                copyBtn.src = "../assets/mingcute_copy-2-line.svg";
              }, 2000);
            });
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
      }, 0); // ⏱️ force le DOM à s'appliquer avant d'ajouter les événements

    } catch (err) {
      console.error("❌ Erreur lors du chargement de la modale affilié :", err);
    }
  });
});