document.addEventListener("DOMContentLoaded", function () {
  
  fetch("/navbar.html")//naigation bar
    .then(response => response.text())
    .then(data => {
      const navContainer = document.createElement("div");
      navContainer.innerHTML = data;
      document.body.insertBefore(navContainer, document.body.firstChild);
//   active link
      const path = window.location.pathname.split("/").pop().split(".")[0];
      document.querySelectorAll("[data-page]").forEach(el => {
        if (el.getAttribute("data-page").toLowerCase() === path.toLowerCase()) {
          el.classList.add("active");
        }
      });
    });
// footer
  fetch("/footer.html")
    .then(response => response.text())
    .then(data => {
      const footerContainer = document.createElement("div");
      footerContainer.innerHTML = data;
      document.body.appendChild(footerContainer);
    });
});
