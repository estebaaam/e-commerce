let products = [];
let categories = [];

// Obtener todas las categorías
async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:8000/categories/');
        if (!response.ok) {
            throw new Error('Error al obtener las categorías');
        }
        categories = await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Obtener todos los productos sin paginación
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:8000/products/');
        if (!response.ok) {
            throw new Error('Error al obtener los productos');
        }
        
        products = await response.json();
        renderProducts();  // Renderiza todos los productos
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Obtener el nombre de la categoría por ID
function getCategoryNameById(id) {
    const category = categories.find(cat => cat.id === id);
    return category ? category.nombre : 'Sin categoría';
}

// Mostrar todos los productos en la tabla
function renderProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.imagen}" alt="${product.nombre}" style="width: 50px;"></td>
            <td>${product.nombre}</td>
            <td>${getCategoryNameById(product.id_categoria)}</td>
            <td>${product.descripcion}</td>
            <td>${product.precio}</td>
            <td>${product.existencias}</td>
            <td>
                <button type="button" class="btn btn-link btn-rounded btn-sm fw-bold" data-mdb-ripple-color="dark" onclick="openEditModal(${product.id})">Editar</button>
                <button type="button" class="btn btn-link btn-rounded btn-sm fw-bold" data-mdb-ripple-color="dark" onclick="deleteEditModal(${product.id})">Eliminar</button>
            </td>
        `;
        productList.appendChild(row);
    });
}

// Función de búsqueda
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("keyup", searchTable);
});

// Función para buscar en la tabla
function searchTable() {
    const searchInput = document.getElementById("searchInput");
    const filter = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll("#productList tr");
    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const match = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(filter));
        row.style.display = match ? "" : "none";
    });
}

// Funciones de exportación (PDF, Excel, JSON)
async function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let tableContent = document.getElementById("customers_table");
    let data = [];

    tableContent.querySelectorAll("tbody tr").forEach((row) => {
        let rowData = [];
        row.querySelectorAll("td").forEach((cell, index) => {
            // Omite la columna de imágenes (por ejemplo, si está en la segunda posición, índice 1)
            if (index !== 1) {
                rowData.push(cell.innerText);
            }
        });
        data.push(rowData);
    });

    doc.text("Gestor de Producto", 10, 10); // Título en el PDF
    doc.autoTable({
        head: [["Id de Producto", "Nombre de Producto", "Categoría", "Descripción", "Precio", "Existencia"]],
        body: data
    });

    doc.save("productos.pdf");
}

// Exportar a JSON
function exportToJSON() {
    const rows = Array.from(document.querySelectorAll("#productList tr"));
    const data = rows.map(row => {
        const cells = row.querySelectorAll("td");
        return {
            id: cells[0].textContent,
            nombre: cells[2].textContent,
            categoria: cells[3].textContent,
            descripcion: cells[4].textContent,
            precio: cells[5].textContent,
            existencia: cells[6].textContent
        };
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "productos.json";
    link.click();
}

// Exportar a Excel
function exportToExcel() {
    const table = document.getElementById("customers_table");
    const clonedTable = table.cloneNode(true);

    // Remueve la columna de "Acciones" (última columna) y "Imágenes" (segunda columna en este caso)
    clonedTable.querySelectorAll("tr").forEach(row => {
        if (row.children.length > 1) {
            row.removeChild(row.children[1]); // Elimina la columna de "Imágenes"
        }
        row.removeChild(row.lastElementChild); // Elimina la columna de "Acciones"
    });

    const workbook = XLSX.utils.table_to_book(clonedTable, { sheet: "Sheet1" });
    XLSX.writeFile(workbook, "productos.xlsx");
}

document.addEventListener("DOMContentLoaded", async () => {
    await fetchCategories();
    await fetchProducts();
});
