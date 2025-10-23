async function sendOTP() {
    const email = document.getElementById("email").value;
    const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });

    const data = await response.json();
    alert(data.message);

    if (response.ok) {
        document.getElementById("emailStep").style.display = "none";
        document.getElementById("otpStep").style.display = "block";
    }
}

async function verifyOTP() {
    const email = document.getElementById("email").value;
    const otp = document.getElementById("otp").value;
    const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
    });

    const data = await response.json();
    alert(data.message);

    if (response.ok) {
        document.getElementById("otpStep").style.display = "none";
        document.getElementById("passwordStep").style.display = "block";
    }
}

async function resetPassword() {
    const email = document.getElementById("email").value;
    const newPassword = document.getElementById("NewPassword").value;
    const confirmNewPassword = document.getElementById("ConfirmNewPassword").value;

    if (newPassword !== confirmNewPassword) {
        alert("Passwords do not match!");
        return;
    }

    const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword })
    });

    const data = await response.json();
    alert(data.message);

    if (response.ok) {
        window.location.href = "/login"; // Redirect to login page
    }
}