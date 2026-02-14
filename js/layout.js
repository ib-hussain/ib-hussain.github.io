// js/layout.js
// Handles active navigation highlighting and mobile menu toggle
// Note: Navbar/footer are now embedded directly in HTML (no runtime fetch)
// Theme management moved to theme.js

function setActiveNav() {
  const page = document.body.getAttribute("data-page");
  if (!page) return;

  document.querySelectorAll("[data-page]").forEach((a) => {
    if (a.getAttribute("data-page") === page) a.classList.add("active");
  });
}

function setupMobileNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  links.addEventListener("click", (e) => {
    if (e.target && e.target.tagName === "A") {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setActiveNav();
    setupMobileNav();
  });
} else {
  setActiveNav();
  setupMobileNav();
}

