let Users = [];
let Resources = [];

const usersContainer = document.getElementById("users-container");
const editUserContainer = document.getElementById("edit-user-container");
const resourcesContainer = document.getElementById("resources-container");
const dashboardContainer = document.getElementById("dashboard-container");

const viewDashboardBtn = document.getElementById("view-dashboard-btn");
const viewUsersBtn = document.getElementById("view-users-btn");
const viewResourcesBtn = document.getElementById("view-resources-btn");
const logoutBtn = document.getElementById("logout-btn");

(async function init() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in first!");
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
        if (!res.ok) throw new Error("Invalid token");
        const data = await res.json();
        if (!data.user || data.user.role !== "admin") {
            alert("Access denied: Admins only");
            window.location.href = "/";
            return;
        }
        localStorage.setItem("role", data.user.role);
        await loadUsers();
        await loadResources();
        renderDashboard();

    } catch (err) {
        console.error("Error verifying token:", err);
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
})();

async function adminFetch(url, options = {}) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in first!");
        window.location.href = "/login";
        return;
    }
    return fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...options.headers,
        },
    });
}

async function loadUsers() {
    try {
        const res = await adminFetch("/api/admin/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        Users = await res.json();
        renderTable();
    } catch (err) {
        console.error("Error loading users:", err);
    }
}

async function loadResources() {
    try {
        const res = await adminFetch("/api/admin/resources");
        if (!res.ok) throw new Error("Failed to fetch resources");
        Resources = await res.json();
        renderResourceTable();
    } catch (err) {
        console.error("Error loading resources:", err);
    }
}

function renderResourceTable() {
    resourcesContainer.innerHTML = "";
    usersContainer.style.display = 'none';
    resourcesContainer.style.display = "block";

    const table = document.createElement('table');
    const header = document.createElement('tr');
    ['Sl No.', 'Item', 'Count', 'Actions'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        header.appendChild(th);
    });
    table.appendChild(header);

    Resources.forEach((resource, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${idx + 1}</td>
            <td>${resource.resourceName}</td>
            <td>${resource.quantity}</td>
        `;

        const actionCell = document.createElement("td");
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", async () => {
            try {
                const res = await adminFetch(`/api/admin/resources/${resource._id}`, {
                    method: "DELETE",
                });
                if (!res.ok) throw new Error("Failed to delete resource");
                Resources.splice(idx, 1);
                renderResourceTable();
            } catch (err) {
                console.error(err);
            }
        });
        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);
        table.appendChild(row);
    });

    resourcesContainer.appendChild(table);

    // Add Resource Button
    const addResourceButton = document.createElement('button');
    addResourceButton.textContent = 'Add Resource';
    addResourceButton.style.marginTop = "10px";
    resourcesContainer.appendChild(addResourceButton);

    addResourceButton.addEventListener('click', () => {
        const existingForm = document.querySelector('.add-resource-form');
        if (existingForm) existingForm.remove();

        const addResourceDiv = document.createElement('div');
        addResourceDiv.classList.add("add-resource-form");
        addResourceDiv.style.marginTop = "10px";

        const resourceInput = document.createElement('input');
        resourceInput.placeholder = 'Item name';
        const countInput = document.createElement('input');
        countInput.type = 'number';
        countInput.placeholder = 'Count';

        const submitButton = document.createElement('button');
        submitButton.textContent = 'OK';

        submitButton.addEventListener('click', async () => {
            const resourceName = resourceInput.value.trim();
            const quantity = parseInt(countInput.value);
            if (!resourceName || isNaN(quantity)) return alert("Please enter valid item and count");

            try {
                const res = await adminFetch("/api/admin/resources", {
                    method: "POST",
                    body: JSON.stringify({ resourceName, quantity }),
                });
                if (!res.ok) throw new Error("Failed to add resource");
                const newResource = await res.json();
                Resources.push(newResource);
                renderResourceTable(); // re-render table
            } catch (err) {
                console.error(err);
            }
        });

        addResourceDiv.append(resourceInput, countInput, submitButton);
        resourcesContainer.appendChild(addResourceDiv);
    });
}



function createEditableField(labelText, value) {
    const container = document.createElement("p");
    const label = document.createElement("span");
    label.textContent = `${labelText}: `;
    const editable = document.createElement("span");
    editable.textContent = value;
    editable.contentEditable = true;
    editable.classList.add("editable-field");

    container.append(label, editable);
    return { container, editable };
}

function renderTable() {
    usersContainer.innerHTML = "";
    usersContainer.style.display = "block";
    if (Users.length === 0) {
        usersContainer.textContent = "No users found.";
        return;
    }

    const table = document.createElement("table");
    const header = document.createElement("tr");
    ["Sl No.", "Details", "Actions"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        header.appendChild(th);
    });
    table.appendChild(header);

    Users.forEach((user, idx) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${idx + 1}</td>
        `;

        const detailsCell = document.createElement("td");
        const nameField = createEditableField("Name", user.name);
        const emailField = createEditableField("E-Mail", user.email);
        detailsCell.append(nameField.container, emailField.container);

        const actionCell = document.createElement("td");
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => renderEditUser(user, idx));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", async () => {
            try {
                const res = await adminFetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
                if (!res.ok) throw new Error("Failed to delete user");
                Users.splice(idx, 1);
                renderTable();
            } catch (err) {
                console.error(err);
            }
        });

        actionCell.append(editBtn, deleteBtn);
        row.append(detailsCell, actionCell);
        table.appendChild(row);
    });

    usersContainer.appendChild(table);
}

