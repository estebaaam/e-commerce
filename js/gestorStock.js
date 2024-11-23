// Variables de configuración y datos de productos
let products = [];
let categories = [];

// Función para obtener categorías
async function fetchCategories() {
    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://127.0.0.1:8000/categories/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener las categorías');
        }
        categories = await response.json();
    } catch (error) {
        console.error('Error al obtener categorías:', error);
    }
}

// Función para obtener productos
async function fetchProducts() {
    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://127.0.0.1:8000/products/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los productos');
        }
        
        products = await response.json();
        renderProducts();  // Renderiza todos los productos sin paginación
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
}

function getCategoryNameById(id) {
    const category = categories.find(cat => cat.id === id);
    return category ? category.nombre : 'Sin categoría';
}

// Renderizar la lista de productos en la página
function renderProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';  // Limpiar la lista actual de productos

    // Mostrar todos los productos sin paginación
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
            <td>${product.estado}</td>
            <td>
                <button type="button" class="btn btn-link btn-rounded btn-sm fw-bold" data-mdb-ripple-color="dark" onclick="openEditProductModal(${product.id}, '${product.estado}')">Editar Estado</button>
            </td>
        `;
        productList.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchCategories();
    await fetchProducts();
});

// Función para abrir el modal y cargar el estado actual del producto
function openEditProductModal(productId, currentState) {
    document.querySelector('#editProductModal').style.display = 'block';
    document.querySelector('#productId').value = productId;  // Guardar el ID del producto en un campo oculto
    document.querySelector('#newProductStatus').value = currentState;  // Pre-seleccionar el estado actual
}

// Función para cerrar el modal
function closeEditProductModal() {
    document.querySelector('#editProductModal').style.display = 'none';
}

// Función para actualizar el estado del producto
async function updateProductStatus() {
    const productId = document.querySelector('#productId').value;
    const newStatus = document.querySelector('#newProductStatus').value;

    // Encuentra el producto actual en el array `products` para obtener los valores existentes
    const product = products.find(prod => prod.id === parseInt(productId));

    if (!product) {
        alert("Producto no encontrado.");
        return;
    }

    // Crea el objeto con todos los datos necesarios para la actualización
    const updatedProductData = {
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio,
        imagen: product.imagen,
        existencias: product.existencias,
        ultima_actualizacion: product.ultima_actualizacion,
        id_categoria: product.id_categoria,
        estado: newStatus  // Incluye el nuevo estado
    };

    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`http://127.0.0.1:8000/products/${productId}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProductData)  // Enviar todos los campos
        });

        if (response.ok) {
            closeEditProductModal();
            fetchProducts(); // Recargar los productos
            alert('Estado del producto actualizado correctamente');
        } else {
            const errorData = await response.json();
            console.error("Error al actualizar el estado del producto:", errorData);
            alert(`Hubo un error al actualizar el estado: ${errorData.detail}`);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert('Error de conexión');
    }
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

    doc.text("Gestor de Stock", 10, 10); // Título en el PDF
    doc.autoTable({
        head: [["Id de Producto", "Nombre de Producto", "Categoría", "Descripción", "Precio", "Existencia", "Estado"]],
        body: data
    });

    doc.save("stock.pdf");
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
    link.download = "stock.json";
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
    XLSX.writeFile(workbook, "stock.xlsx");
}

document.addEventListener("DOMContentLoaded", async () => {
    await fetchCategories();
    await fetchProducts();
});
