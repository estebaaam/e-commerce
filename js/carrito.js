async function filtrarProductos() {
  let contadorProductos = JSON.parse(localStorage.getItem('contadorProductos'));
  const listaIdProductos = Object.keys(contadorProductos);
  let productosFiltrados = [];
  for (const id of listaIdProductos) {
    let producto = await getProduct(id);
    productosFiltrados.push(producto);
  }
  localStorage.setItem('listaIdProductos', JSON.stringify(listaIdProductos));
  return productosFiltrados;
}

async function mostrarCarrito() {
  let cartCounter = parseInt(localStorage.getItem('cartCounter'));
  let userId = parseInt(localStorage.getItem('userId'));
  if (!cartCounter) {
    document.querySelector('.cart-wrapper').innerHTML = `
  <div class="empty-cart-message-container">
  <h2 class="my-4">su carrito está vacío.</h2>
  <a href="../index.html">
  <button class="btn btn-primary">Explorar la tienda</button>
  </a>
  </div>
  `
  document.querySelector('.cart-summary-wrapper').innerHTML = '';
  } else {
    const productosFiltrados = await filtrarProductos();
    let contadorProductos = JSON.parse(localStorage.getItem('contadorProductos'));
    const listaIdProductos = JSON.parse(localStorage.getItem('listaIdProductos'));
    let productosHTML = '';
    let cartSumaryHTML = '';
    let stockText = '';
    let totalPrice = 0;
    productosFiltrados.forEach(producto => {
      stockText = producto.existencias ? "En stock" : "Agotado";
      totalPrice += producto.precio * contadorProductos[producto.id]
      productosHTML += `
    <div class="product-section">
            <div class="product-image-container">
              <img class="product-img" src="${producto.imagen}">
              </div>
              <div class="info-section">
                <h3 class="product-title">${producto.nombre}</h3>
                <p class="price">$${producto.precio}</p>
                <p class="stock">${stockText}</p>
                <p class="product-description">${producto.descripcion}</p>
                <div class="delete-from-cart-section">
                <div class="add-sustract-section">
                <p class="product-quantity-title">cantidad:</p>
                <p class="minus-sign">-</p>
                <p class="product-quantity">${contadorProductos[producto.id]}</p>
                <p class="plus-sign">+</p>
                </div>
                <button class="delete-from-cart-button btn btn-danger">Eliminar Del Carrito</button>
                </div>
                </div>
          </div>
    `
    })

    cartSumaryHTML = `
  <div class="cart-summary">
              <h2>Resumen del Carrito</h2>
              <p>Subtotal (${cartCounter} productos): <span>$${totalPrice}</span></p>
              <a href="../paypal/pago.html">
              <button class="btn btn-primary">Proceder con el Pago</button>
              </a>
          </div>
  `

    document.querySelector('.cart-wrapper').innerHTML = productosHTML;
    document.querySelector('.cart-summary-wrapper').innerHTML = cartSumaryHTML;
    localStorage.setItem('totalPrice', totalPrice);

    document.querySelectorAll('.minus-sign').forEach((minusSign, index) => {
      minusSign.addEventListener('click', async () => {
        if (contadorProductos[listaIdProductos[index]] > 1) {
          contadorProductos[listaIdProductos[index]]--;
          cartCounter = 0;
          for (let idProducto in contadorProductos) {
            cartCounter += contadorProductos[idProducto];
          }

          let carritoActualizado = {
            id_producto: listaIdProductos[index],
            id_usuario: userId,
            cantidad: contadorProductos[listaIdProductos[index]]
          }
          
          await updateCart(carritoActualizado);

          localStorage.setItem('cartCounter', cartCounter);
          localStorage.setItem('contadorProductos', JSON.stringify(contadorProductos));
          document.querySelector('.cart-counter').innerHTML = cartCounter;
          mostrarCarrito();
        } else {
          minusSign.style.opacity = 0.2;
        }
      })
    })


    document.querySelectorAll('.plus-sign').forEach((minusSign, index) => {
      minusSign.addEventListener('click', async () => {
        const producto = await getProduct(parseInt(listaIdProductos[index]));
        contadorProductos[listaIdProductos[index]]++;
        if(contadorProductos[listaIdProductos[index]] > producto.existencias){
          alert('Ups! Parece que nos quedamos sin este producto')
          contadorProductos[listaIdProductos[index]] -= cantidadSeleccionada;
          return
        }
        cartCounter = 0;
        for (let idProducto in contadorProductos) {
          cartCounter += contadorProductos[idProducto];
        }

        let carritoActualizado = {
          id_producto: listaIdProductos[index],
          id_usuario: userId,
          cantidad: contadorProductos[listaIdProductos[index]]
        }
        
        await updateCart(carritoActualizado);

        localStorage.setItem('cartCounter', cartCounter);
        localStorage.setItem('contadorProductos', JSON.stringify(contadorProductos));
        document.querySelector('.cart-counter').innerHTML = cartCounter;
        mostrarCarrito();
      })
    })



    document.querySelectorAll('.delete-from-cart-button').forEach((deleteButton, index) => {
      deleteButton.addEventListener('click', async () => {

        let carritoAeliminar = {
          id_producto: listaIdProductos[index],
          id_usuario: userId,
          cantidad: contadorProductos[listaIdProductos[index]]
        }

        await deleteCart(carritoAeliminar);

        delete contadorProductos[listaIdProductos[index]];
        listaIdProductos.splice(index, 1);
        cartCounter = 0;
        for (let idProducto in contadorProductos) {
          cartCounter += contadorProductos[idProducto];
        }

        localStorage.setItem('cartCounter', cartCounter);
        localStorage.setItem('contadorProductos', JSON.stringify(contadorProductos));
        localStorage.setItem('listaIdProductos', JSON.stringify(listaIdProductos));
        document.querySelector('.cart-counter').innerHTML = cartCounter;
        mostrarCarrito();
      });
    });

  }

}

async function updateCart(carritoActualizado) {
  try {
    const token = localStorage.getItem('access_token');
    const updateResponse = await fetch(`http://127.0.0.1:8000/cart/${carritoActualizado.id_usuario}/${carritoActualizado.id_producto}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
        body: JSON.stringify(carritoActualizado)
    });
    if (!updateResponse.ok) {
      throw new Error('Error al guardar el carrito');
    }

}catch (error) {
    console.error('Hubo un problema con el carrito:', error);
    alert('Hubo un problema con el carrito. Por favor, intenta de nuevo.');
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


mostrarCarrito();