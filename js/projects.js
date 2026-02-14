// js/projects.js - Enhanced Project Display System (Horizontal Cards)

// Use static project data from projects-data.js
const projects = window.PROJECTS || [];
const filters = window.PROJECT_DOMAINS || [
  { key: 'all', label: 'All Projects' },
  { key: 'health', label: 'Healthcare AI' },
  { key: 'finance', label: 'Quantitative Finance' },
  { key: 'risk', label: 'Marketing & Risk Prediction' },
  { key: 'tech', label: 'Technology & Data Science' }
];

// DOM Elements
const grid = document.getElementById('projectsGrid');
const filterRow = document.getElementById('filterRow');
const modal = document.getElementById('projectModal');

// State
let activeFilter = 'all';

/**
 * Render filter pills
 */
function renderFilters() {
  filterRow.innerHTML = '';
  
  filters.forEach(f => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-pill' + (f.key === activeFilter ? ' active' : '');
    button.textContent = f.label;
    button.setAttribute('aria-pressed', f.key === activeFilter);
    
    button.addEventListener('click', () => {
      activeFilter = f.key;
      renderFilters();
      renderProjects();
      
      // Update URL without page reload
      const url = new URL(window.location);
      if (f.key === 'all') {
        url.searchParams.delete('filter');
      } else {
        url.searchParams.set('filter', f.key);
      }
      window.history.replaceState({}, '', url);
    });
    
    filterRow.appendChild(button);
  });
}

/**
 * Check if project matches current filter
 */
function matches(project) {
  const matchesFilter = activeFilter === 'all' || 
                       project.domain === activeFilter || 
                       project.tags.includes(activeFilter);
  
  return matchesFilter;
}

/**
 * Render project cards - Horizontal Layout
 */
function renderProjects() {
  grid.innerHTML = '';
  
  const filteredProjects = projects.filter(matches);
  
  // Empty state
  if (filteredProjects.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'card no-hover';
    empty.style.padding = 'var(--space-3xl)';
    empty.style.textAlign = 'center';
    empty.innerHTML = `
      <b>No projects found</b>
      <p class="muted">Try selecting a different filter category.</p>
    `;
    grid.appendChild(empty);
    return;
  }
  
  // Render project cards - HORIZONTAL LAYOUT like watchlist reference
  filteredProjects.forEach((project, index) => {
    const card = document.createElement('article');
    card.className = 'project-card card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View details for ${project.title}`);
    card.style.animationDelay = `${index * 50}ms`;
    
    // Create the horizontal card structure - SIMPLIFIED
    card.innerHTML = `
      <img class="thumb" src="${project.image}" alt="${project.title}" loading="lazy" 
           onerror="this.src='pictures/favicon.png'" />
      <div>
        <div class="pname">${project.title}</div>
        <p class="pmeta">${project.subtitle}</p>
        <div class="card-tags">
          ${project.tags.slice(0, 3).map(tag => `<span>${tag}</span>`).join('')}
          ${project.tags.length > 3 ? `<span>+${project.tags.length - 3}</span>` : ''}
        </div>
      </div>
    `;
    
    // Click handler
    card.addEventListener('click', () => openModal(project));
    
    // Keyboard handler
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(project);
      }
    });
    
    grid.appendChild(card);
  });
  
  // Announce count to screen readers
  const announcement = `Showing ${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''}`;
  grid.setAttribute('aria-label', announcement);
}

/**
 * Open project detail modal
 */
function openModal(project) {
  // Update modal content
  document.getElementById('modalImg').src = project.image;
  document.getElementById('modalImg').alt = project.title;
  document.getElementById('modalTitle').textContent = project.title;
  document.getElementById('modalSubtitle').textContent = project.subtitle;
  document.getElementById('modalDesc').textContent = project.description;
  
  // Render tags
  const tagsContainer = document.getElementById('modalTags');
  tagsContainer.innerHTML = project.tags.map(tag => `<span>${tag}</span>`).join('');
  
  // Update links
  const liveBtn = document.getElementById('modalLive');
  const repoBtn = document.getElementById('modalRepo');
  
  if (project.live && project.live.trim() !== '') {
    liveBtn.href = project.live;
    liveBtn.style.display = 'inline-flex';
  } else {
    liveBtn.style.display = 'none';
  }
  
  repoBtn.href = project.repo;
  
  // Update URL hash
  window.location.hash = project.id;
  
  // Show modal
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  // Focus management
  setTimeout(() => {
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }, 100);
}

/**
 * Close modal
 */
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  
  // Clear hash without scrolling
  history.replaceState(null, null, ' ');
  
  // Return focus to trigger element
  const activeCard = document.activeElement;
  if (activeCard && activeCard.classList.contains('project-card')) {
    activeCard.focus();
  }
}

/**
 * Setup modal close handlers
 */
function setupModalHandlers() {
  // Click on backdrop or close button
  modal.addEventListener('click', (e) => {
    if (e.target.dataset.close === 'true') {
      closeModal();
    }
  });
  
  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/**
 * Initialize from URL parameters
 */
function initFromURL() {
  const params = new URLSearchParams(window.location.search);
  
  // Set filter from URL
  const filterParam = params.get('filter');
  if (filterParam && filters.some(f => f.key === filterParam)) {
    activeFilter = filterParam;
  }
  
  // Open modal from hash
  const hash = window.location.hash.slice(1);
  if (hash) {
    const project = projects.find(p => p.id === hash);
    if (project) {
      setTimeout(() => openModal(project), 200);
    }
  }
}

/**
 * Initialize projects page
 */
function init() {
  initFromURL();
  renderFilters();
  renderProjects();
  setupModalHandlers();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}