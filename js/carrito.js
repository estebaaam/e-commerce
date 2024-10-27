function filtrarProductos() {
  let contadorProductos = JSON.parse(localStorage.getItem('contadorProductos'));
  const listaIdProductos = Object.keys(contadorProductos);
  const productos = JSON.parse(localStorage.getItem('productos'));
  const productosFiltrados = productos.filter(producto => listaIdProductos.includes(String(producto.id)));
  localStorage.setItem('listaIdProductos', JSON.stringify(listaIdProductos));
  return productosFiltrados;
}

function mostrarCarrito() {
  let cartCounter = parseInt(localStorage.getItem('cartCounter'));
  if (!cartCounter) {
    document.querySelector('.cart-wrapper').innerHTML = `
  <div class="empty-cart-message-container">
  <p class="empty-cart-message">su carrito está vacío.</p>
  <button class="empty-cart-message-button">Explorar la tienda</button>
  </div>
  <div class="cart-summary">
  <h2>Resumen del Carrito</h2>
  <p>Subtotal (${0} productos): <span>$0</span></p>
  <a href="pago.html">
  </a>
  </div>
  `
  } else {
    const productosFiltrados = filtrarProductos();
    let contadorProductos = JSON.parse(localStorage.getItem('contadorProductos'));
    const listaIdProductos = JSON.parse(localStorage.getItem('listaIdProductos'));
    let productosHTML = '';
    let stockText = '';
    let precioTotal = 0;
    productosFiltrados.forEach(producto => {
      stockText = producto.existencias ? "En stock" : "Agotado";
      precioTotal += producto.precio * contadorProductos[producto.id]
      productosHTML += `
    <div class="product-section">
    <div class="product-image-container">
    <img class="product-img" src="${producto.imagen}">
    </div>
    <div class="info-section">
    <h1 class="product-title">${producto.nombre}</h1>
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
    <button class="delete-from-cart-button">Eliminar Del Carrito</button>
    </div>
    </div>
    </div>
    `
    })

    productosHTML += `
  <div class="cart-summary">
  <h2>Resumen del Carrito</h2>
  <p>Subtotal (${cartCounter} productos): <span>$${precioTotal}</span></p>
  <a href="pago.html">
  <button class="checkout-btn">Proceder con el Pago</button>
  </a>
  </div>
  `

    document.querySelector('.cart-wrapper').innerHTML = productosHTML;

    document.querySelectorAll('.minus-sign').forEach((minusSign, index) => {
      minusSign.addEventListener('click', () => {
        if (contadorProductos[listaIdProductos[index]] > 1) {
          contadorProductos[listaIdProductos[index]]--;
          cartCounter = 0;
          for (let idProducto in contadorProductos) {
            cartCounter += contadorProductos[idProducto];
          }

          localStorage.setItem('cartCounter', cartCounter);
          localStorage.setItem('contadorProductos', JSON.stringify(contadorProductos));
          document.getElementById('cart-counter').innerHTML = cartCounter;
          mostrarCarrito();
        } else {
          minusSign.style.opacity = 0.2;
        }
      })
    })


    document.querySelectorAll('.plus-sign').forEach((minusSign, index) => {
      minusSign.addEventListener('click', () => {
        contadorProductos[listaIdProductos[index]]++;
        cartCounter = 0;
        for (let idProducto in contadorProductos) {
          cartCounter += contadorProductos[idProducto];
        }

        localStorage.setItem('cartCounter', cartCounter);
        localStorage.setItem('contadorProductos', JSON.stringify(contadorProductos));
        document.getElementById('cart-counter').innerHTML = cartCounter;
        mostrarCarrito();
      })
    })



    document.querySelectorAll('.delete-from-cart-button').forEach((deleteButton, index) => {
      deleteButton.addEventListener('click', () => {
        delete contadorProductos[listaIdProductos[index]];
        listaIdProductos.splice(index, 1);
        cartCounter = 0;
        for (let idProducto in contadorProductos) {
          cartCounter += contadorProductos[idProducto];
        }

        localStorage.setItem('cartCounter', cartCounter);
        localStorage.setItem('contadorProductos', JSON.stringify(contadorProductos));
        localStorage.setItem('listaIdProductos', JSON.stringify(listaIdProductos));
        document.getElementById('cart-counter').innerHTML = cartCounter;
        mostrarCarrito();
      });
    });

  }

}

mostrarCarrito();