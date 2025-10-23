document.addEventListener("DOMContentLoaded", async () => {
  const authButtons = document.querySelector(".auth-buttons");
  const usernameDisplay = document.getElementById("usernameDisplay");
  usernameDisplay.style.display = "none";

  const token = localStorage.getItem("token");

  if (token) {
    try {
      const response = await fetch("/api/auth/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        // Show username
        usernameDisplay.textContent = data.user.username;
        usernameDisplay.style.display = "block";

        // Hide login/signup buttons
        if (authButtons) authButtons.style.display = "none";

        // Add logout link
        const navLinks = document.querySelector(".links");
        const logoutLink = document.createElement("a");
        logoutLink.href = "/logout";
        logoutLink.textContent = "Logout";
        logoutLink.style.marginLeft = "15px";
        logoutLink.style.cursor = "pointer";

        navLinks.appendChild(logoutLink);

        // Logout handler
        logoutLink.addEventListener("click", (e) => {
          e.preventDefault();
          if (confirm("Are you sure you want to logout?")) {
            localStorage.clear();
            location.reload();
          }
        });
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      localStorage.removeItem("token");
    }
  }
});
