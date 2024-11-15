async function traerProductos() {
  try {
      const responseProductos = await fetch('http://127.0.0.1:8000/products/active');
      const productos = await responseProductos.json();

      if (!responseProductos.ok) {
          throw new Error('Error al traer los productos');
      }

      let categorias = await traerCategorias();
      let productosHTML = '';

      categorias.forEach(categoria => {
          productosHTML += `<h3 class="category-products mt-5">${categoria.nombre}</h3>`;
          productosHTML += `<div class="carousel-container">`;
          productosHTML += `<button class="carousel-prev">←</button>`;
          productosHTML += `<div class="carousel">`
          
          let contador = 0;
          productos.forEach(producto => {
              if (categoria.id === producto.id_categoria) {
                  productosHTML += `
                  <div class="card-item">
                      <div class="single-product">
                          <div class="product-image">
                              <img src="${producto.imagen}">
                              <div onclick="validarIdProducto(${producto.id})" class="button">
                                  <a href="/html/product-details.html" class="btn"><i class="lni lni-cart"></i>Ver Mas</a>
                              </div>
                          </div>
                          <div class="product-info">
                              <span class="category">${categoria.nombre}</span>
                              <h4 class="title">
                                  <a>${producto.nombre}</a>
                              </h4>
                              <div class="price">
                                  <span>$${producto.precio}</span>
                              </div>
                          </div>
                          <button onclick="addToCartFromStore(${producto.id})" class="btn btn-primary">Add To Cart</button>
                          <div class="added-to-cart${producto.id}"></div>
                      </div>
                  </div>
                  `;
                  contador++;
              }
          });
          
          productosHTML += `</div>`;
          productosHTML += `<button class="carousel-next">→</button>`;
          productosHTML += `</div>`;
      });
      
      document.querySelector('.products-container').innerHTML = productosHTML;

  } catch (error) {
      console.error('Hubo un problema al traer los productos:', error);
      alert('Hubo un error al traer los productos.');
  }
}


async function traerCategorias(){
  try {
      const responseCategories = await fetch('http://127.0.0.1:8000/categories/');
      const categorias = await responseCategories.json();

      if (!responseCategories.ok) {
          throw new Error('Error al traer los productos');
      }

      let categoriasHTML = ''

      if(categorias.length > 0){
        categorias.forEach(categoria => {
          categoriasHTML += `
          <li><a href="">${categoria.nombre}</a></li>
          `
        });
      }else{
        categoriasHTML += `
          <li><a href="">Ups! parece que nos quedamos sin categorias</a></li>
          `
      }
      
      document.querySelector('.sub-category').innerHTML = categoriasHTML;

      return categorias
 
  }catch (error) {
      console.error('Hubo un problema al traer los productos:', error);
      alert('Hubo un error al traer los productos.');
  }
}

traerProductos();

document.addEventListener("click", function(event) {
  if (event.target.classList.contains("carousel-next")) {
      const carousel = event.target.previousElementSibling;
      carousel.scrollBy({ left: 300, behavior: "smooth" });
  } else if (event.target.classList.contains("carousel-prev")) {
      const carousel = event.target.nextElementSibling;
      carousel.scrollBy({ left: -300, behavior: "smooth" });
  }
});
