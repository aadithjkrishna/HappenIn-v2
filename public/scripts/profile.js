document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    // If user is not logged in, redirect to login page
    window.location.href = "/login";
    return;
  }

  try {
    const response = await fetch("/api/profile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Invalid or expired token — clear and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        alert("Session expired. Please log in again.");
        window.location.href = "/login";
      }
      throw new Error("Failed to fetch profile data");
    }

    const data = await response.json();
    document.getElementById("name").textContent = data.fullname || "N/A";
    document.getElementById("email").textContent = data.email || "N/A";
    document.getElementById("phone").textContent = data.phone || "N/A";

  } catch (error) {
    console.error("Error fetching profile:", error);
  }
});

function previewImage(event) {
  const reader = new FileReader();
  reader.onload = function () {
    const label = document.getElementById('uploadLabel');
    label.innerHTML = `<img src="${reader.result}" alt="Profile Picture" style="max-width: 150px; border-radius: 50%;">`;
  };
  reader.readAsDataURL(event.target.files[0]);
}
