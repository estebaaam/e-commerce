if (!localStorage.getItem('userName')) { 
  document.querySelector('.user-login').innerHTML = `
  <li>
      <a href="/html/sign-in.html">Sign In</a>
  </li>
  <li>
      <a href="/html/log-in.html">Log In</a>
  </li>
  `
  document.querySelector('.user').innerHTML = '';
}else {
  let userName = localStorage.getItem('userName');
  document.querySelector('.user').innerHTML = 'hola!';
  document.querySelector('.user-login').innerHTML = `
  <li>
    <a href="/html/informacion-personal.html"><p class="user-name">${userName}</p></a>
  </li>
  `
  let cartCounter = localStorage.getItem('cartCounter');
  cartCounter = parseInt(cartCounter);
  document.querySelector('.cart-counter').innerHTML = cartCounter;
}
const logout = () => {
  localStorage.removeItem('userName');
  localStorage.removeItem('idCarrito');
  localStorage.removeItem('productos');
  window.location.href = "../index.html";
}

const validarIdProducto = (idProducto) => {
  localStorage.setItem('idProducto',idProducto)
}

/*
async function traerProductos(){
  try {
      const responseProductos = await fetch('http://127.0.0.1:8000/products/');
      const productos = await responseProductos.json();

      localStorage.setItem('productos',JSON.stringify(productos));

      if (!responseProductos.ok) {
          throw new Error('Error al traer los productos');
      }
 
  }catch (error) {
      console.error('Hubo un problema al traer los productos:', error);
      alert('Hubo un error al traer los productos.');
  }
}

traerProductos();
*/