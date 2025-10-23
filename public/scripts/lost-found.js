const lostBtn = document.getElementById("lostBtn");
const foundBtn = document.getElementById("foundBtn");
const lostForm = document.getElementById("lostForm");
const foundForm = document.getElementById("foundForm");

lostBtn.addEventListener("click", () => {
    lostForm.style.display = "flex";
    foundForm.style.display = "none";
    lostBtn.classList.add("active");
    foundBtn.classList.remove("active");
});

foundBtn.addEventListener("click", () => {
    lostForm.style.display = "none";
    foundForm.style.display = "flex";
    foundBtn.classList.add("active");
    lostBtn.classList.remove("active");
});

lostForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(lostForm);

    try {
        const res = await fetch("/api/lost-found/lost", {
            method: "POST",
            body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        alert("Lost item reported successfully!");
        lostForm.reset();
    } catch (err) {
        alert("Error: " + err.message);
    }
});

foundForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
        itemName: foundForm[0].value,
        eventName: foundForm[1].value,
        contactNumber: foundForm[2].value,
    };
    try {
        const res = await fetch("/api/lost-found/found", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        alert("Found item reported successfully!");
        foundForm.reset();
    } catch (err) {
        alert("Error: " + err.message);
    }
});