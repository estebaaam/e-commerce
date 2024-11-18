let cartCounter = parseInt(localStorage.getItem('cartCounter'));
if(!cartCounter){
  window.location.href = "../index.html";
}else{
  document.querySelector('.right-column').innerHTML = `
  <div class="card" style="width: 18rem;">
    <div class="card-body">
        <h5 class="card-title">Resumen de la compra</h5>
        <p class="card-text">Subtotal (${cartCounter} productos)</p>
        <p class="card-text text-danger">$${totalPrice}</p>
      </div>
    </div>
`
}

async function autoComplete() {
  let userId = localStorage.getItem('userId');
  let user = await getUser(userId)

  document.getElementById('nombre').value = user.nombre;
  document.getElementById('telefono').value = user.telefono;
  document.getElementById('correo').value = user.correo;
  document.getElementById('direccion').value = user.direccion; 
}
async function placeOrder(event) {

  event.preventDefault();

  let id_usuario = userId
  let estado = 'pendiente'
  let nombre_envio = document.getElementById('nombre').value;
  let telefono_envio = document.getElementById('telefono').value;
  let correo_envio = document.getElementById('correo').value;
  let direccion_envio = document.getElementById('direccion').value;
  let cantidad_total = cartCounter;
  let precio_total = totalPrice;

  let order = {
    id_usuario,
    estado,
    nombre_envio,
    telefono_envio,
    correo_envio,
    direccion_envio,
    cantidad_total,
    precio_total
  }

  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch('http://127.0.0.1:8000/orders/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
        body: JSON.stringify(order)
    });
    if (!response.ok) {
      throw new Error('Error al realizar el pedido');
    }

    const orderResponse = await response.json();

    let id_pedido = orderResponse.id;

    let contadorProductos = JSON.parse(localStorage.getItem('contadorProductos'));

    for (let idProducto in contadorProductos) {
      let producto = await getProduct(parseInt(idProducto));
    
      if (producto) {
        producto.existencias -= contadorProductos[idProducto];
        await updateProducts(producto, idProducto);
      }
    }

    for (const [id_producto, cantidad] of Object.entries(contadorProductos)) {
      let cart_order = {
        id_producto: parseInt(id_producto),
        id_usuario: parseInt(id_usuario),
        id_pedido: parseInt(id_pedido),
        cantidad: parseInt(cantidad)
      };

      await saveCartOrder(cart_order);
    }

    for (const [id_producto, cantidad] of Object.entries(contadorProductos)) {
      let carritoAeliminar = {
        id_producto: parseInt(id_producto),
        id_usuario: parseInt(id_usuario),
        cantidad: parseInt(cantidad)
      };

      await deleteCart(carritoAeliminar);
    }

    cartCounter = 0;
    contadorProductos = {}
    totalPrice = 0;
    localStorage.setItem('totalPrice', totalPrice);
    localStorage.setItem('cartCounter', cartCounter);
    localStorage.setItem('contadorProductos', JSON.stringify(contadorProductos));

    alert('su pedido se realizo con exito')
    window.location.href = "../html/informacion-personal.html";

}catch (error) {
    console.error('Hubo un problema al realizar el pedido:', error);
    alert('Hubo un problema al realizar el pedido. Por favor, intenta de nuevo.');
}

}

async function saveCartOrder(cart_order) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch('http://127.0.0.1:8000/cartOrder/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
      body: JSON.stringify(cart_order)
    });
    if (!response.ok) {
      throw new Error('Error al guardar el pedido del carrito');
    }
  } catch (error) {
    console.error('Hubo un problema al guardar el pedido del carrito:', error);
    alert('Hubo un problema al guardar el pedido del carrito. Por favor, intenta de nuevo.');
  }
}

async function deleteCart(carritoAeliminar) {
  try {
    const token = localStorage.getItem('access_token');
    const updateResponse = await fetch(`http://127.0.0.1:8000/cart/${carritoAeliminar.id_usuario}/${carritoAeliminar.id_producto}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
    });
    if (!updateResponse.ok) {
      throw new Error('Error al eliminar el registro');
    }

}catch (error) {
    console.error('Hubo un problema con el carrito:', error);
    alert('Hubo un problema con el carrito. Por favor, intenta de nuevo.');
}
}

async function updateProducts(Productoctualizado,id_producto) {
  try {
    const token = localStorage.getItem('access_token');
    const updateResponse = await fetch(`http://127.0.0.1:8000/products/${id_producto}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
        body: JSON.stringify(Productoctualizado)
    });
    if (!updateResponse.ok) {
      throw new Error('Error al guardar el producto actualizado');
    }

}catch (error) {
    console.error('Hubo un problema con el producto actualizado:', error);
    alert('Hubo un problema con el producto actualizado. Por favor, intenta de nuevo.');
}
}

async function getUser(id){
  try {
      const token = localStorage.getItem('access_token');
      const responseUser = await fetch(`http://127.0.0.1:8000/users/id/${id}`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });


      if (!responseUser) {
          throw new Error('Error al traer el usuario');
      }

      const user = await responseUser.json();
      return user;
 
  }catch (error) {
      console.error('Hubo un problema al traer el usuario:', error);
      alert('Hubo un error al traer el usuario.');
  }
}

async function getProduct(id_producto){
  try {
      const response = await fetch(`http://127.0.0.1:8000/products/${id_producto}`);
      const product = await response.json();

      if (!response.ok) {
        throw new Error('Error al cargar el producto');
      }

      return product;

  }catch (error) {
      console.error('Hubo un problema al cargar el producto:', error);
      alert('Hubo un error al cargar el producto.');
  }
}