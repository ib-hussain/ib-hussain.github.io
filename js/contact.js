document.querySelector(".form-fill").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Thank You!");
  // submittion.href = "index.html";
  this.reset();
});