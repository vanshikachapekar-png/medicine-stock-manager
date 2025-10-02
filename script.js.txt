let medicines = [
    { id: 1, name: "Paracetamol", quantity: 20, expiry: "2025-12-31" },
    { id: 2, name: "Ibuprofen", quantity: 8, expiry: "2025-10-15" },
    { id: 3, name: "Vitamin C", quantity: 3, expiry: "2025-09-30" },
    { id: 4, name: "Amoxicillin", quantity: 15, expiry: "2026-01-20" }
];

const form = document.getElementById('medicineForm');
const tableBody = document.getElementById('medicineTable').getElementsByTagName('tbody')[0];

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

function renderTable() {
    tableBody.innerHTML = '';
    const today = new Date().toISOString().split('T')[0];

    medicines.forEach(med => {
        const row = document.createElement('tr');

        if (med.quantity < 5) row.classList.add('low-stock');
        if (med.expiry <= today) row.classList.add('expired');

        row.innerHTML = `
            <td>${med.name}</td>
            <td>${med.quantity}</td>
            <td>${med.expiry}</td>
            <td>${med.quantity < 5 ? 'Low Stock' : (med.expiry <= today ? 'Expired' : 'OK')}</td>
            <td>
                <button class="edit-btn" onclick="editMedicine(${med.id})">Edit</button>
                <button class="delete-btn" onclick="deleteMedicine(${med.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function deleteMedicine(id) {
    medicines = medicines.filter(med => med.id !== id);
    renderTable();
}

function editMedicine(id) {
    const med = medicines.find(m => m.id === id);
    const newQuantity = prompt(`Update quantity for ${med.name}:`, med.quantity);
    if (newQuantity !== null) {
        med.quantity = parseInt(newQuantity);
        renderTable();
    }
}

renderTable();