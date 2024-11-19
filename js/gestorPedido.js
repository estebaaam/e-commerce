let orders = [];

// Función para traer pedidos y almacenarlos
async function fetchOrders() {
    try {
        const response = await fetch('http://127.0.0.1:8000/orders/');
        orders = await response.json();

        if (!orders.length) {
            alert('No hay pedidos');
            return;
        }

        renderOrders(); // Renderizar pedidos en la tabla sin paginación

    } catch (error) {
        console.error('Hubo un problema al traer los pedidos:', error);
        alert('Hubo un error al traer los pedidos.');
    }
}

// Función para renderizar pedidos (ya no se necesita paginación)
function renderOrders() {
    let ordersHTML = '';
    orders.forEach(order => {
        ordersHTML += `
            <tr>
                <td>${order.id}</td>
                <td>${order.id_usuario}</td>
                <td>${order.estado}</td>
                <td>${order.nombre_envio}</td>
                <td>${order.telefono_envio}</td>
                <td>${order.correo_envio}</td>
                <td>${order.direccion_envio}</td>
                <td>${order.cantidad_total}</td>
                <td>${order.precio_total}</td>
                <td>${order.fecha_pedido}</td>
                <td>
                    <button class="btn btn-link btn-rounded btn-sm fw-bold" data-mdb-ripple-color="dark" onclick="openEditModal(${order.id}, '${order.estado}')">Editar Estado</button>
                </td>
            </tr>
        `;
    });

    document.querySelector('.orders-container').innerHTML = ordersHTML;
}

// Llama a fetchOrders para cargar los pedidos en la página
document.addEventListener('DOMContentLoaded', fetchOrders);

// Función para abrir el modal y cargar el estado actual del pedido
function openEditModal(orderId, currentState) {
    document.querySelector('#editModal').style.display = 'block';
    document.querySelector('#orderId').value = orderId;  // Guardar el ID del pedido en un campo oculto
    document.querySelector('#newStatus').value = currentState;  // Pre-seleccionar el estado actual
}

// Función para cerrar el modal
function closeEditModal() {
    document.querySelector('#editModal').style.display = 'none';
}

// Función para actualizar el estado del pedido
async function updateOrderStatus() {
    const orderId = document.querySelector('#orderId').value;
    const newStatus = document.querySelector('#newStatus').value;

    try {
        const response = await fetch(`http://127.0.0.1:8000/orders/${orderId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                estado: newStatus
            })
        });

        if (response.ok) {
            closeEditModal();
            fetchOrders(); // Recargar los pedidos
            alert('Estado actualizado correctamente');
        } else {
            const errorData = await response.json();
            console.error("Error al actualizar el pedido:", errorData.detail);
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
    const rows = document.querySelectorAll(".orders-container tr");
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
            if (index !== 10) {
                rowData.push(cell.innerText);
            }
        });
        data.push(rowData);
    });

    doc.text("Gestor de Pedido", 10, 10); // Título en el PDF
    doc.autoTable({
        head: [["Id Pedido", "Id usuario", "Estado", "Nombre",	"Telefono",	"Correo", "Direccion", "Cantidad", "Total",	"Fecha Pedido"]],
        body: data
    });

    doc.save("pedido.pdf");
}

// Exportar a JSON
function exportToJSON() {
    const rows = Array.from(document.querySelectorAll("#customers_table tbody tr"));
    const data = rows.map(row => {
        const cells = row.querySelectorAll("td");
        // Asegurarse de que cada fila tiene el número correcto de celdas
        if (cells.length >= 9) {
            return {
                id_pedido: cells[0].textContent.trim(),
                id_usuario: cells[1].textContent.trim(),
                estado: cells[2].textContent.trim(),
                nombre: cells[3].textContent.trim(),
                telefono: cells[4].textContent.trim(),
                correo: cells[5].textContent.trim(),
                direccion: cells[6].textContent.trim(),
                cantidad: cells[7].textContent.trim(),
                total: cells[8].textContent.trim(),
                fecha_pedido: cells[9].textContent.trim()  // Asegurarse de que se mapea correctamente
            };
        } else {
            console.error("Fila incompleta encontrada, no se puede exportar.");
            return null;  // En caso de que falten celdas
        }
       }).filter(item => item !== null);  // Eliminar cualquier fila incompleta

    // Verificar que se haya obtenido datos
    if (data.length > 0) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "pedido.json";
        link.click();
    } else {
        alert("No hay datos disponibles para exportar.");
    }
}


// Exportar a Excel
function exportToExcel() {
    const table = document.getElementById("customers_table");
    const clonedTable = table.cloneNode(true);

    // Remueve la columna de "Acciones" (última columna) y "Imágenes" (segunda columna en este caso)
    clonedTable.querySelectorAll("tr").forEach(row => {
        row.removeChild(row.lastElementChild); // Elimina la columna de "Acciones"
    });

    const workbook = XLSX.utils.table_to_book(clonedTable, { sheet: "Sheet1" });
    XLSX.writeFile(workbook, "pedido.xlsx");
}

document.addEventListener("DOMContentLoaded", async () => {
    await fetchCategories();
    await fetchProducts();
});

