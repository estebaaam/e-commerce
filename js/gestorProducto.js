let currentPage = 1;
const productsPerPage = 8;
let products = [];
let categories = [];

async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:8000/categories/');
        if (!response.ok) {
            throw new Error('Error al obtener las categorías');
        }
        categories = await response.json();
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
    return category ? category.nombre : 'Sin categoría';
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
            <td>${getCategoryNameById(product.id_categoria)}</td>
            <td>${product.descripcion}</td>
            <td>${product.precio}</td>
            <td>${product.existencias}</td>
            <td>
                <button type="button" class="btn btn-link btn-rounded btn-sm fw-bold" data-mdb-ripple-color="dark" onclick="openEditModal(${product.id})">Editar</button>
                <button type="button" class="btn btn-link btn-rounded btn-sm fw-bold" data-mdb-ripple-color="dark" onclick="deleteEditModal(${product.id})">Eliminar</button>
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

async function loadCategories() {
    const categorySelect = document.getElementById('editProductCategory');
    categorySelect.innerHTML = '<option value="">Seleccione una Categoría</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.nombre;
        categorySelect.appendChild(option);
    });
}

async function openEditModal(productId) {
    await loadCategories();

    try {
        const response = await fetch(`http://localhost:8000/products/${productId}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos del producto');
        }

        const product = await response.json();

        document.getElementById('productId').value = product.id;
        document.getElementById('editProductName').value = product.nombre;
        document.getElementById('editProductDescription').value = product.descripcion;
        document.getElementById('editProductPrice').value = product.precio;
        document.getElementById('editProductStock').value = product.existencias;
        document.getElementById('editProductImage').value = product.imagen;
        document.getElementById('editProductCategory').value = product.id_categoria;
        document.getElementById('editProductEstado').value = product.estado;

        const modal = document.getElementById('editProductModal');
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
    } catch (error) {
        console.error('Error:', error);
    }
}

function closeEditModal() {
    document.getElementById('editProductModal').style.display = 'none';
}

function saveProductEdit() {
    const productId = document.getElementById('productId').value;
    const updatedProduct = {
        nombre: document.getElementById('editProductName').value,
        descripcion: document.getElementById('editProductDescription').value,
        precio: parseFloat(document.getElementById('editProductPrice').value),
        existencias: parseInt(document.getElementById('editProductStock').value, 10),
        imagen: document.getElementById('editProductImage').value || "default_image.jpg",
        id_categoria: parseInt(document.getElementById('editProductCategory').value),
        ultima_actualizacion: new Date().toISOString().split('T')[0],
        estado: document.getElementById('editProductEstado').value
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
        fetchProducts();
    })
    .catch(error => console.error('Error:', error));
}


/*Eliminar PRODUCTO*/ 

let productIdToDelete = null; // Variable para almacenar el ID del usuario a eliminar

// Función para mostrar el modal de confirmación de eliminación
function deleteEditModal(productId) {
    productIdToDelete = productId; // Guarda el ID del producto que deseas eliminar
    const deleteModal = document.getElementById('deleteModal');
    const backdrop = document.getElementById('deleteModalBackdrop');

    deleteModal.classList.add('show'); // Muestra el modal
    backdrop.classList.add('show'); // Muestra el fondo oscuro
}

// Función para cerrar el modal de confirmación de eliminación
function closeDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    const backdrop = document.getElementById('deleteModalBackdrop');

    deleteModal.classList.remove('show'); // Oculta el modal
    backdrop.classList.remove('show'); // Oculta el fondo oscuro
    productIdToDelete = null; // Resetea el ID
}

// Función para eliminar el producto
function confirmDeleteProduct() {
    if (!productIdToDelete) return;

    fetch(`http://localhost:8000/products/${productIdToDelete}`, {
        method: 'DELETE', // Método DELETE para eliminar
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el producto');
        }
        return response.json();
    })
    .then(data => {
        console.log('producto eliminado:', data);
        fetchProducts() ; // Recarga la lista de usuarios después de eliminar
        closeDeleteModal(); // Cierra el modal de confirmación
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema al eliminar el producto');
    });
}
