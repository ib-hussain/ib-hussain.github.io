document.querySelector(".form-fill")?.addEventListener("submit", function(e) {
  e.preventDefault(); // Prevent default form submission
  
  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  
  // Show loading state
  submitButton.textContent = "Sending...";
  submitButton.disabled = true;

  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      alert("Thank you! Your response has been recorded.");
      form.reset();
      // The redirect will be handled by Formspree's _next parameter
    } else {
      throw new Error('Network response was not ok');
    }
  })
  .catch(error => {
    alert("Oops! Something went wrong. Please try again later.");
    console.error('Error:', error);
  })
  .finally(() => {
    // Reset button state
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
  });
});