async function editarPerfil(){
  userId = localStorage.getItem('userId');
  user = await getUser(userId);
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
  let rol = 'cliente';

  let userId = parseInt(localStorage.getItem('userId'));
  const token = localStorage.getItem('access_token');

  let usuarioActualizado = {
    id: userId,
    nombre: nombre,
    correo: correo,
    telefono: telefono,
    direccion: direccion,
    rol: rol
  }

  try {
    const updateResponse = await fetch(`http://127.0.0.1:8000/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(usuarioActualizado)
    });

    if (!updateResponse.ok) {
      if (updateResponse.status === 401) {
          alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          window.location.href = "../html/login.html";
          return;
      }
      throw new Error('Error al actualizar el usuario');
  } else {
      localStorage.setItem('userName', usuarioActualizado.nombre);
      window.location.href = "../html/informacion-personal.html";
  }

}catch (error) {
    console.error('Hubo un problema al actualizar el usuario:', error);
    alert('Hubo un problema al actualizar el usuario. Por favor, intenta de nuevo.');
}
}

async function loadOrders() {
  let userId = parseInt(localStorage.getItem('userId'));
  let cart_orders = await getCartOrder(userId);
if(!cart_orders.length){
  document.querySelector('.orders-wrapper').innerHTML = `
  <div class="empty-orders-message-container">
  <h2 class="my-5">no tienes pedidos</h2>
  <a href="../index.html">
  <button class="btn btn-primary">Explorar la tienda</button>
  </a>
  </div>
  `
}else{
  let userId = parseInt(localStorage.getItem('userId'));
  let orders = await getOrders(userId);
  let reseñasUsuario = await getReviews(userId);

  let productosHTML = '';
  const calificacionesPendientes = [];

  productosHTML += '<h2 class="my-5">tus pedidos</h2>'

  for(const cart_order of cart_orders) {
    const producto = await getProduct(cart_order.id_producto);
    const order = orders.find(order => order.id === cart_order.id_pedido);
    if(order.estado === 'entregado'){
      const comentarioExistente = reseñasUsuario.find(reseña => 
      reseña.id_producto === producto.id && reseña.id_pedido === order.id
    ); 
    if (comentarioExistente) {
      productosHTML += `
        <div class="order-section">
          <div class="product-image-container">
            <img class="product-img" src="${producto.imagen}">
          </div>
          <div class="info-section">
            <h3 class="product-title">${producto.nombre}</h3>
            <p class="price">$${producto.precio}</p>
            <p class="product-description">${producto.descripcion}</p>
            <p class="product-description">estado: ${order.estado}</p>
            <p class="product-description">fecha del pedido: ${order.fecha_pedido}</p>
            <p class="product-description">id del pedido: ${order.id}</p>
            <p class="product-description">cantidad de productos: ${cart_order.cantidad}</p>
            <div class="review-container">
              <p class="review-title">Tu comentario</p>
              <p class="product-description">${comentarioExistente.comentario}</p>
              <div class="container-rating">
              <p class="review-title">calificacion: </p>
              <span class="fa fa-star" id="1-${comentarioExistente.id}"></span>
              <span class="fa fa-star" id="2-${comentarioExistente.id}"></span>
              <span class="fa fa-star" id="3-${comentarioExistente.id}"></span>
              <span class="fa fa-star" id="4-${comentarioExistente.id}"></span>
              <span class="fa fa-star" id="5-${comentarioExistente.id}"></span>
            </div>
              <div class="float-end my-2 pt-1 mb-5">
              <button type="button" class="btn btn-primary btn-sm" onclick="updateReview(${comentarioExistente.id}, '${comentarioExistente.comentario}', ${comentarioExistente.id_usuario}, ${comentarioExistente.id_producto}, ${comentarioExistente.id_pedido}, ${comentarioExistente.calificacion})" data-bs-toggle="modal" data-bs-target="#exampleModalCenter">
              Actualizar comentario
              </button>
              <button type="button" class="btn btn-danger btn-sm" onclick="deleteReview(${comentarioExistente.id})" data-bs-toggle="modal" data-bs-target="#exampleModalCenterDelete">
              Eliminar Comentario
              </button>
              </div>
            </div>
          </div>
        </div>
      `;
      calificacionesPendientes.push({ calificacion: comentarioExistente.calificacion, id: comentarioExistente.id });
    }else {
      productosHTML += `
        <div class="order-section">
          <div class="product-image-container">
            <img class="product-img" src="${producto.imagen}">
          </div>
          <div class="info-section">
            <h3 class="product-title">${producto.nombre}</h3>
            <p class="price">$${producto.precio}</p>
            <p class="product-description">${producto.descripcion}</p>
            <p class="product-description">estado: ${order.estado}</p>
            <p class="product-description">fecha del pedido: ${order.fecha_pedido}</p>
            <p class="product-description">id del pedido: ${order.id}</p>
            <p class="product-description">cantidad de productos: ${cart_order.cantidad}</p>
            <div class="review-container">
              <p class="review-title">Parece que has recibido tu pedido ¡Deja tu comentario!</p>
              <div class="float-end my-2 pt-1 mb-5">
              <button type="button" class="btn btn-primary btn-sm" onclick="createReview(${userId},${producto.id},${order.id})" data-bs-toggle="modal" data-bs-target="#exampleModalCenterCreate">
              dejar comentario
              </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    }else{
      productosHTML += `
  <div class="order-section">
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
    }
  };
  
  document.querySelector('.orders-wrapper').innerHTML = productosHTML;

  calificacionesPendientes.forEach(({ calificacion, id }) => {
    cargarCalificacion(calificacion, id);
});

}  
}

document.addEventListener("DOMContentLoaded", function() {
  loadOrders();
});

async function createReview(id_usuario, id_producto, id_pedido) {
  window.currentCommentuserId = id_usuario;
  window.currentCommentProductId = id_producto;
  window.currentCommentOrderId = id_pedido;
}

async function submitCreateReview(){
  const comentario = document.getElementById('comment').value;
  const id_usuario = window.currentCommentuserId;
  const id_producto = window.currentCommentProductId;
  const id_pedido = window.currentCommentOrderId;
  const calificacion = window.currentRate;

  if (comentario.trim() === '') {
    alert('Por favor, ingresa un comentario.');
    return;
  }

  const review = {
    id_usuario,
    id_producto,
    id_pedido,
    comentario,
    calificacion
  };

  try {
    const token = localStorage.getItem('access_token');      
    const response = await fetch('http://127.0.0.1:8000/reviews/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(review)
    });
    
    if (response.ok) {
      window.location.href = "../html/informacion-personal.html";
    } else {
      alert('Hubo un error al enviar el comentario. Inténtalo de nuevo.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un error de conexión.');
  }

}

async function getReviews(id_usuario) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`http://127.0.0.1:8000/reviews/user/${id_usuario}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error con las reseñas');
    }

    const userReviews = await response.json();

    return userReviews;

  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un error con las reseñas.');
  }
}

