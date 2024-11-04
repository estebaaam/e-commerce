const logout = () => {
  localStorage.removeItem('userName');
  localStorage.removeItem('user');
  localStorage.removeItem('productos');
  localStorage.removeItem('contadorProductos');
  localStorage.removeItem('cartCounter');
  localStorage.removeItem('userId');
  localStorage.removeItem('listaIdProductos');
  localStorage.removeItem('idProducto');
  localStorage.removeItem('cart_order');
  localStorage.removeItem('orders');
  window.location.href = "../index.html";
}

async function editarPerfil(){
  user = JSON.parse(localStorage.getItem('user'))
  document.querySelector('.container-information').innerHTML = `
  <div class="col-lg-6 mb-5 mb-lg-0">
              <div class="card-body py-5 px-md-5">
                <h2 class="mb-5">
                    Actualizar Informacion<br/>
                </h2>
                <form>
                  <div data-mdb-input-init class="form-outline mb-4">
                    <input type="text" value="${user.nombre}" id="nombre" class="form-control" />
                    <label class="form-label" for="nombre">Nombre</label>
                  </div>
  
                  <div data-mdb-input-init class="form-outline mb-4">
                    <input type="text" value="${user.telefono}" id="telefono" class="form-control" />
                    <label class="form-label" for="telefono">Número de teléfono</label>
                  </div>
  
                  <div data-mdb-input-init class="form-outline mb-4">
                    <input type="text" value="${user.correo}" id="correo" class="form-control" />
                    <label class="form-label" for="correo">Correo electrónico</label>
                  </div>

                  <div data-mdb-input-init class="form-outline mb-4">
                    <input type="text" value="${user.direccion}" id="direccion" class="form-control" />
                    <label class="form-label" for="direccion">Dirección</label>
                  </div>

                  <div data-mdb-input-init class="form-outline mb-4">
                    <input type="text" value="${user.contraseña}" id="contraseña" class="form-control" />
                    <label class="form-label" for="contraseña">Contraseña</label>
                  </div>
  
                  <button type="button" onclick="updateUser()" data-mdb-button-init data-mdb-ripple-init class="btn btn-primary me-3">
                    Actualizar
                  </button>
                  <button type="submit" data-mdb-button-init data-mdb-ripple-init class="btn btn-danger">
                    Cancelar
                  </button>
                </form>
              </div>
          </div>
  `
}

async function updateUser() {
  let nombre = document.getElementById('nombre').value;
  let correo = document.getElementById('correo').value;
  let telefono = document.getElementById('telefono').value;
  let direccion = document.getElementById('direccion').value;
  let contraseña = document.getElementById('contraseña').value;
  let rol = 'cliente';

  let usuarioActualizado = {
    nombre: nombre,
    correo: correo,
    telefono: telefono,
    direccion: direccion,
    contraseña: contraseña,
    rol: rol
  }

  let userId = parseInt(localStorage.getItem('userId'));
  try {
    const updateResponse = await fetch(`http://127.0.0.1:8000/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioActualizado)
    });

    if (!updateResponse.ok) {
      throw new Error('Error al al actualizar el usuario');
    }else{
      localStorage.setItem('user', JSON.stringify(usuarioActualizado));
      localStorage.setItem('userName', usuarioActualizado.nombre);
      window.location.href = "../html/informacion-personal.html";
    }

}catch (error) {
    console.error('Hubo un problema al actualizar el usuario:', error);
    alert('Hubo un problema al actualizar el usuario. Por favor, intenta de nuevo.');
}
}

let cart_orders = JSON.parse(localStorage.getItem('cart_order'));
if(!cart_orders){
  document.querySelector('.cart-wrapper').innerHTML = `
  <div class="empty-cart-message-container">
  <h2 class="my-5">no tienes pedidos</h2>
  <button class="btn btn-primary">Explorar la tienda</button>
  </div>
  `
}else{
  const productos = JSON.parse(localStorage.getItem('productos'));
  let orders = JSON.parse(localStorage.getItem('orders'));
  
  let productosHTML = '';

  productosHTML += '<h2 class="mb-5">tus pedidos</h2>'

  cart_orders.forEach(cart_order => {
    const producto = productos.find(producto => producto.id === cart_order.id_producto);
    const order = orders.find(order => order.id === cart_order.id_pedido);
    productosHTML += `
  <div class="product-section">
    <div class="product-image-container">
      <img class="product-img" src="${producto.imagen}">
      </div>
      <div class="info-section">
        <h3 class="product-title">${producto.nombre}</h3>
        <p class="price">$${producto.precio}</p>
        <p class="product-description">${producto.descripcion}</p>
        <p class="product-description">estado: ${order.estado}</p>
        <p class="product-description">fecha del pedido: ${order.fecha_pedido}</p>
        <p class="product-description">id: ${order.id}</p>
        <p class="product-description">cantidad de productos: ${cart_order.cantidad}</p>
        </div>
  </div>
  `
  });
  
  document.querySelector('.cart-wrapper').innerHTML = productosHTML;
}