function renderEditUser(user, index) {
    usersContainer.style.display = "none";
    editUserContainer.innerHTML = "";
    editUserContainer.classList.remove("hidden");

    const title = document.createElement("h2");
    title.textContent = `Edit User: ${user.username}`;

    const nameField = createEditableField("Name", user.name);
    const emailField = createEditableField("E-Mail", user.email);
    const addressField = createEditableField("Address", user.address);
    const phoneField = createEditableField("Phone", user.phone);
    const usernameField = createEditableField("Username", user.username);

    const applyBtn = document.createElement("button");
    applyBtn.textContent = "Apply";
    applyBtn.addEventListener("click", async () => {
        Users[index] = {
            ...Users[index],
            name: nameField.editable.textContent,
            email: emailField.editable.textContent,
            address: addressField.editable.textContent,
            phone: phoneField.editable.textContent,
            username: usernameField.editable.textContent
        };

        try {
            await adminFetch(`/api/admin/users/${user.id}`, {
                method: "PUT",
                body: JSON.stringify(Users[index]),
            });
            editUserContainer.classList.add("hidden");
            renderTable();
        } catch (err) {
            console.error(err);
        }
    });

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", () => {
        editUserContainer.classList.add("hidden");
        usersContainer.style.display = "block";
    });

    editUserContainer.append(title, nameField.container, usernameField.container, emailField.container, addressField.container, phoneField.container, applyBtn, cancelBtn);
}

function hideAll() {
    dashboardContainer.style.display = "none";
    usersContainer.style.display = "none";
    editUserContainer.classList.add("hidden");
    resourcesContainer.style.display = "none";
}

function renderDashboard() {
    hideAll();
    dashboardContainer.style.display = "block";
    dashboardContainer.innerHTML = `
        <h2>Dashboard Overview</h2>
        <p>Total Users: ${Users.length}</p>
        <p>Total Resources: ${Resources.length}</p>
    `;
}

viewDashboardBtn.addEventListener("click", renderDashboard);
viewUsersBtn.addEventListener("click", () => { hideAll(); renderTable(); });
viewResourcesBtn.addEventListener("click", () => { hideAll(); renderResourceTable(); });
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
});

(async function init() {
    await loadUsers();
    await loadResources();
    renderDashboard();
})();
