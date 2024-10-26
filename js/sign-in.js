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
        const responseProductos = await fetch('https://api.jsonbin.io/v3/b/66ff0863ad19ca34f8b243e9');
        const dataProductos = await responseProductos.json();
        const productos = dataProductos.record.productos;

        localStorage.setItem('productos',JSON.stringify(productos));

        if (!responseProductos.ok) {
            throw new Error('Error al traer los productos');
        }
   
    }catch (error) {
        console.error('Hubo un problema al traer los productos:', error);
        alert('Hubo un error al traer los productos.');
    }
}