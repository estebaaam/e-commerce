async function logIn (event) {
    event.preventDefault();
    const correo = document.getElementById('correo').value;
    const contraseña = document.getElementById('password').value;
    try {
        const formData = new FormData();
        formData.append('username', correo);
        formData.append('password', contraseña);

        const response = await fetch('http://127.0.0.1:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formData).toString(),
        });

        if (!response.ok) {
            throw new Error('Error al autenticar');
        }

        const data = await response.json();
        const access_token = data.access_token;
        localStorage.setItem('access_token', access_token);
        const user = await getUser(correo);
        if (user) {
            await traerCarrito(user.id)
            const rol =user.rol
            localStorage.setItem('userName', user.nombre);
            localStorage.setItem('userId', user.id);
            localStorage.setItem('rol', rol);
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

async function traerCarrito(id){
    try {
        const token = localStorage.getItem('access_token');
        const responseCarrito = await fetch(`http://127.0.0.1:8000/cart/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

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

  async function getUser(correo){
    try {
        const token = localStorage.getItem('access_token');
        const responseUser = await fetch(`http://127.0.0.1:8000/users/${correo}`, {
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