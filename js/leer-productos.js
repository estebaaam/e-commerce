const idProducto = localStorage.getItem('idProducto');
const productos = JSON.parse(localStorage.getItem('productos'));  

const productoSeleccionado = productos.find(producto => producto.id == idProducto);

document.getElementById('product-name').innerHTML = productoSeleccionado.nombre;
document.getElementById('price').innerHTML = `$${productoSeleccionado.precio}`;
document.getElementById('description').innerHTML = productoSeleccionado.descripcion;
document.getElementById('product-img').src = productoSeleccionado.imagen;
const stockText = productoSeleccionado.existencias ? "En stock" : "Agotado";
document.getElementById('stock').innerHTML = stockText;

async function loadComments() {

  const reseñas = await getReviews(idProducto);
  let commentsHTML = ''
  const calificacionesPendientes = [];
  let data = [
    {
      'star': 5,
      'count': 0
    },
    {
      'star': 4,
      'count': 0
    },
    {
      'star': 3,
      'count': 0
    },
    {
      'star': 2,
      'count': 0
    },
    {
      'star': 1,
      'count': 0
    }
  ]
  if( reseñas.length > 0){
    commentsHTML += `<h3 class="mb-5">Reseñas</h3>`
    commentsHTML += `
    <div class="rating">
      <div class="rating_average">
          <h1></h1>
          <div class="star-outer">
              <div class="star-inner"></div>
          </div>
          <p></p>
      </div>
      <div class="rating_progress">
      </div>
  </div>
    `
    for (const reseña of reseñas) {
      let usuario = await getUser(reseña.id_usuario);
      commentsHTML += `
      <div class="card text-body">
      <div class="card-body p-4">
        <div class="d-flex flex-start">
          <div>
            <h6 class="fw-bold mb-1">${usuario.nombre}</h6>
            <div class="container-rating">
              <span class="fa fa-star" id="1-${reseña.id}"></span>
              <span class="fa fa-star" id="2-${reseña.id}"></span>
              <span class="fa fa-star" id="3-${reseña.id}"></span>
              <span class="fa fa-star" id="4-${reseña.id}"></span>
              <span class="fa fa-star" id="5-${reseña.id}"></span>
            </div>
            <div class="d-flex align-items-center mb-3">
              <p class="mb-0">${reseña.fecha_reseña}</p>
            </div>
            <p class="mb-0">${reseña.comentario}</p>
          </div>
        </div>
      </div>
    </div>
      `
      for (let index = 0; index < 5; index++) {
        if(reseña.calificacion === data[index].star){
          data[index].count ++;
        }
      }
      calificacionesPendientes.push({ calificacion: reseña.calificacion, id: reseña.id });
    };
  }else{
    commentsHTML += '<h4>Este producto no tiene reseñas</h4>'
  }
  document.querySelector('.comments-container').innerHTML = commentsHTML;
  
  calculateRating(data);

  calificacionesPendientes.forEach(({ calificacion, id }) => {
    cargarCalificacion(calificacion, id);
});
}

loadComments();

async function getReviews(id_producto) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/reviews/product/${id_producto}`);
    const productReviews = await response.json();

    if (!response.ok) {
      throw new Error('Error con las reseñas');
    }

    return productReviews;

  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un error con las reseñas.');
  }
}

async function getUser(id) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/users/${id}`);
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

function cargarCalificacion(calificacion,id){
  for (let i = 0; i < 5; i++) {
    if(i < calificacion){
      document.getElementById(`${i+1}-${id}`).style.color = "orange";
    }
  }
}

function calculateRating(data) {
  let total_rating = 0;
  let rating_based_on_star = 0;

  data.forEach(rating => {
    total_rating += rating.count;
    rating_based_on_star += rating.count * rating.star;
  });

  data.forEach(rating => {
    let rating_progress = `
  <div class="rating_progress-value">
    <p>${rating.star} <span class="star">&#9733;</span></p>
    <div class="progress">
        <div class="bar" style="width: ${(rating.count / total_rating) * 100}%;"></div>
    </div>
    <p>${rating.count.toLocaleString()}</p>
</div>
  `

    document.querySelector('.rating_progress').innerHTML += rating_progress;
  });

  let rating_average = (rating_based_on_star / total_rating).toFixed(1)

  document.querySelector('.rating_average p').innerHTML = total_rating.toLocaleString();
  document.querySelector('.rating_average h1').innerHTML = rating_average;
  document.querySelector('.star-inner').style.width = (rating_average / 5) * 100 + "%";
}