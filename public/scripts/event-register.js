document.addEventListener("DOMContentLoaded", function () {
    const eventForm = document.getElementById("eventForm");
    const paymentField = document.getElementById("paymentField");
    const powerBackupRadios = document.getElementsByName("powerBackup");

    let isSubmitting = false;

    powerBackupRadios.forEach(radio => {
        radio.addEventListener("change", function () {
            paymentField.style.display = this.value === "yes" ? "block" : "none";
        });
    });

    eventForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (isSubmitting) return;
        isSubmitting = true;

        const submitButton = eventForm.querySelector("button[type='submit']");
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to register an event.");
            window.location.href = "/login";
            return;
        }

        const formData = {
            eventName: document.querySelector("input[placeholder=' ']").value,
            eventDate: document.querySelector("input[type='date']").value,
            startTime: document.querySelector("input[type='time']").value,
            endTime: document.querySelectorAll("input[type='time']")[1].value,
            venue: document.querySelector("select").value,
            organizerName: document.querySelectorAll("input[type='text']")[1].value,
            organizerEmail: document.querySelector("input[type='email']").value,
            participants: document.querySelector("input[type='number']").value,
            description: document.querySelectorAll("textarea")[0].value,
            eventType: document.querySelectorAll("select")[1].value,
            regLink: document.querySelector("input[type='url']").value,
            specialRequirements: document.querySelectorAll("textarea")[1].value,
            powerBackup: document.querySelector("input[name='powerBackup']:checked")?.value || "no",
            powerBackupFee: document.querySelector("#paymentField input")?.value || "0"
        };

        for (const key in formData) {
            if (!formData[key] && key !== "regLink" && key !== "specialRequirements") {
                alert(`Please fill in the ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`);
                isSubmitting = false;
                submitButton.disabled = false;
                submitButton.textContent = "Register";
                return;
            }
        }

        try {
            const response = await fetch("/api/events/register-event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || "Event registered successfully!");
                eventForm.reset();
                paymentField.style.display = "none";
            } else {
                alert(data.message || "Error registering event. Please try again.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("An error occurred. Please check your internet connection.");
        } finally {
            isSubmitting = false;
            submitButton.disabled = false;
            submitButton.textContent = "Register";
        }
    });
});
