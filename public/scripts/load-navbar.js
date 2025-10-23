fetch('/components/navbar.html')
  .then(res => res.text())
  .then(async html => {
    document.getElementById('navbar-placeholder').innerHTML = html;
    const token = localStorage.getItem("token");
    const usernameDisplay = document.getElementById("usernameDisplay");
    const authButtons = document.querySelector(".auth-buttons");

    if (token) {
      try {
        const verifyRes = await fetch("/api/auth/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await verifyRes.json();

        if (verifyRes.ok) {
          authButtons.style.display = "none";
          usernameDisplay.innerHTML = `Welcome, ${data.user.username} <button id="logoutBtn">Logout</button>`;
          usernameDisplay.style.display = "block";
          document.getElementById("logoutBtn").addEventListener("click", () => {
            localStorage.removeItem("token");
            location.reload();
          });
        } else {
          localStorage.removeItem("token");
          authButtons.style.display = "flex";
          usernameDisplay.style.display = "none";
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        localStorage.removeItem("token");
        authButtons.style.display = "flex";
        usernameDisplay.style.display = "none";
      }
    } else {
      authButtons.style.display = "flex";
      usernameDisplay.style.display = "none";
    }
  })
  .catch(err => console.error('Failed to load navbar:', err));
