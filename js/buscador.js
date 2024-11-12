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
    productosHTML += `<h3>numero de coincidencias: ${coincidencias}</h3>`;
    productosFiltrados.forEach(producto => {
      stockText = producto.existencias ? "En stock" : "Agotado";
      productosHTML += `
    <section class="item-details section">
    <div class="container">
        <div class="top-area">
            <div class="row align-items-center">
                <div class="col-lg-6 col-md-12 col-12">
                    <div class="product-image">
                            <div class="main-img">
                                <img src="${producto.imagen}" id="product-img">
                            </div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-12 col-12">
                    <div class="product-info">
                        <a href="../html/product-details.html" onclick="validarIdProducto(${producto.id})"><h2 id="product-name" class="title">${producto.nombre}</h2></a>
                        <h2 id="stock" class="title">${stockText}</h2>
                        <h3 id="price" class="price text-danger">$${producto.precio}</h3>
                        <p id="description" class="info-text">${producto.descripcion}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
    `
    });
    document.querySelector('.cart-wrapper').innerHTML = productosHTML;
  }else{
    document.querySelector('.cart-wrapper').innerHTML = `
    <h2 class="my-5">no hay coincidencias</h2>
    `
  }

}