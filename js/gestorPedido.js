let currentPage = 1;
const ordersPerPage = 12; // Cambia este valor según el número de pedidos que deseas mostrar por página
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

        renderOrders(); // Renderizar pedidos en la tabla con la paginación inicial
        updatePaginationControls(); // Actualizar los controles de paginación

    } catch (error) {
        console.error('Hubo un problema al traer los pedidos:', error);
        alert('Hubo un error al traer los pedidos.');
    }
}

// Función para renderizar pedidos según la página actual
function renderOrders() {
    const start = (currentPage - 1) * ordersPerPage;
    const end = start + ordersPerPage;
    const paginatedOrders = orders.slice(start, end);

    let ordersHTML = '';
    paginatedOrders.forEach(order => {
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

// Función para actualizar los controles de paginación
function updatePaginationControls() {
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage * ordersPerPage >= orders.length;
    pageInfo.textContent = `Página ${currentPage}`;
}

// Event listeners para los botones de paginación
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderOrders();
        updatePaginationControls();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage * ordersPerPage < orders.length) {
        currentPage++;
        renderOrders();
        updatePaginationControls();
    }
});

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
