// On page load, check if user already exists
window.addEventListener("DOMContentLoaded", () => {
  const existingUser = localStorage.getItem("user");

  if (existingUser) {
    // Redirect to app.html if user already registered
    window.location.href = "app.html";
  }
});

const form = document.getElementById("userForm");
const nameInput = document.getElementById("name");
const dobInput = document.getElementById("dob");
const errorMsg = document.getElementById("error");

// Handle form submission
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Stop default form action

  const name = nameInput.value.trim();
  const dob = dobInput.value;

  // Reset error message
  errorMsg.textContent = "";

  // Basic validation
  if (!name || !dob) {
    errorMsg.textContent = "Please enter both name and date of birth.";
    return;
  }

  // Calculate age
  const age = calculateAge(new Date(dob));

  if (age <= 10) {
    errorMsg.textContent = "You must be over 10 years old to use TaskFlow.";
    return;
  }

  // Save user data to localStorage
  const user = {
    name: name,
    dob: dob,
    age: age,
  };

  localStorage.setItem("user", JSON.stringify(user));

  // Redirect to app.html
  window.location.href = "app.html";
});

// Age calculation helper function
function calculateAge(dob) {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();

  const hasBirthdayPassed =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

  if (!hasBirthdayPassed) {
    age--;
  }

  return age;
}
