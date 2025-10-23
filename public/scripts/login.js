document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.querySelector(".input-submit");

    loginButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const username = document.getElementById("user").value.trim();
        const password = document.getElementById("pass").value.trim();

        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login successful!");
                localStorage.setItem("token", data.token);
                if (data.user) {
                    localStorage.setItem("username", data.user.username);
                    localStorage.setItem("role", data.user.role);
                }

                // Redirect to home page
                window.location.href = "/";
            } else {
                alert(data.message || "Invalid username or password!");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Error logging in. Please try again.");
        }
    });
});
