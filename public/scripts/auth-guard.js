document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login";
        return;
    }
    try {
        const res = await fetch("/api/auth/verify-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            localStorage.removeItem("token");
            window.location.href = "/login";
            return;
        }

        const data = await res.json();
        console.log("Authenticated as:", data.user.username);
        const usernameDisplay = document.getElementById("usernameDisplay");
        if (usernameDisplay) usernameDisplay.textContent = `Hi, ${data.user.username}`;
    } catch (error) {
        console.error("Error verifying token:", error);
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
});
