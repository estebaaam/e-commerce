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

const validarIdProducto = (idProducto) => {
  localStorage.setItem('idProducto',idProducto)
}

const guardarBusqueda = () => {
  const busquedaUsuario = document.querySelector('.search').value;
  localStorage.setItem('busquedaUsuario',busquedaUsuario)
  window.location.href = "../html/buscador.html"
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