user = JSON.parse(localStorage.getItem('user'))
if(!user){
  window.location.href = "../index.html";
}else{
  document.getElementById('nombre').innerHTML = user.nombre;
  document.getElementById('telefono').innerHTML = user.telefono;
  document.getElementById('correo').innerHTML = user.correo;
  document.getElementById('direccion').innerHTML = user.direccion;
  document.getElementById('contraseña').innerHTML = user.contraseña;
}