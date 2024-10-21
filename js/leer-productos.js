const idProducto = localStorage.getItem('idProducto');
const productos = JSON.parse(localStorage.getItem('productos'));  

const productoSeleccionado = productos.find(producto => producto.id == idProducto);

document.getElementById('product-name').innerHTML = productoSeleccionado.nombre;
document.getElementById('price').innerHTML = `$${productoSeleccionado.precio}`;
document.getElementById('description').innerHTML = productoSeleccionado.descripcion;
document.getElementById('product-img').src = productoSeleccionado.imagen;
const stockText = productoSeleccionado.en_stock ? "En stock" : "Agotado";
document.getElementById('stock').innerHTML = stockText;