async function updateReview(id, comentarioActual, id_usuario, id_producto, id_pedido, calificacion) {
  document.getElementById('updated-comment').value = comentarioActual;
  window.currentCommentId = id;
  window.currentCommentuserId = id_usuario;
  window.currentCommentProductId = id_producto;
  window.currentCommentOrderId = id_pedido;
  cartgarCalificacionActualizacion(calificacion);
}

async function submitUpdatedComment() {
  const updatedComment = document.getElementById('updated-comment').value;
  const id = window.currentCommentId;
  const id_usuario = window.currentCommentuserId;
  const id_producto = window.currentCommentProductId;
  const id_pedido = window.currentCommentOrderId;
  const calificacion =  window.currentUpdateRate;

  if (updatedComment.trim() === '') {
    alert('Por favor, ingresa un comentario.');
    return;
  }

  const reviewUpdate = {
    id_usuario: id_usuario,
    id_producto: id_producto,
    id_pedido: id_pedido,
    comentario: updatedComment,
    calificacion: calificacion
  };

  try {
    const token = localStorage.getItem('access_token');      
    const response = await fetch(`http://127.0.0.1:8000/reviews/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewUpdate)
    });
    
    if (response.ok) {
      window.location.href = "../html/informacion-personal.html";
    } else {
      alert('Hubo un error al actualizar el comentario. Inténtalo de nuevo.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un error de conexión.');
  }
}

async function deleteReview(id){
  window.currentCommentId = id;
}

async function submitDeleteComment() {
  const id = window.currentCommentId;
  try {
    const token = localStorage.getItem('access_token');
    const updateResponse = await fetch(`http://127.0.0.1:8000/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
    });
    if (!updateResponse.ok) {
      throw new Error('Error al eliminar el registro');
    }
    window.location.href = "../html/informacion-personal.html";

}catch (error) {
    console.error('Hubo un problema con el carrito:', error);
    alert('Hubo un problema con el carrito. Por favor, intenta de nuevo.');
}
}

function calificar(item){
  let calificacion = item.id[0];

  window.currentRate = calificacion;

  for (let index = 0; index < 5; index++) {
    if(index < calificacion){
      document.getElementById(`${index+1}-star`).style.color = "orange";
    }else{
      document.getElementById(`${index+1}-star`).style.color = "gray";
    }
  }
}

function cargarCalificacion(calificacion,id){
  for (let i = 0; i < 5; i++) {
    if(i < calificacion){
      document.getElementById(`${i+1}-${id}`).style.color = "orange";
    }
  }
}

function cartgarCalificacionActualizacion(calificacion){
  for (let index = 0; index < 5; index++) {
    if(index < calificacion){
      document.getElementById(`${index+1}-star-actualizar`).style.color = "orange";
    }else{
      document.getElementById(`${index+1}-star-actualizar`).style.color = "gray";
    }
  }
}

function calificarActualizacion(item){
  let calificacion = item.id[0];

  window.currentUpdateRate = calificacion;

  for (let index = 0; index < 5; index++) {
    if(index < calificacion){
      document.getElementById(`${index+1}-star-actualizar`).style.color = "orange";
    }else{
      document.getElementById(`${index+1}-star-actualizar`).style.color = "gray";
    }
  }
}

async function getUser(id) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/users/id/${id}`);
    const user = await response.json();

    if (!response.ok) {
      throw new Error('Error al traer el usuario');
    }

    return user;

  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un error al traer el usuario.');
  }
}

async function getCartOrder(id_usuario){
  try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/cartOrder/${id_usuario}`,{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const cart_orders = await response.json();

      return cart_orders;

  }catch (error) {
      console.error('Hubo un problema al traer los pedidos:', error);
      alert('Hubo un error al traer los pedidos.');
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

async function getOrders(id_usuario){
  try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/orders/${id_usuario}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const orders = await response.json();

      return orders;

  }catch (error) {
      console.error('Hubo un problema al traer los pedidos:', error);
      alert('Hubo un error al traer los pedidos.');
  }
}