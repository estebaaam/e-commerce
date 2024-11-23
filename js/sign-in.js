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
        const response = await fetch('http://127.0.0.1:8000/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoUsuario)
        });
        if (response.ok) {
            const data = await response.json();
            const access_token = data.access_token;
            localStorage.setItem('access_token', access_token);
            const user = await getUser(correo);
            localStorage.setItem('userId', user.id);
            localStorage.setItem('userName',user.nombre);
            let contadorProductos = {};
            let cartCounter = 0;
            localStorage.setItem('contadorProductos', JSON.stringify(contadorProductos));
            localStorage.setItem('cartCounter',cartCounter)
            window.location.href = "../index.html";
        } else {
            throw new Error('Error al guardar el usuario');
        }
    
    }catch (error) {
        console.error('Hubo un problema con el registro:', error);
        alert('Hubo un error al registrar tu cuenta. Por favor, intenta de nuevo.');
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