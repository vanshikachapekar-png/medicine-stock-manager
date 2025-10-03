let medicines = [
    { id: 1, name: "Paracetamol", quantity: 20, expiry: "2025-12-31" },
    { id: 2, name: "Ibuprofen", quantity: 8, expiry: "2025-10-15" },
    { id: 3, name: "Vitamin C", quantity: 3, expiry: "2025-09-30" },
    { id: 4, name: "Amoxicillin", quantity: 15, expiry: "2026-01-20" }
];

const form = document.getElementById('medicineForm');
const tableBody = document.getElementById('medicineTable').getElementsByTagName('tbody')[0];
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const totalCount = document.getElementById('totalCount');
const lowStockCount = document.getElementById('lowStockCount');
const expiredCount = document.getElementById('expiredCount');

// Add medicine
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const expiry = document.getElementById('expiry').value;

    const medicine = {
        id: Date.now(),
        name,
        quantity,
        expiry
    };

    medicines.push(medicine);
    form.reset();
    renderTable();
});

// Search
searchInput.addEventListener('input', renderTable);

// Sort
sortSelect.addEventListener('change', renderTable);

// Render Table
function renderTable() {
    tableBody.innerHTML = '';
    const today = new Date();
    const searchTerm = searchInput.value.toLowerCase();
    const sortValue = sortSelect.value;

    let filteredMeds = medicines.filter(med =>
        med.name.toLowerCase().includes(searchTerm)
    );

    // Sorting
    if(sortValue) {
        const [key, order] = sortValue.split('-');
        filteredMeds.sort((a, b) => {
            if(key === 'name') return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            if(key === 'quantity') return order === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity;
            if(key === 'expiry') return order === 'asc' ? new Date(a.expiry) - new Date(b.expiry) : new Date(b.expiry) - new Date(a.expiry);
        });
    }

    // Dashboard counters
    totalCount.textContent = filteredMeds.length;
    lowStockCount.textContent = filteredMeds.filter(m => m.quantity < 5).length;
    expiredCount.textContent = filteredMeds.filter(m => new Date(m.expiry) < today).length;

    filteredMeds.forEach(med => {
        const row = document.createElement('tr');
        const expiryDate = new Date(med.expiry);
        const timeDiff = expiryDate - today;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        // Highlight classes
        if(med.quantity < 5) row.classList.add('low-stock');
        if(expiryDate < today) row.classList.add('expired');
        else if(daysDiff <= 30) row.classList.add('expiry-soon');

        row.innerHTML = `
            <td>${med.name}</td>
            <td>${med.quantity}</td>
            <td>${med.expiry}</td>
            <td>${med.quantity < 5 ? 'Low Stock' : (expiryDate < today ? 'Expired' : (daysDiff <= 30 ? 'Expiring Soon' : 'OK'))}</td>
            <td>
                <button class="edit-btn" onclick="editMedicine(${med.id})">Edit</button>
                <button class="delete-btn" onclick="deleteMedicine(${med.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Edit Medicine
function editMedicine(id) {
    const med = medicines.find(m => m.id === id);
    const newQuantity = prompt(`Update quantity for ${med.name}:`, med.quantity);
    if(newQuantity !== null && !isNaN(newQuantity)) {
        med.quantity = parseInt(newQuantity);
        renderTable();
    }
}

// Delete Medicine
function deleteMedicine(id) {
    if(confirm("Are you sure you want to delete this medicine?")) {
        medicines = medicines.filter(med => med.id !== id);
        renderTable();
    }
}

// Initial render
renderTable();

