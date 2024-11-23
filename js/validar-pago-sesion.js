let cartCounter = parseInt(localStorage.getItem('cartCounter'));
if(!cartCounter){
  window.location.href = "../index.html";
}else{
  let totalPrice = localStorage.getItem('totalPrice');
  document.querySelector('.right-column').innerHTML = `
  <div class="card" style="width: 18rem;">
    <div class="card-body">
        <h5 class="card-title">Resumen de la compra</h5>
        <p class="card-text">Subtotal (${cartCounter} productos)</p>
        <p class="card-text text-danger">$${totalPrice}</p>
      </div>
    </div>
`
}

async function autoComplete() {
  let userId = localStorage.getItem('userId');
  let user = await getUser(userId)

  document.getElementById('nombre').value = user.nombre;
  document.getElementById('telefono').value = user.telefono;
  document.getElementById('correo').value = user.correo;
  document.getElementById('direccion').value = user.direccion; 
}