async function signIn (event) {
    event.preventDefault(); 

    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const correo = document.getElementById('correo').value;
    const direccion = document.getElementById('direccion').value;
    const contraseña = document.getElementById('password').value;

    const nuevoUsuario = {
        nombre: nombre,
        telefono: telefono,
        correo: correo,
        direccion: direccion,
        contraseña: contraseña,
        rol: 'cliente' 
    };

    try {
        const updateResponse = await fetch('http://127.0.0.1:8000/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoUsuario)
        });
        if (updateResponse.ok) {
            localStorage.setItem('userName',nuevoUsuario.nombre);
            localStorage.setItem('user', JSON.stringify(nuevoUsuario));
            let contadorProductos = {};
            let cartCounter = 0;
            localStorage.setItem('contadorProductos', JSON.stringify(contadorProductos));
            localStorage.setItem('cartCounter',cartCounter)
            await traerUsuario(nuevoUsuario.correo);
            await traerProductos();
            window.location.href = "../index.html";
        } else {
            throw new Error('Error al guardar el usuario');
        }
    
    }catch (error) {
        console.error('Hubo un problema con el registro:', error);
        alert('Hubo un error al registrar tu cuenta. Por favor, intenta de nuevo.');
    }
}

async function traerProductos(){
    try {
        const responseProductos = await fetch('http://127.0.0.1:8000/products/');
        const productos = await responseProductos.json();

        if (!responseProductos.ok) {
            throw new Error('Error al traer los productos');
        }else{
            localStorage.setItem('productos',JSON.stringify(productos));   
        }
   
    }catch (error) {
        console.error('Hubo un problema al traer los productos:', error);
        alert('Hubo un error al traer los productos.');
    }
}

async function traerUsuario(correo){
    try {
        const responseUsers = await fetch('http://127.0.0.1:8000/users/');
        const users = await responseUsers.json();
        const user = users.find(user => user.correo === correo);

        if (!user) {
            throw new Error('Error al traer los usuarios');
        }else{
            localStorage.setItem('userId', user.id);
        }
   
    }catch (error) {
        console.error('Hubo un problema al traer los usuarios:', error);
        alert('Hubo un error al traer los usuarios.');
    }
}