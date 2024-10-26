if (!localStorage.getItem('userName')) { 
  document.querySelector('.log-sign-buttons').innerHTML = `
  <a href="../html/log-in.html"><button>Login</button></a>
  <a href="../html/sign-in.html"><button>Sign In</button></a>
  `
}else {
  let userName = localStorage.getItem('userName');
  document.querySelector('.log-sign-buttons').innerHTML = `
  <p class="user-name">${userName}</p>
  <a href="/html/informacion-personal.html"><img class="img-avatar" src="../img/icons/avatar.png"></a>
  `
  let cartCounter = localStorage.getItem('cartCounter');
  if(!cartCounter){
    localStorage.setItem('cartCounter',0)
    cartCounter = localStorage.getItem('cartCounter');
  }
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