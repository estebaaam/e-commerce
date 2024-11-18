async function readUser() {
  let userId = localStorage.getItem('userId');
  if(!userId){
    window.location.href = "../index.html";
  }else{
    user = await getUser(userId);
    document.getElementById('nombre').innerHTML = user.nombre;
    document.getElementById('telefono').innerHTML = user.telefono;
    document.getElementById('correo').innerHTML = user.correo;
    document.getElementById('direccion').innerHTML = user.direccion;
  }
}

readUser();

async function getUser(id) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/users/id/${id}`);
    const user = await response.json();

    if (!response.ok) {
      throw new Error('Error al traer el usuario');
    }

    return user;

  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un error al traer el usuario.');
  }
}