let cartCounter = parseInt(localStorage.getItem('cartCounter'));
let totalPrice = parseFloat(localStorage.getItem('totalPrice'));
let userId = localStorage.getItem('userId');
if(!cartCounter || !totalPrice || !userId){
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

const autoComplete = () => {
  let user = JSON.parse(localStorage.getItem('user'));

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
    const response = await fetch('http://127.0.0.1:8000/orders/', {
        method: 'POST',
        headers: {
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

    await getCartOrder(id_usuario);

    alert('su pedido se realizo con exito')
    window.location.href = "../html/informacion-personal.html";

}catch (error) {
    console.error('Hubo un problema al realizar el pedido:', error);
    alert('Hubo un problema al realizar el pedido. Por favor, intenta de nuevo.');
}

}

async function saveCartOrder(cart_order) {
  try {
    const response = await fetch('http://127.0.0.1:8000/cartOrder/', {
      method: 'POST',
      headers: {
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
    const updateResponse = await fetch(`http://127.0.0.1:8000/cart/${carritoAeliminar.id_usuario}/${carritoAeliminar.id_producto}`, {
        method: 'DELETE',
        headers: {
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

async function getCartOrder(id_usuario){
  try {
      const response = await fetch(`http://127.0.0.1:8000/cartOrder/${id_usuario}`);
      const cart_order = await response.json();

      if (!cart_order) {
        throw new Error('Error al traer los pedidos');
      }

      localStorage.setItem('cart_order',JSON.stringify(cart_order));

  }catch (error) {
      console.error('Hubo un problema al traer los pedidos:', error);
      alert('Hubo un error al traer los pedidos.');
  }
}