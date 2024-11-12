// Variables de configuración y datos de productos
let currentPage = 1;
const productsPerPage = 8;
let products = [];
let categories = [];

// Función para obtener categorías
async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:8000/categories/');
        if (!response.ok) {
            throw new Error('Error al obtener las categorías');
        }
        categories = await response.json();
    } catch (error) {
        console.error('Error al obtener categorías:', error);
    }
}

// Función para obtener productos
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:8000/products/');
        if (!response.ok) {
            throw new Error('Error al obtener los productos');
        }
        
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
}

function getCategoryNameById(id) {
    const category = categories.find(cat => cat.id === id);
    return category ? category.nombre : 'Sin categoría';
}

// Renderizar la lista de productos en la página
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
            <td>${getCategoryNameById(product.id_categoria)}</td>
            <td>${product.descripcion}</td>
            <td>${product.precio}</td>
            <td>${product.existencias}</td>
            <td>${product.estado}</td>
            <td>
                <button type="button" class="btn btn-link btn-rounded btn-sm fw-bold" data-mdb-ripple-color="dark" onclick="openEditProductModal(${product.id}, '${product.estado}')">Editar Estado</button>
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

document.addEventListener('DOMContentLoaded', async () => {
    await fetchCategories();
    await fetchProducts();
});

// Función para abrir el modal y cargar el estado actual del producto
function openEditProductModal(productId, currentState) {
    document.querySelector('#editProductModal').style.display = 'block';
    document.querySelector('#productId').value = productId;  // Guardar el ID del producto en un campo oculto
    document.querySelector('#newProductStatus').value = currentState;  // Pre-seleccionar el estado actual
}

// Función para cerrar el modal
function closeEditProductModal() {
    document.querySelector('#editProductModal').style.display = 'none';
}

// Función para actualizar el estado del producto
async function updateProductStatus() {
    const productId = document.querySelector('#productId').value;
    const newStatus = document.querySelector('#newProductStatus').value;

    // Encuentra el producto actual en el array `products` para obtener los valores existentes
    const product = products.find(prod => prod.id === parseInt(productId));

    if (!product) {
        alert("Producto no encontrado.");
        return;
    }

    // Crea el objeto con todos los datos necesarios para la actualización
    const updatedProductData = {
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio,
        imagen: product.imagen,
        existencias: product.existencias,
        ultima_actualizacion: product.ultima_actualizacion,
        id_categoria: product.id_categoria,
        estado: newStatus  // Incluye el nuevo estado
    };

    try {
        const response = await fetch(`http://127.0.0.1:8000/products/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedProductData)  // Enviar todos los campos
        });

        if (response.ok) {
            closeEditProductModal();
            fetchProducts(); // Recargar los productos
            alert('Estado del producto actualizado correctamente');
        } else {
            const errorData = await response.json();
            console.error("Error al actualizar el estado del producto:", errorData);
            alert(`Hubo un error al actualizar el estado: ${errorData.detail}`);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert('Error de conexión');
    }
}
