function verifyCheckBox(event) {
  event.preventDefault();

  const form = document.getElementById('formulario');
  const isValid = form.checkValidity();

  if (isValid) {
    const elements = form.elements;
    for (let i = 0; i < elements.length; i++) {
      elements[i].disabled = true;
    }
    document.querySelector('.btn-autocompletar').disabled = true;
    const paypalContainer = document.querySelector('.paypal-container');
    paypalContainer.innerHTML = `
      <div id="paypal-button-container" class="paypal-button-container"></div>
      <p id="result-message"></p>
    `;

    let totalPrice = localStorage.getItem('totalPrice')
    window.paypal
      .Buttons({
        style: {
          shape: "rect",
          layout: "vertical",
          color: "gold",
          label: "paypal",
        },
        message: {
          amount: totalPrice,
        },

        async createOrder() {
          try {
            const token = localStorage.getItem('access_token');
            const response = await fetch("http://127.0.0.1:8000/api/orders", {
              method: "POST",
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
              // use the "body" param to optionally pass additional order information
              // like product ids and quantities
              body: JSON.stringify({
                amount: totalPrice,
              }),
            });

            const responeData = await response.json();
            const orderData = JSON.parse(responeData);

            if (orderData.id) {
              return orderData.id;
            }
            const errorDetail = orderData?.details?.[0];
            const errorMessage = errorDetail
              ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
              : JSON.stringify(orderData);

            throw new Error(errorMessage);
          } catch (error) {
            console.error(error);
            resultMessage(`Could not initiate PayPal Checkout...<br><br>${error}`);
          }
        },

        async onApprove(data, actions) {
          try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://127.0.0.1:8000/api/orders/${data.orderID}/capture`, {
              method: "POST",
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            });

            const responeData = await response.json();
            const orderData = JSON.parse(responeData);

            // Three cases to handle:
            //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            //   (2) Other non-recoverable errors -> Show a failure message
            //   (3) Successful transaction -> Show confirmation or thank you message

            const errorDetail = orderData?.details?.[0];

            if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
              // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
              // recoverable state, per
              // https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
              return actions.restart();
            } else if (errorDetail) {
              // (2) Other non-recoverable errors -> Show a failure message
              throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
            } else if (!orderData.purchase_units) {
              throw new Error(JSON.stringify(orderData));
            } else {
              // (3) Successful transaction -> Show confirmation or thank you message
              // Or go to another URL:  
              placeOrder();
            }
          } catch (error) {
            console.error(error);
            resultMessage(
              `Sorry, your transaction could not be processed...<br><br>${error}`
            );
          }
        },
      })
      .render("#paypal-button-container");

  } else {
    form.reportValidity();
  }
}

// Example function to show a result to the user. Your site's UI library can be used instead.
function resultMessage(message) {
  const container = document.querySelector("#result-message");
  container.innerHTML = message;
}

