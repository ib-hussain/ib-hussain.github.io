// js/contact.js

const form = document.querySelector(".form-fill");
const btn = document.getElementById("sendBtn");
const toast = document.getElementById("toast");

function showToast(message, ok=true) {
  toast.textContent = message;
  toast.className = "toast show " + (ok ? "ok" : "bad");
  setTimeout(() => toast.className = "toast", 3200);
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const original = btn.textContent;
  btn.textContent = "Sending…";
  btn.disabled = true;

  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    });

    if (!res.ok) throw new Error("Formspree error");

    form.reset();
    showToast("Message sent. I’ll get back to you soon.", true);
  } catch (err) {
    showToast("Something went wrong. Please try again.", false);
    console.error(err);
  } finally {
    btn.textContent = original;
    btn.disabled = false;
  }
});
