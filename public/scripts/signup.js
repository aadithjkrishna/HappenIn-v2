document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.querySelector("form");

    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const fullname = document.getElementById("fullname").value.trim();
        const email = document.getElementById("email").value.trim();
        const address = document.getElementById("address").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullname, email, address, phone, username, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Signup successful!");
                localStorage.setItem("token", data.token);
                if (data.user) {
                    localStorage.setItem("username", data.user.username);
                    localStorage.setItem("role", data.user.role);
                }
                window.location.href = "/";
            } else {
                alert(data.message || "Signup failed!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to register. Please try again.");
        }
    });
});
