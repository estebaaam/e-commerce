const logout = () => {
  localStorage.removeItem('userName');
  localStorage.removeItem('user');
  localStorage.removeItem('productos');
  localStorage.removeItem('contadorProductos');
  localStorage.removeItem('cartCounter');
  localStorage.removeItem('userId');
  localStorage.removeItem('listaIdProductos');
  localStorage.removeItem('idProducto');
  window.location.href = "../index.html";
}

async function editarPerfil(){
  user = JSON.parse(localStorage.getItem('user'))
  document.querySelector('.container-information').innerHTML = `
  <div class="col-lg-6 mb-5 mb-lg-0">
              <div class="card-body py-5 px-md-5">
                <h2 class="mb-5">
                    Actualizar Informacion<br/>
                </h2>
                <form>
                  <div data-mdb-input-init class="form-outline mb-4">
                    <input type="text" value="${user.nombre}" id="nombre" class="form-control" />
                    <label class="form-label" for="nombre">Nombre</label>
                  </div>
  
                  <div data-mdb-input-init class="form-outline mb-4">
                    <input type="text" value="${user.telefono}" id="telefono" class="form-control" />
                    <label class="form-label" for="telefono">Número de teléfono</label>
                  </div>
  
                  <div data-mdb-input-init class="form-outline mb-4">
                    <input type="text" value="${user.correo}" id="correo" class="form-control" />
                    <label class="form-label" for="correo">Correo electrónico</label>
                  </div>

                  <div data-mdb-input-init class="form-outline mb-4">
                    <input type="text" value="${user.direccion}" id="direccion" class="form-control" />
                    <label class="form-label" for="direccion">Dirección</label>
                  </div>

                  <div data-mdb-input-init class="form-outline mb-4">
                    <input type="text" value="${user.contraseña}" id="contraseña" class="form-control" />
                    <label class="form-label" for="contraseña">Contraseña</label>
                  </div>
  
                  <button type="button" onclick="updateUser()" data-mdb-button-init data-mdb-ripple-init class="btn btn-primary me-3">
                    Actualizar
                  </button>
                  <button type="submit" data-mdb-button-init data-mdb-ripple-init class="btn btn-danger">
                    Cancelar
                  </button>
                </form>
              </div>
          </div>
  `
}

async function updateUser() {
  let nombre = document.getElementById('nombre').value;
  let correo = document.getElementById('correo').value;
  let telefono = document.getElementById('telefono').value;
  let direccion = document.getElementById('direccion').value;
  let contraseña = document.getElementById('contraseña').value;
  let rol = 'cliente';

  let usuarioActualizado = {
    nombre: nombre,
    correo: correo,
    telefono: telefono,
    direccion: direccion,
    contraseña: contraseña,
    rol: rol
  }

  let userId = parseInt(localStorage.getItem('userId'));
  try {
    const updateResponse = await fetch(`http://127.0.0.1:8000/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioActualizado)
    });

    if (!updateResponse.ok) {
      throw new Error('Error al al actualizar el usuario');
    }else{
      localStorage.setItem('user', JSON.stringify(usuarioActualizado));
      localStorage.setItem('userName', usuarioActualizado.nombre);
      window.location.href = "../html/informacion-personal.html";
    }

}catch (error) {
    console.error('Hubo un problema al actualizar el usuario:', error);
    alert('Hubo un problema al actualizar el usuario. Por favor, intenta de nuevo.');
}
}
