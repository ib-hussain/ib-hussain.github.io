<h1 align="center">ib-hussain.github.io</h1>

**Personal portfolio website showcasing quantitative data science projects across finance, healthcare, marketing analytics, and technology.**

🔗 **Live Site**: [ib-hussain.github.io](https://ib-hussain.github.io)

---

## 👤 About

Ibrahim Hussain — BS Data Science student at FAST University, Pakistan

**Specializations**:
- Quantitative Finance (time-series forecasting, econometric modeling, risk prediction)
- Healthcare AI (multi-modal systems, predictive modeling, agentic AI)
- Marketing & Risk Analytics (segmentation, anomaly detection, decision systems)
- Production AI Systems (multi-agent orchestration, LLM engineering, full-stack deployment)

**Target Roles**: Quantitative Analyst, Data Scientist, ML Engineer, AI Systems Engineer

---

## 🚀 Projects

This portfolio features **11 projects** across **4 domains**:

### Featured Projects
1. **Multi-Agentic Health Assistant** — Healthcare AI with 3 specialized agents (diet, exercise, mental health), PostgreSQL + Pinecone vector DB, multi-modal vision capabilities
2. **Writer's Block** — Marketing & Risk: AI blog generator with 6-agent parallel architecture, cost-optimized multi-model orchestration (~$0.04/blog), PostgreSQL
3. **Inflation Dynamics in Pakistan** — Quantitative Finance: ARIMA time-series forecasting + regularized regression (Ridge/Lasso/Elastic Net) for macroeconomic prediction
4. **Cinemago** — Technology: Movie discovery platform with Flask, SQLite, weighted ratings, web scraping

### All Projects
View the complete portfolio at [ib-hussain.github.io/projects.html](https://ib-hussain.github.io/projects.html)

**Domains**: Healthcare AI • Quantitative Finance • Marketing & Risk Prediction • Technology & Data Science

---

## 🛠️ Technical Stack

**Frontend**:
- HTML5 (semantic markup)
- CSS3 (Grid, Flexbox, CSS Variables, animations)
- Vanilla JavaScript (ES6+, no frameworks)

**Design**:
- Fully responsive (mobile-first)
- Light/Dark theme with localStorage persistence
- Accessibility-first (ARIA labels, keyboard navigation, focus management)
- Production-grade animations and micro-interactions

**Architecture**:
- **Fully Static** — No runtime dependencies, no build step
- Embedded navbar/footer HTML (no `fetch()` calls)
- Manual project data curation with deep-linking support
- GitHub Pages hosting

---

## 📋 Managing Projects

### Adding a New Project

1. **Create project folder**:
   ```
   pictures/<ProjectName>/
   ```

2. **Add required files**:
   - `README.md` — Project description with title, details, GitHub URL, live deployment URL (if any)
   - At least one image (`.png`, `.jpg`, `.jpeg`, `.webp`, or `.gif`) for the thumbnail

3. **Edit `js/projects-data.js`**:
   - Add new project object to `window.PROJECTS` array
   - Required fields:
     ```javascript
     {
       id: "project-slug",              // lowercase with hyphens
       title: "Project Title",
       subtitle: "Domain Classification",
       description: "1-2 sentence description (max 250 chars)",
       tags: ["tag1", "tag2", "tag3"],  // 4-8 tags
       domain: "health|finance|risk|tech",
       image: "pictures/<ProjectName>/image.png",
       repo: "https://github.com/ib-hussain/repo",
       live: "https://deployment-url.com" // or "" if none
     }
     ```
   - Place alphabetically after featured projects

4. **Commit and push**:
   ```bash
   git add pictures/<ProjectName>/ js/projects-data.js
   git commit -m "Add <ProjectName> project"
   git push origin main
   ```

5. **GitHub Pages** will serve the updated site automatically

### Domain Classifications
- **`health`** → Healthcare AI
- **`finance`** → Quantitative Finance
- **`risk`** → Marketing & Risk Prediction
- **`tech`** → Technology & Data Science

---

## 📂 Repository Structure

```
ib-hussain.github.io/
├── index.html              # Landing page
├── projects.html           # Projects showcase (search, filters, modals)
├── resume.html             # Resume page
├── contact.html            # Contact information
├── navbar.html             # (reference only, embedded statically in pages)
├── footer.html             # (reference only, embedded statically in pages)
│
├── css/
│   ├── tokens.css          # Design tokens (colors, spacing, typography)
│   ├── layout.css          # Global layout styles
│   ├── projects.css        # Projects page styles
│   ├── home.css            # Homepage styles
│   └── contact.css         # Contact page styles
│
├── js/
│   ├── projects-data.js    # **MANUALLY CURATED** project metadata
│   ├── projects.js         # Projects page logic (search, filters, modal)
│   ├── theme.js            # Light/dark theme management
│   └── layout.js           # Active nav + mobile menu
│
├── pictures/
│   ├── 3movieCollectors/          # Project folder
│   │   ├── README.md
│   │   └── 3movCollectors.png
│   ├── Multi-Agentic_Health_Assistant/
│   │   ├── README.md
│   │   └── virtualhealth.png
│   ├── ...                        # (11 total projects)
│   ├── favicon.png
│   └── ib.jpg                     # Profile photo
│
└── assets/
    └── Ibrahim's Resume.pdf       # Resume PDF
```

---

## 🎨 Design Philosophy

- **Bold & Modern**: Vibrant colors, dark mode, glassmorphism effects
- **Accessible**: WCAG-compliant contrast, keyboard navigation, screen reader support
- **Fast**: No external dependencies, optimized assets, minimal HTTP requests
- **Maintainable**: No build step, pure vanilla JS, easy to update

---

## 🔗 Links

- **Portfolio**: [ib-hussain.github.io](https://ib-hussain.github.io)
- **GitHub**: [github.com/ib-hussain](https://github.com/ib-hussain)
- **LinkedIn**: [linkedin.com/in/ibrahim-hussain-1084ba255](https://linkedin.com/in/ibrahim-hussain-1084ba255)
- **Email**: [ibrahimbeaconarion@gmail.com](mailto:ibrahimbeaconarion@gmail.com)

---

**Built with ❤️ using HTML, CSS, and Vanilla JavaScript**

