async function traerPedidos(){
    try {
        const responseOrders = await fetch('http://127.0.0.1:8000/orders/');
        const orders = await responseOrders.json();
  
        if (!orders) {
            alert('no hay pedidos')
        }
  
        let ordersHTML = ''
  
        orders.forEach(order => {
          ordersHTML += `
          <tr>
              <div class="d-flex align-items-center">
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
              </div>
            </tr>
          `
        });
  
        document.querySelector('.orders-container').innerHTML = ordersHTML;
   
    }catch (error) {
        console.error('Hubo un problema al traer los pedidos:', error);
        alert('Hubo un error al traer los pedidos.');
    }
  }
  


traerPedidos()