async function verifyUser (){
  let rol = localStorage.getItem('rol');
  if (await verifyToken() ===  'expired') {

    document.getElementById('securityModal').innerHTML = `
    <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">Error De Autenticacion</h5>
      </div>
      <div class="modal-body">
          <p class="modal-body-message">Ups, hubo un error al authenticar su cuenta, inicie sesion nuevamente.</p>
        </div>
      <div class="modal-footer">   
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Aceptar</button>
      </div>
    </div>
  </div>
    `
    const modalElement = document.getElementById('securityModal');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
    document.querySelector('.user-login').innerHTML = `
    <li>
        <a href="/html/sign-in.html">Sign In</a>
    </li>
    <li>
        <a href="/html/log-in.html">Log In</a>
    </li>
    `
    localStorage.removeItem('userName');
    localStorage.removeItem('contadorProductos');
    localStorage.removeItem('cartCounter');
    localStorage.removeItem('userId');
    localStorage.removeItem('listaIdProductos');
    localStorage.removeItem('busquedaUsuario');
    localStorage.removeItem('totalPrice');
    localStorage.removeItem('access_token');
    localStorage.removeItem('rol');
  }else if (! await verifyToken() || rol === 'administrador') {
    
    document.querySelector('.user-login').innerHTML = `
    <li>
        <a href="/html/sign-in.html">Sign In</a>
    </li>
    <li>
        <a href="/html/log-in.html">Log In</a>
    </li>
    `
    localStorage.removeItem('userName');
    localStorage.removeItem('contadorProductos');
    localStorage.removeItem('cartCounter');
    localStorage.removeItem('userId');
    localStorage.removeItem('listaIdProductos');
    localStorage.removeItem('busquedaUsuario');
    localStorage.removeItem('totalPrice');
    localStorage.removeItem('access_token');
    localStorage.removeItem('rol');
  }else {
    let userName = localStorage.getItem('userName');
    document.querySelector('.user-login').innerHTML = `
      <li class="nav-item dropdown">
          <a class="nav-icon dropdown-toggle d-inline-block d-sm-none" href="#"
              data-bs-toggle="dropdown">
              <i class="align-middle" data-feather="settings"></i>
          </a>
          <a class="nav-link dropdown-toggle d-none d-sm-inline-block" href="#"
              data-bs-toggle="dropdown">
              <a><p class="user-name">${userName}</p></a>
          </a>
          <div class="dropdown-menu dropdown-menu-end">
              <a class="dropdown-item text-primary" href="/html/informacion-personal.html">Perfil</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item text-primary" onclick="logout()" href="#">Log out</a>
          </div>
      </li>
    `
    let cartCounter = localStorage.getItem('cartCounter');
    cartCounter = parseInt(cartCounter);
    document.querySelector('.cart-counter').innerHTML = cartCounter;
  }
}

const validarIdProducto = (idProducto) => {
  localStorage.setItem('idProducto',idProducto)
}

const guardarBusqueda = () => {
  const busquedaUsuario = document.querySelector('.search').value;
  localStorage.setItem('busquedaUsuario',busquedaUsuario)
  window.location.href = "../html/buscador.html"
}

verifyUser ()

async function verifyToken() {
  const token = localStorage.getItem('access_token');
  if (!token) return false;

  const response = await fetch('http://127.0.0.1:8000/verify-token', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.ok) {
    return true;
  } else {
    const error = await response.json();
    if (error.detail === "Token expirado") {
      return 'expired';
    }
  }
}

const logout = () => {
  localStorage.removeItem('userName');
  localStorage.removeItem('contadorProductos');
  localStorage.removeItem('cartCounter');
  localStorage.removeItem('userId');
  localStorage.removeItem('listaIdProductos');
  localStorage.removeItem('idProducto');
  localStorage.removeItem('busquedaUsuario');
  localStorage.removeItem('totalPrice');
  localStorage.removeItem('access_token');
  localStorage.removeItem('rol');
  window.location.href = "../index.html";
}