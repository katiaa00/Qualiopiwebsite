/* Comportements communs : liens Drive, en-tête/pied de page, menu mobile, apparitions. */
(function () {
  const S = window.SITE;

  /* Transforme un lien Drive /edit en consultation (preview) ou téléchargement PDF */
  function docUrl(key, mode) {
    const m = (S.docs[key] || "").match(/\/d\/([^/]+)/);
    if (!m) return "#";
    return "https://docs.google.com/document/d/" + m[1] +
      (mode === "download" ? "/export?format=pdf" : "/preview");
  }

  const page = document.body.dataset.page;
  const cur = (p) => (page === p ? ' aria-current="page"' : "");

  /* En-tête commun (une seule source pour toutes les pages) */
  document.getElementById("site-header").innerHTML = `
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="index.html" aria-label="${S.orgName} – Accueil">
        <img src="assets/logo-organisme.png" alt="" width="95" height="44">
        <span class="brand-name" data-org></span>
      </a>
      <button class="burger" aria-expanded="false" aria-controls="main-nav" aria-label="Ouvrir le menu">
        <span></span><span></span><span></span>
      </button>
      <nav id="main-nav" class="main-nav" aria-label="Navigation principale">
        <ul>
          <li><a href="index.html"${cur("accueil")}>Accueil</a></li>
          <li><a href="formations.html"${cur("formations")}>Nos formations</a></li>
        </ul>
      </nav>
    </div>
  </header>`;

  /* Pied de page commun */
  document.getElementById("site-footer").innerHTML = `
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-id">
        <img src="assets/qualiopi-logo.svg" alt="Emplacement du logo Qualiopi" width="160" height="60" loading="lazy">
        <p class="footer-name" data-org></p>
      </div>
      <nav aria-label="Liens utiles">
        <ul>
          <li><a href="#" data-doc="cgv">CGV</a></li>
          <li><a href="mentions-legales.html">Mentions légales</a></li>
          <li><a href="#" data-doc="reglement">Règlement intérieur</a></li>
          <li><a href="#" data-doc="accessibilite">Politique d'accessibilité (handicap)</a></li>
          <li><a href="#" data-doc="amelioration">Formulaire d'amélioration</a></li>
        </ul>
      </nav>
    </div>
    <p class="copy">© ${new Date().getFullYear()} <span data-org></span></p>
  </footer>`;

  /* Remplissage des variables et des liens Drive (nouvel onglet, sécurisé) */
  document.querySelectorAll("[data-org]").forEach((e) => (e.textContent = S.orgName));
  document.querySelectorAll("[data-formation]").forEach((e) => (e.textContent = S.formationTitle));
  document.querySelectorAll("[data-email]").forEach((e) => {
    e.textContent = S.email; e.href = "mailto:" + S.email;
  });
  document.querySelectorAll("[data-doc]").forEach((a) => {
    a.href = docUrl(a.dataset.doc, a.dataset.mode);
    a.target = "_blank"; a.rel = "noopener noreferrer";
  });

  /* Menu burger accessible */
  const burger = document.querySelector(".burger");
  const nav = document.getElementById("main-nav");
  function toggle(open) {
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    nav.classList.toggle("open", open);
  }
  burger.addEventListener("click", () => toggle(burger.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) { toggle(false); burger.focus(); }
  });

  /* Apparition douce au scroll (désactivée si l'utilisateur réduit les animations) */
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    items.forEach((i) => io.observe(i));
  } else items.forEach((i) => i.classList.add("in"));
})();
