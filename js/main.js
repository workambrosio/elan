/* ==========================================================================
   Élan Advisor — JS partilhado
   Menu mobile, scroll reveal e validação do formulário de contacto
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initScrollReveal();
  initContactForm();
  initSuccessBanner();
  initFaq();
  initMobileCta();
});

/* ---------- Menu mobile ---------- */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const navList = document.getElementById("navList");

  if (!toggle || !navList) return;

  const overlay = document.createElement("div");
  overlay.className = "nav-overlay";
  overlay.id = "navOverlay";
  document.body.appendChild(overlay);

  const closeNav = () => {
    navList.classList.remove("open");
    toggle.classList.remove("open");
    overlay.classList.remove("open");
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
  };

  const openNav = () => {
    navList.classList.add("open");
    toggle.classList.add("open");
    overlay.classList.add("open");
    document.body.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fechar menu");
  };

  toggle.addEventListener("click", () => {
    if (navList.classList.contains("open")) {
      closeNav();
    } else {
      openNav();
    }
  });

  overlay.addEventListener("click", closeNav);

  navList.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });
}

/* ---------- Scroll reveal ---------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");

  if (!revealEls.length) return;

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ---------- Validação do formulário de contacto ---------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", (event) => {
    let isValid = true;

    const requiredFields = [
      { id: "nome", groupId: "group-nome", check: (v) => v.trim().length > 0 },
      { id: "email", groupId: "group-email", check: (v) => emailPattern.test(v.trim()) },
      { id: "mensagem", groupId: "group-mensagem", check: (v) => v.trim().length > 0 },
    ];

    requiredFields.forEach(({ id, groupId, check }) => {
      const field = document.getElementById(id);
      const group = document.getElementById(groupId);
      if (!field || !group) return;

      const fieldValid = check(field.value);
      group.classList.toggle("has-error", !fieldValid);
      if (!fieldValid) isValid = false;
    });

    if (!isValid) {
      event.preventDefault();
    }
  });

  // Remove error state as soon as the visitor starts fixing a field
  form.querySelectorAll("input, textarea, select").forEach((field) => {
    field.addEventListener("input", () => {
      const group = field.closest(".form-group");
      if (group) group.classList.remove("has-error");
    });
  });
}

/* ---------- Mensagem de sucesso (após redirect do Netlify Forms) ---------- */
function initSuccessBanner() {
  const params = new URLSearchParams(window.location.search);
  const successBanner = document.getElementById("formSuccess");

  if (params.get("success") === "true" && successBanner) {
    successBanner.classList.add("visible");
    successBanner.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

/* ---------- FAQ: um item aberto de cada vez ---------- */
function initFaq() {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      items.forEach((other) => {
        if (other !== item) other.open = false;
      });
      item.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
}

/* ---------- CTA sticky no telemóvel ---------- */
function initMobileCta() {
  if (document.querySelector(".mobile-cta")) return;

  const isContact = /contacto\.html/i.test(window.location.pathname);
  const usesRootPaths = Boolean(
    document.querySelector('link[rel="stylesheet"][href^="/"]')
  );
  const bookHref = isContact
    ? "#formulario"
    : usesRootPaths
      ? "/contacto.html"
      : "contacto.html";

  const bar = document.createElement("div");
  bar.className = "mobile-cta";
  bar.setAttribute("role", "navigation");
  bar.setAttribute("aria-label", "Contacto rápido");
  bar.innerHTML =
    '<a href="' + bookHref + '" class="btn btn-primary">Agendar Consulta</a>' +
    '<a href="https://wa.me/351000000000" target="_blank" rel="noopener" class="btn btn-whatsapp">WhatsApp</a>';

  document.body.appendChild(bar);
  document.body.classList.add("has-mobile-cta");
}
