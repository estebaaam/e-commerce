// Función para traer pedidos y renderizar la tabla
async function traerPedidos() {
  try {
      const responseOrders = await fetch('http://127.0.0.1:8000/orders/');
      const orders = await responseOrders.json();

      if (!orders) {
          alert('No hay pedidos');
          return;
      }

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

  } catch (error) {
      console.error('Hubo un problema al traer los pedidos:', error);
      alert('Hubo un error al traer los pedidos.');
  }
}

// Llama a traerPedidos para cargar los pedidos en la página
traerPedidos();

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
          traerPedidos(); // Volver a cargar los pedidos
          alert('Estado actualizado correctamente');
      } else {
          const errorData = await response.json();
          console.error("Error al actualizar el pedido:", errorData.detail);
          alert('Hubo un error al actualizar el estado');
      }
  } catch (error) {
      console.error("Error en la solicitud:", error);
      alert('Error de conexión');
  }
}
