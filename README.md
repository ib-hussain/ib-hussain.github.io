<h1 align="center">ib-hussain.github.io</h1>
<strong>This is my personal portfolio website, built from scratch and hosted on GitHub.</strong><br>
🔗 <a href="https://ib-hussain.github.io">ib-hussain.github.io</a>

---

## Development Process

The goal was to create a clean, responsive, and modular portfolio site using only **HTML**, **CSS**, and **Vanilla JavaScript**.

### Key Steps

1. **Component Separation**
   - Reusable layout components like `navbar.html` and `footer.html`.
   - Dynamically injected using `layout.js`.

2. **Responsive Design**
   - Flexbox and media queries for multi-device support.
   - Adjusted layout files:
     - `home-styles.css` – Profile and resume formatting.
     - `contact.css` – Two-column form on desktop, stacked on mobile.
     - `projects.css` – Interactive grid of project cards with popup overlays.
     - `layout.css` – Horizontal scrollable navbar on all screens.

3. **Interactive Elements**
   - Project previews using `projects.js` (popup with description and GitHub link).
   - Contact form with JavaScript feedback (thank-you message on submit).

---
## Additional Features Implemented

| Feature                      | Description                                                                 |
|-----------------------------|-----------------------------------------------------------------------------|
| Dynamic Navbar & Footer  | Loaded across all pages using `layout.js` and `fetch()` for consistency.    |
| Horizontal Scroll Navbar (Mobile) | Mobile-friendly layout with no stacking — uses scrollable flex display. |
| Popup Project Cards       | Popoup cards that open detailed views of projects with images and links. |
| Contact Form Feedback     | JavaScript-based submission with alert and reset functionality.        |
| Responsive Design         | Fully responsive layouts across laptops and mobiles.                |
| Modular Codebase          | Clean separation of HTML, CSS, and JavaScript components.                   |


## How to Run the Project Locally
### Steps

```bash
- Clone the repository
git clone https://github.com/ib-hussain/ib-hussain.github.io.git

- Navigate into the project directory
cd ib-hussain.github.io

- Open index.html in your browser
```

### File Structure
```plaintext
ib-hussain.github.io/
├── index.html
├── projects.html
├── contact.html
├── navbar.html
├── footer.html
├── css/
│   ├── layout.css
│   ├── home-styles.css
│   ├── contact.css
│   └── projects.css
├── js/
│   ├── layout.js
│   ├── projects.js
│   └── contact.js
├── pictures/
│   └── [images used on site]
└── README.md
```
