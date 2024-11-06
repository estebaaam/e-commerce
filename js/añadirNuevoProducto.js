const categoriesMap = {}; // Mapa para almacenar la relación entre nombres de categorías y sus IDs

// Función para cargar las categorías al cargar la página
async function loadCategories() {
    try {
        const response = await fetch('http://localhost:8000/categories/'); // Asegúrate de que este es el endpoint correcto
        if (!response.ok) {
            throw new Error('Error al obtener las categorías');
        }

        const categories = await response.json();
        const categoriaSelect = document.getElementById('categoria');

        // Limpiar el listado actual de categorías
        categoriaSelect.innerHTML = '<option value="">Seleccione una Categoría</option>'; // Reiniciar la lista

        // Agregar las categorías al dropdown y llenar el mapa
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.nombre; // Asumiendo que 'nombre' es el campo correcto
            option.textContent = category.nombre;
            categoriaSelect.appendChild(option);

            // Llenar el mapa con el ID de categoría
            categoriesMap[category.nombre] = category.id; // Asegúrate de que 'id' es el campo correcto
        });
    } catch (error) {
        console.error('Error al cargar las categorías:', error);
        alert('Error al cargar las categorías: ' + error.message);
    }
}

// Cargar las categorías cuando la página se carga
window.onload = loadCategories;

document.getElementById('addCategoryBtn').addEventListener('click', async function() {
    const newCategory = prompt('Ingrese el nombre de la nueva categoría:');
    
    if (newCategory) {
        try {
            const response = await fetch('http://localhost:8000/categories/', { // Asegúrate de que este es el endpoint correcto
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre: newCategory }), // Cambia esto si tu API requiere un formato diferente
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(`Error ${response.status}: ${errorResponse.detail}`);
            }

            // Manejar la respuesta exitosa
            alert('Categoría añadida exitosamente');
            categoriesMap[newCategory] = response.id; // Asignar el ID de la nueva categoría (ajusta según tu respuesta)
            await updateCategoryList(); // Actualizar el listado de categorías
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    } else {
        alert('El nombre de la categoría no puede estar vacío.');
    }
});

async function updateCategoryList() {
    try {
        const response = await fetch('http://localhost:8000/categories/'); // Asegúrate de que este es el endpoint correcto
        if (!response.ok) {
            throw new Error('Error al obtener las categorías');
        }

        const categories = await response.json();
        const categoriaSelect = document.getElementById('categoria');

        // Limpiar el listado actual de categorías
        categoriaSelect.innerHTML = '<option value="">Seleccione una Categoría</option>'; // Reiniciar la lista

        // Agregar las categorías al dropdown
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.nombre; // Asegúrate de que 'nombre' es el campo correcto
            option.textContent = category.nombre;
            categoriaSelect.appendChild(option);
            categoriesMap[category.nombre] = category.id; // Actualizar el mapa
        });
    } catch (error) {
        console.error('Error al actualizar la lista de categorías:', error);
        alert('Error al actualizar la lista de categorías: ' + error.message);
    }
}

<<<<<<< HEAD
=======
// Función para verificar si el producto ya existe en la base de datos
async function checkProductExistence(productName) {
    try {
        const response = await fetch(`http://localhost:8000/products/?nombre=${productName}`); // Asegúrate de que este es el endpoint correcto
        if (!response.ok) {
            throw new Error('Error al verificar si el producto existe');
        }
        
        const products = await response.json();
        return products.length > 0; // Si el array de productos no está vacío, el producto ya existe
    } catch (error) {
        console.error('Error al verificar la existencia del producto:', error);
        alert('Error al verificar si el producto existe: ' + error.message);
        return false; // En caso de error, asumir que el producto no existe
    }
}

>>>>>>> 429adb7 (para unir las ramas)
// Enviar el formulario de producto
document.getElementById('formularioProducto').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect form data
    const nombre = document.getElementById('nombre_producto').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const imagen = document.getElementById('imagen').value;
    const existencias = parseInt(document.getElementById('existencia').value);
    const ultimaActualizacion = document.getElementById('ulActualizacion').value;
    const categoriaSeleccionada = document.getElementById('categoria').value;

    // Obtener el ID de categoría desde el mapa
    const id_categoria = categoriesMap[categoriaSeleccionada] || null; // Si no existe, se queda en null

<<<<<<< HEAD
=======
    // Verificar si el producto ya existe
    const productExists = await checkProductExistence(nombre);
    if (productExists) {
        alert('El producto ya existe en la base de datos.');
        return; // Detener el proceso si el producto ya existe
    }

>>>>>>> 429adb7 (para unir las ramas)
    const productData = {
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        imagen: imagen,
        existencias: existencias,
        ultima_actualizacion: ultimaActualizacion,
        id_categoria: id_categoria, // Usar el ID de categoría obtenido
    };

    try {
        const response = await fetch('http://localhost:8000/products/', { // Updated endpoint here
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Error ${response.status}: ${errorResponse.detail}`);
        }

        // Handle successful response
        alert('Producto guardado exitosamente');
        document.getElementById('formularioProducto').reset();
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    }
});
