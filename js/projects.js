// js/projects.js

// Use static project data from projects-data.js
const projects = window.PROJECTS || [];
const filters = window.PROJECT_DOMAINS || [
  { key: "all", label: "All Projects" },
  { key: "health", label: "Healthcare AI" },
  { key: "finance", label: "Quantitative Finance" },
  { key: "risk", label: "Marketing & Risk Prediction" },
  { key: "tech", label: "Technology & Data Science" }
];


const grid = document.getElementById("projectsGrid");
const filterRow = document.getElementById("filterRow");
const searchInput = document.getElementById("searchInput");

let activeFilter = "all";
let query = "";

const modal = document.getElementById("projectModal");

function renderFilters() {
  filterRow.innerHTML = "";
  filters.forEach(f => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "filter-pill" + (f.key === activeFilter ? " active" : "");
    b.textContent = f.label;
    b.addEventListener("click", () => {
      activeFilter = f.key;
      renderFilters();
      renderProjects();
    });
    filterRow.appendChild(b);
  });
}

function matches(p) {
  const hay = (p.title + " " + p.subtitle + " " + p.description + " " + p.tags.join(" ")).toLowerCase();
  const qok = !query || hay.includes(query);

  const fok = activeFilter === "all" || p.domain === activeFilter || p.tags.includes(activeFilter);
  return qok && fok;
}

function renderProjects() {
  grid.innerHTML = "";

  const list = projects.filter(matches);

  if (list.length === 0) {
    const empty = document.createElement("div");
    empty.className = "card";
    empty.style.padding = "16px";
    empty.innerHTML = `<b>No projects found.</b><p class="muted">Try a different filter or search term.</p>`;
    grid.appendChild(empty);
    return;
  }

  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "project-card card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View details for ${p.title}`);
    card.innerHTML = `
      <img class="thumb" src="${p.image}" alt="${p.title}" loading="lazy" />
      <div class="pname">${p.title}</div>
      <p class="pmeta">${p.subtitle}</p>
      <div class="card-tags">${p.tags.slice(0, 4).map(t => `<span>${t}</span>`).join("")}</div>
    `;
    card.addEventListener("click", () => openModal(p));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(p);
      }
    });
    grid.appendChild(card);
  });
}

function openModal(p) {
  document.getElementById("modalImg").src = p.image;
  document.getElementById("modalImg").alt = p.title;
  document.getElementById("modalTitle").textContent = p.title;
  document.getElementById("modalSubtitle").textContent = p.subtitle;
  document.getElementById("modalDesc").textContent = p.description;

  const tags = document.getElementById("modalTags");
  tags.innerHTML = p.tags.map(t => `<span>${t}</span>`).join("");

  const live = document.getElementById("modalLive");
  const repo = document.getElementById("modalRepo");

  if (p.live) {
    live.href = p.live;
    live.style.display = "inline-flex";
  } else {
    live.style.display = "none";
  }
  repo.href = p.repo;

  // Update URL hash
  window.location.hash = p.id;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // Focus management for accessibility
  setTimeout(() => {
    const closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  }, 100);
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  // Clear hash without scrolling
  history.replaceState(null, null, ' ');
}

modal.addEventListener("click", (e) => {
  if (e.target.dataset.close === "true") closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
});

searchInput.addEventListener("input", (e) => {
  query = e.target.value.trim().toLowerCase();
  renderProjects();
});

// Deep-link support for filters and modal
(function initFromURL() {
  // Support ?filter=health
  const params = new URLSearchParams(window.location.search);
  const f = params.get("filter");
  if (f && filters.some(x => x.key === f)) activeFilter = f;

  // Support #project-id for opening modal
  const hash = window.location.hash.slice(1); // Remove #
  if (hash) {
    const project = projects.find(p => p.id === hash);
    if (project) {
      // Wait for DOM to be fully ready
      setTimeout(() => openModal(project), 200);
    }
  }
})();

renderFilters();
renderProjects();
