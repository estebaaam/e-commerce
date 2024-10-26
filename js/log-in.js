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
            await traerProductos();
            if (rol === 'administrador') {
                window.location.href = "../dashboard.html";
            } else if (rol === 'cliente') {
                window.location.href = "../index.html";
            }
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    } catch (error) {
        console.error('Error al cargar los datos del JSON:', error);
    }
}

async function traerProductos(){
    try {
        const responseProductos = await fetch('http://127.0.0.1:8000/products/');
        const productos = await responseProductos.json();

        localStorage.setItem('productos',JSON.stringify(productos));

        if (!responseProductos.ok) {
            throw new Error('Error al traer los productos');
        }
   
    }catch (error) {
        console.error('Hubo un problema al traer los productos:', error);
        alert('Hubo un error al traer los productos.');
    }
}