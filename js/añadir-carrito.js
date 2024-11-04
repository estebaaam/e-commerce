async function addToCart() {
  if (!localStorage.getItem('userName')) {
    window.location.href = "../html/log-in.html";
  } else {
    let contadorProductos = JSON.parse(localStorage.getItem('contadorProductos'));
    let userId = parseInt(localStorage.getItem('userId'));
    let cantidadSeleccionada = parseInt(document.getElementById('quantity').value);
    let idProducto = parseInt(localStorage.getItem('idProducto'));
    const productos = JSON.parse(localStorage.getItem('productos'));
    const producto = productos.find(producto => producto.id === idProducto);

    if(contadorProductos[idProducto] <= producto.existencias  || !contadorProductos[idProducto]){
      if (contadorProductos[idProducto]) {
        contadorProductos[idProducto] += cantidadSeleccionada;
        if(contadorProductos[idProducto] > producto.existencias){
          alert('Ups! Parece que nos quedamos sin este producto')
          contadorProductos[idProducto] -= cantidadSeleccionada;
          return
        }
        let carritoActualizado = {
          id_producto: idProducto,
          id_usuario: userId,
          cantidad: contadorProductos[idProducto]
        }
        await updateCart(carritoActualizado);
      } else if(!contadorProductos[idProducto]){
        contadorProductos[idProducto] = cantidadSeleccionada;
        if(contadorProductos[idProducto] > producto.existencias){
          alert('Ups! Parece que nos quedamos sin este producto')
          delete contadorProductos[idProducto];
          return
        }
        let nuevoCarrito = {
          id_producto: idProducto,
          id_usuario: userId,
          cantidad: contadorProductos[idProducto]
        }
        await addCart(nuevoCarrito);
      }
    }else{
      alert('Ups! Parece que nos quedamos sin este producto')
      return
    }
    

    localStorage.setItem('contadorProductos', JSON.stringify(contadorProductos));

    let cartCounter = 0;

    for (let idProducto in contadorProductos) {
      cartCounter += contadorProductos[idProducto];
    }

    localStorage.setItem('cartCounter', cartCounter);

    document.querySelector('.cart-counter').innerHTML = cartCounter;

    document.querySelector(`.added-to-cart1`).innerHTML = 'añadido';
    setTimeout(() => {
      document.querySelector(`.added-to-cart1`).innerHTML = '';
    }, 2000);
  }
};

async function buySingleProduct() {
  if (!localStorage.getItem('userName')) {
    window.location.href = "../html/log-in.html";
  } else {
    let contadorProductos = JSON.parse(localStorage.getItem('contadorProductos'));
    let userId = parseInt(localStorage.getItem('userId'));
    let cantidadSeleccionada = parseInt(document.getElementById('quantity').value);
    let idProducto = parseInt(localStorage.getItem('idProducto'));
    const productos = JSON.parse(localStorage.getItem('productos'));
    const producto = productos.find(producto => producto.id === idProducto);

    if(contadorProductos[idProducto] <= producto.existencias  || !contadorProductos[idProducto]){
      if (contadorProductos[idProducto]) {
        contadorProductos[idProducto] += cantidadSeleccionada;
        if(contadorProductos[idProducto] > producto.existencias){
          alert('Ups! Parece que nos quedamos sin este producto')
          contadorProductos[idProducto] -= cantidadSeleccionada;
          return
        }
        let carritoActualizado = {
          id_producto: idProducto,
          id_usuario: userId,
          cantidad: contadorProductos[idProducto]
        }
        await updateCart(carritoActualizado);
      } else if(!contadorProductos[idProducto]){
        contadorProductos[idProducto] = cantidadSeleccionada;
        if(contadorProductos[idProducto] > producto.existencias){
          alert('Ups! Parece que nos quedamos sin este producto')
          delete contadorProductos[idProducto];
          return
        }
        let nuevoCarrito = {
          id_producto: idProducto,
          id_usuario: userId,
          cantidad: contadorProductos[idProducto]
        }
        await addCart(nuevoCarrito);
      }
    }else{
      alert('Ups! Parece que nos quedamos sin este producto')
      return
    }

    localStorage.setItem('contadorProductos', JSON.stringify(contadorProductos));

    let cartCounter = 0;

    for (let idProducto in contadorProductos) {
      cartCounter += contadorProductos[idProducto];
    }

    localStorage.setItem('cartCounter', cartCounter);

    document.querySelector('.cart-counter').innerHTML = cartCounter;

    window.location.href = "../html/pago.html";
  }
};

async function addToCartFromStore(idProducto) {
  if (!localStorage.getItem('userName')) {
    window.location.href = "../html/log-in.html";
  } else {
    let contadorProductos = JSON.parse(localStorage.getItem('contadorProductos'));
    let userId = parseInt(localStorage.getItem('userId'));
    const productos = JSON.parse(localStorage.getItem('productos'));
    const producto = productos.find(producto => producto.id === idProducto);

    if(contadorProductos[idProducto] <= producto.existencias  || !contadorProductos[idProducto]){
      if (contadorProductos[idProducto]) {
        contadorProductos[idProducto] += 1;
        if(contadorProductos[idProducto] > producto.existencias){
          alert('Ups! Parece que nos quedamos sin este producto')
          contadorProductos[idProducto] -= 1;
          return
        }
        let carritoActualizado = {
          id_producto: idProducto,
          id_usuario: userId,
          cantidad: contadorProductos[idProducto]
        }
        await updateCart(carritoActualizado);
      } else {
        contadorProductos[idProducto] = 1;
        if(contadorProductos[idProducto] > producto.existencias){
          alert('Ups! Parece que nos quedamos sin este producto')
          delete contadorProductos[idProducto];
          return
        }
        let nuevoCarrito = {
          id_producto: idProducto,
          id_usuario: userId,
          cantidad: contadorProductos[idProducto]
        }
        await addCart(nuevoCarrito);
      }
    }else{
      alert('Ups! Parece que nos quedamos sin este producto')
      return
    }
    

    localStorage.setItem('contadorProductos', JSON.stringify(contadorProductos));

    let cartCounter = 0;

    for (let idProducto in contadorProductos) {
      cartCounter += contadorProductos[idProducto];
    }

    localStorage.setItem('cartCounter', cartCounter);

    document.querySelector('.cart-counter').innerHTML = cartCounter;

    document.querySelector(`.added-to-cart${idProducto}`).innerHTML = 'añadido';
    setTimeout(() => {
      document.querySelector(`.added-to-cart${idProducto}`).innerHTML = '';
    }, 2000);
  }
};

async function addCart(nuevoCarrito) {
  try {
    const updateResponse = await fetch('http://127.0.0.1:8000/cart/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoCarrito)
    });
    if (!updateResponse.ok) {
      throw new Error('Error al guardar el carrito');
    }

}catch (error) {
    console.error('Hubo un problema con el carrito:', error);
    alert('Hubo un problema con el carrito. Por favor, intenta de nuevo.');
}
}

async function updateCart(carritoActualizado) {
  try {
    const updateResponse = await fetch(`http://127.0.0.1:8000/cart/${carritoActualizado.id_usuario}/${carritoActualizado.id_producto}`, {
        method: 'PUT',
        headers: {
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