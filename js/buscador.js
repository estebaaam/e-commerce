busquedaUsuario = localStorage.getItem('busquedaUsuario');
productos = JSON.parse(localStorage.getItem('productos'));

if(!busquedaUsuario){
  window.location.href = "../index.html"
}else{
  document.querySelector('.search').value = busquedaUsuario;
  let productosFiltrados = []
  let coincidencias = 0;
  productos.forEach(producto => {
    if(producto.nombre.toLowerCase().includes(busquedaUsuario.toLowerCase())){
      productosFiltrados.push(producto)
      coincidencias ++;
    }
  });

  if(productosFiltrados.length > 0){
    let productosHTML = '';
    let stockText = '';
    productosHTML += `<h3 my-5>numero de coincidencias: ${coincidencias}</h3>`;
    productosFiltrados.forEach(producto => {
      stockText = producto.existencias ? "En stock" : "Agotado";
      productosHTML += `
    <div class="product-section">
      <div class="product-image-container">
        <img class="product-img" src="${producto.imagen}">
        </div>
        <div class="info-section">
        <a href="../html/product-details.html" onclick="validarIdProducto(${producto.id})">
          <h3 class="product-title">${producto.nombre}</h3>
        </a>
          <p class="price">$${producto.precio}</p>
          <p class="stock">${stockText}</p>
          <p class="product-description">${producto.descripcion}</p>
          </div>
    </div>
    `
    });
    document.querySelector('.cart-wrapper').innerHTML = productosHTML;
  }else{
    document.querySelector('.cart-wrapper').innerHTML = `
    <h2 class="my-5">no hay coincidencias</h2>
    `
  }

}