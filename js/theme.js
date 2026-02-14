// js/theme.js
// Standalone theme management (light/dark mode)

const THEME_KEY = "ih_theme";

function getSystemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);

    const icon = document.getElementById("themeIcon");
    if (icon) icon.textContent = theme === "dark" ? "🌙" : "☀️";
}

function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    setTheme(saved || getSystemTheme());

    // Optional: if user never set a theme, follow system changes
    if (!saved && window.matchMedia) {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
            setTheme(e.matches ? "dark" : "light");
        });
    }
}

function setupThemeToggle() {
    const btn = document.getElementById("themeBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") || "light";
        setTheme(current === "dark" ? "light" : "dark");
    });
}

// Auto-initialize on load
initTheme();

// Setup toggle when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupThemeToggle);
} else {
    setupThemeToggle();
}
