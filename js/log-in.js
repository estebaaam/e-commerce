async function logIn (event) {
    event.preventDefault();
    const correo = document.getElementById('correo').value;
    const contraseña = document.getElementById('password').value;
    try {
        const responseUsers = await fetch('http://127.0.0.1:8000/users/');
        const users = await responseUsers.json();
        const user = users.find(user => user.correo === correo && user.contraseña === contraseña);

        if (user) {
            const rol =user.rol;
            localStorage.setItem('userName', user.nombre);
            localStorage.setItem('userId', user.id);
            localStorage.setItem('user', JSON.stringify(user));
            await traerProductos();
            await traerCarrito(user.id);
            await getCartOrder(user.id);
            await getOrders(user.id);
            if (rol === 'administrador') {
                window.location.href = "../html/dashboard.html";
            } else if (rol === 'cliente') {
                window.location.href = "../index.html";
            }
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        alert("Error al cargar los datos");
    }
}

async function traerProductos(){
    try {
        const responseProductos = await fetch('http://127.0.0.1:8000/products/');
        const productos = await responseProductos.json();

        if (!responseProductos.ok) {
            throw new Error('Error al traer los productos');
        }

        localStorage.setItem('productos',JSON.stringify(productos));
   
    }catch (error) {
        console.error('Hubo un problema al traer los productos:', error);
        alert('Hubo un error al traer los productos.');
    }
}

async function traerCarrito(id){
    try {
        const responseCarrito = await fetch(`http://127.0.0.1:8000/cart/${id}`);
        const carrito = await responseCarrito.json();

        let contadorProductos = {};
        let cartCounter = 0;

        if(!carrito){
            localStorage.setItem('contadorProductos',JSON.stringify(contadorProductos));
        }else{
            carrito.forEach(item => {
                contadorProductos[item.id_producto] = item.cantidad;
            });
            localStorage.setItem('contadorProductos', JSON.stringify(contadorProductos));

            for (let id_producto in contadorProductos) {
                cartCounter += contadorProductos[id_producto];
              }
        }

        localStorage.setItem('cartCounter',cartCounter)
   
    }catch (error) {
        console.error('Hubo un problema al traer el carrito:', error);
        alert('Hubo un error al traer el carriro.');
    }
}

async function getCartOrder(id_usuario){
    try {
        const response = await fetch(`http://127.0.0.1:8000/cartOrder/${id_usuario}`);
        let cart_order = await response.json();
  
        if (cart_order.length > 0) {
            localStorage.setItem('cart_order',JSON.stringify(cart_order));
        }
  
    }catch (error) {
        console.error('Hubo un problema al traer los pedidos:', error);
        alert('Hubo un error al traer los pedidos.');
    }
  }

  async function getOrders(id_usuario){
    try {
        const response = await fetch(`http://127.0.0.1:8000/orders/${id_usuario}`);
        const orders = await response.json();
  
        if (orders.length > 0) {
            localStorage.setItem('orders',JSON.stringify(orders));
        }
  
    }catch (error) {
        console.error('Hubo un problema al traer los pedidos:', error);
        alert('Hubo un error al traer los pedidos.');
    }
  }