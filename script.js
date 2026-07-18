/*
  ===== REPOSITORY GITHUB =====
  Le site trouve automatiquement le .exe (ou le .zip) de la dernière Release.
  Tu n'as donc pas besoin d'écrire le nom du fichier ici.
*/
const GITHUB_REPOSITORY = "hypcarlitoo/HYPFN";
const RELEASE_API_URL = `https://api.github.com/repos/${GITHUB_REPOSITORY}/releases/latest`;
const RELEASE_PAGE_URL = `https://github.com/${GITHUB_REPOSITORY}/releases/latest`;

const views = [...document.querySelectorAll("[data-view]")];
const routes = [...document.querySelectorAll("[data-route]")];
const nav = document.querySelector(".site-nav");
const menuToggle = document.querySelector(".menu-toggle");
const toast = document.querySelector("#toast");
const downloadLinks = [...document.querySelectorAll(".download-link")];
const cursorGlow = document.createElement("div");
cursorGlow.className = "cursor-glow";
cursorGlow.setAttribute("aria-hidden", "true");
document.body.append(cursorGlow);
let toastTimer;
let downloadReady = false;

function showToast(message) {
  toast.innerHTML = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3800);
}

function showView() {
  const requested = window.location.hash.slice(1);
  const name = views.some((view) => view.dataset.view === requested) ? requested : "accueil";

  views.forEach((view) => {
    view.classList.toggle("active", view.dataset.view === name);
  });

  routes.forEach((route) => {
    route.setAttribute("aria-current", route.dataset.route === name ? "page" : "false");
  });

  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.title = `${name.charAt(0).toUpperCase() + name.slice(1)} — HYPCARLITOO Launcher`;
}

routes.forEach((route) => {
  route.addEventListener("click", () => {
    // Si le joueur clique déjà sur l'onglet ouvert, on remet la page en haut.
    if (window.location.hash === `#${route.dataset.route}`) showView();
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

function setDownloadLinks(url) {
  downloadLinks.forEach((link) => {
    link.href = url;
    link.rel = "noopener";
  });
}

async function findLatestDownload() {
  // En attendant la réponse, le bouton ouvre la page Releases plutôt qu'une page 404.
  setDownloadLinks(RELEASE_PAGE_URL);

  try {
    const response = await fetch(RELEASE_API_URL, {
      headers: { Accept: "application/vnd.github+json" }
    });

    if (!response.ok) throw new Error("Aucune Release publiée");

    const release = await response.json();
    const asset = release.assets.find((file) => /\.(exe|msi)$/i.test(file.name))
      || release.assets.find((file) => /\.zip$/i.test(file.name))
      || release.assets[0];

    if (!asset) throw new Error("Aucun fichier dans la Release");

    setDownloadLinks(asset.browser_download_url);
    downloadReady = true;
  } catch (error) {
    // La page Releases permet au visiteur de voir ce qui manque si la Release n'est pas encore publiée.
    downloadReady = false;
  }
}

downloadLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const message = downloadReady
      ? "<strong>Téléchargement :</strong> ouverture du fichier de la dernière version."
      : "<strong>Release introuvable :</strong> ouverture de la page des Releases.";
    showToast(message);
  });
});

window.addEventListener("pointermove", (event) => {
  if (event.pointerType !== "mouse") return;
  document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
  document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
  document.body.classList.add("mouse-active");
});

window.addEventListener("hashchange", showView);
document.querySelector("#year").textContent = new Date().getFullYear();
findLatestDownload();
showView();