async function placeOrder() {

  let userId = localStorage.getItem('userId');
  let totalPrice = localStorage.getItem('totalPrice')

  let id_usuario = userId
  let estado = 'pendiente'
  let nombre_envio = document.getElementById('nombre').value;
  let telefono_envio = document.getElementById('telefono').value;
  let correo_envio = document.getElementById('correo').value;
  let direccion_envio = document.getElementById('direccion').value;
  let cantidad_total = cartCounter;
  let precio_total = totalPrice;

  let order = {
    id_usuario,
    estado,
    nombre_envio,
    telefono_envio,
    correo_envio,
    direccion_envio,
    cantidad_total,
    precio_total
  }

  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch('http://127.0.0.1:8000/orders/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
        body: JSON.stringify(order)
    });
    if (!response.ok) {
      throw new Error('Error al realizar el pedido');
    }

    const orderResponse = await response.json();

    let id_pedido = orderResponse.id;

    let contadorProductos = JSON.parse(localStorage.getItem('contadorProductos'));

    for (let idProducto in contadorProductos) {
      let producto = await getProduct(parseInt(idProducto));
    
      if (producto) {
        producto.existencias -= contadorProductos[idProducto];
        await updateProducts(producto, idProducto);
      }
    }

    for (const [id_producto, cantidad] of Object.entries(contadorProductos)) {
      let cart_order = {
        id_producto: parseInt(id_producto),
        id_usuario: parseInt(id_usuario),
        id_pedido: parseInt(id_pedido),
        cantidad: parseInt(cantidad)
      };

      await saveCartOrder(cart_order);
    }

    for (const [id_producto, cantidad] of Object.entries(contadorProductos)) {
      let carritoAeliminar = {
        id_producto: parseInt(id_producto),
        id_usuario: parseInt(id_usuario),
        cantidad: parseInt(cantidad)
      };

      await deleteCart(carritoAeliminar);
    }

    cartCounter = 0;
    contadorProductos = {}
    totalPrice = 0;
    localStorage.setItem('totalPrice', totalPrice);
    localStorage.setItem('cartCounter', cartCounter);
    localStorage.setItem('contadorProductos', JSON.stringify(contadorProductos));

    Swal.fire({
      title: "confimacion de compra",
      text: "su pedido se realizo con exito!",
      icon: "success",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "../html/informacion-personal.html";
      }
    });

}catch (error) {
    console.error('Hubo un problema al realizar el pedido:', error);
    alert('Hubo un problema al realizar el pedido. Por favor, intenta de nuevo.');
}

}

async function saveCartOrder(cart_order) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch('http://127.0.0.1:8000/cartOrder/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
      body: JSON.stringify(cart_order)
    });
    if (!response.ok) {
      throw new Error('Error al guardar el pedido del carrito');
    }
  } catch (error) {
    console.error('Hubo un problema al guardar el pedido del carrito:', error);
    alert('Hubo un problema al guardar el pedido del carrito. Por favor, intenta de nuevo.');
  }
}

async function deleteCart(carritoAeliminar) {
  try {
    const token = localStorage.getItem('access_token');
    const updateResponse = await fetch(`http://127.0.0.1:8000/cart/${carritoAeliminar.id_usuario}/${carritoAeliminar.id_producto}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
    });
    if (!updateResponse.ok) {
      throw new Error('Error al eliminar el registro');
    }

}catch (error) {
    console.error('Hubo un problema con el carrito:', error);
    alert('Hubo un problema con el carrito. Por favor, intenta de nuevo.');
}
}

async function updateProducts(Productoctualizado,id_producto) {
  try {
    const token = localStorage.getItem('access_token');
    const updateResponse = await fetch(`http://127.0.0.1:8000/products/${id_producto}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
        body: JSON.stringify(Productoctualizado)
    });
    if (!updateResponse.ok) {
      throw new Error('Error al guardar el producto actualizado');
    }

}catch (error) {
    console.error('Hubo un problema con el producto actualizado:', error);
    alert('Hubo un problema con el producto actualizado. Por favor, intenta de nuevo.');
}
}

async function getUser(id){
  try {
      const token = localStorage.getItem('access_token');
      const responseUser = await fetch(`http://127.0.0.1:8000/users/id/${id}`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });


      if (!responseUser) {
          throw new Error('Error al traer el usuario');
      }

      const user = await responseUser.json();
      return user;
 
  }catch (error) {
      console.error('Hubo un problema al traer el usuario:', error);
      alert('Hubo un error al traer el usuario.');
  }
}

async function getProduct(id_producto){
  try {
      const response = await fetch(`http://127.0.0.1:8000/products/${id_producto}`);
      const product = await response.json();

      if (!response.ok) {
        throw new Error('Error al cargar el producto');
      }

      return product;

  }catch (error) {
      console.error('Hubo un problema al cargar el producto:', error);
      alert('Hubo un error al cargar el producto.');
  }
}
                    