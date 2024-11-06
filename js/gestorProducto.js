let currentPage = 1;
const productsPerPage = 8; // Cambia esto según el número de productos por página
let products = [];
let categories = []; // Array para almacenar las categorías

async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:8000/categories/');
        if (!response.ok) {
            throw new Error('Error al obtener las categorías');
        }
        categories = await response.json(); // Guardamos las categorías
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:8000/products/');
        if (!response.ok) {
            throw new Error('Error al obtener los productos');
        }
        
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function getCategoryNameById(id) {
    const category = categories.find(cat => cat.id === id);
    return category ? category.nombre : 'Sin categoría'; // Retorna el nombre o 'Sin categoría' si no se encuentra
}

function renderProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const paginatedProducts = products.slice(start, end);

    paginatedProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.imagen}" alt="${product.nombre}" style="width: 50px;"></td>
            <td>${product.nombre}</td>
            <td>${getCategoryNameById(product.id_categoria)}</td> <!-- Obtener el nombre de la categoría -->
            <td>${product.descripcion}</td>
            <td>${product.precio}</td>
            <td>${product.existencias}</td>
            <td>
                <button type="button" class="btn btn-link btn-rounded btn-sm fw-bold" data-mdb-ripple-color="dark" onclick="openEditModal(${product.id})">Editar</button>
                <button type="button" class="btn btn-link btn-rounded btn-sm fw-bold" data-mdb-ripple-color="dark">Desactivar</button>
            </td>
        `;
        productList.appendChild(row);
    });

    updatePaginationControls();
}

function updatePaginationControls() {
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage * productsPerPage >= products.length;
    pageInfo.textContent = `Página ${currentPage}`;
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderProducts();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage * productsPerPage < products.length) {
        currentPage++;
        renderProducts();
    }
});

// Llama a la función para cargar las categorías y productos cuando la página esté lista
document.addEventListener('DOMContentLoaded', async () => {
    await fetchCategories(); // Asegúrate de que las categorías estén disponibles
    await fetchProducts(); // Luego, carga los productos
});

// Función para cargar las categorías en el select
function loadCategories() {
    fetch('http://localhost:8000/categories/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las categorías');
            }
            return response.json();
        })
        .then(categories => {
            const categorySelect = document.getElementById('editProductCategory');
            // Limpiar opciones actuales
            categorySelect.innerHTML = '<option value="">Seleccione una Categoría</option>';
            // Agregar opciones de categorías
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id; // Asignar el ID de la categoría
                option.textContent = category.nombre; // Asignar el nombre de la categoría
                categorySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Función para abrir el modal de edición
function openEditModal(productId) {
    // Cargar las categorías primero
    loadCategories();

    fetch(`http://localhost:8000/products/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del producto');
            }
            return response.json();
        })
        .then(product => {
            // Cargar los datos en el formulario
            document.getElementById('productId').value = product.id;
            document.getElementById('editProductName').value = product.nombre;
            document.getElementById('editProductDescription').value = product.descripcion;
            document.getElementById('editProductPrice').value = product.precio;
            document.getElementById('editProductStock').value = product.existencias;
            document.getElementById('editProductImage').value = product.imagen; // Cargar la URL de la imagen

            // Cargar el ID de la categoría en el select
            const categorySelect = document.getElementById('editProductCategory');
            categorySelect.value = product.id_categoria; // Asignar el ID de la categoría

             // Mostrar el modal
             const modal = document.getElementById('editProductModal');
             modal.style.display = 'flex'; // Cambia esto a 'flex'
             modal.style.justifyContent = 'center'; // Centrar horizontalmente
             modal.style.alignItems = 'center'; // Centrar verticalmente
        })
        .catch(error => console.error('Error:', error));
}

// Función para cerrar el modal
function closeEditModal() {
    document.getElementById('editProductModal').style.display = 'none';
}

// Función para guardar los cambios del producto editado
function saveProductEdit() {
    const productId = document.getElementById('productId').value;
    const updatedProduct = {
        nombre: document.getElementById('editProductName').value,
        descripcion: document.getElementById('editProductDescription').value,
        precio: parseFloat(document.getElementById('editProductPrice').value),
        existencias: parseInt(document.getElementById('editProductStock').value, 10),
        imagen: document.getElementById('editProductImage').value || "default_image.jpg", // Valor predeterminado si está vacío
        id_categoria: parseInt(document.getElementById('editProductCategory').value, 10) || 1, // Valor predeterminado si está vacío
        ultima_actualizacion: new Date().toISOString().split('T')[0] // Fecha de hoy en formato YYYY-MM-DD
    };

    fetch(`http://localhost:8000/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la actualización del producto');
        }
        return response.json();
    })
    .then(data => {
        console.log('Producto actualizado:', data);
        closeEditModal();
        // Recargar o actualizar la lista de productos si es necesario
        fetchProducts(); // Recarga la lista de productos
    })
    .catch(error => console.error('Error:', error));
}
