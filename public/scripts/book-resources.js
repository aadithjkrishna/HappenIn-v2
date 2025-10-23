const grid = document.getElementById("resourceGrid");
const popup = document.getElementById("popupForm");
const bookingForm = document.getElementById("bookingForm");
const availableInfo = document.getElementById("availableInfo");

let Resources = [];
let selectedResource = null;

async function loadResources() {
    try {
        const res = await fetch("/api/resource/resources");
        if (!res.ok) throw new Error("Failed to fetch resources");
        Resources = await res.json();
        renderResources();
    } catch (err) {
        console.error("Error loading resources:", err);
    }
}

function renderResources() {
    grid.innerHTML = "";
    Resources.forEach((res, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        const title = document.createElement("h3");
        title.textContent = res.resourceName;
        const quantity = document.createElement("div");
        quantity.classList.add("quantity");
        quantity.textContent = `Available: ${res.quantity}`;
        const button = document.createElement("button");
        button.classList.add("book-btn");
        button.textContent = res.quantity > 0 ? "Book Now" : "Out of Stock";
        button.disabled = res.quantity === 0;
        button.addEventListener("click", () => openPopup(index));

        card.append(title, quantity, button);
        grid.appendChild(card);
    });
}

function openPopup(index) {
    selectedResource = Resources[index];
    popup.style.display = "flex";
    availableInfo.textContent = `Available: ${selectedResource.quantity}`;
    const quantityInput = document.getElementById("quantity");
    quantityInput.value = 1;
    quantityInput.max = selectedResource.quantity;
}

function closePopup() {
    popup.style.display = "none";
    bookingForm.reset();
    selectedResource = null;
}

bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!selectedResource) return alert("No resource selected.");
    const name = document.getElementById("name").value.trim();
    const faculty = document.getElementById("faculty").value.trim();
    const event = document.getElementById("event").value.trim();
    const dateFrom = document.getElementById("dateFrom").value;
    const dateTo = document.getElementById("dateTo").value;
    const contact = document.getElementById("contact").value.trim();
    const remarks = document.getElementById("remarks").value.trim();
    const quantity = parseInt(document.getElementById("quantity").value);
    if (isNaN(quantity) || quantity <= 0) {
        return alert("Please enter a valid quantity.");
    }
    if (quantity > selectedResource.quantity) {
        return alert("Cannot book more than available quantity.");
    }
    try {
        const res = await fetch("/api/resource/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                resourceId: selectedResource._id,
                name,
                faculty,
                event,
                dateFrom,
                dateTo,
                contact,
                remarks,
                quantity
            })
        });
        if (!res.ok) throw new Error("Booking failed");
        const updatedRes = await fetch(`/api/resource/resources/${selectedResource._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: selectedResource.quantity - quantity })
        });
        if (!updatedRes.ok) throw new Error("Failed to update resource");
        alert("Resource booked successfully!");
        closePopup();
        await loadResources();
    } catch (err) {
        console.error(err);
        alert("Error booking resource.");
    }
});

loadResources();
