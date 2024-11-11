let currentPage = 1;
const usersPerPage = 10; // Cambia esto según el número de usuarios por página
let users = [];

async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:8000/users/');
        if (!response.ok) {
            throw new Error('Error al obtener los usuarios');
        }
        
        users = await response.json();
        renderUsers();
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

function renderUsers() {
    const userList = document.getElementById('customers_table').querySelector('tbody');
    userList.innerHTML = '';

    const start = (currentPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    const paginatedUsers = users.slice(start, end);

    paginatedUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nombre}</td>
            <td>${user.correo}</td>
            <td>${user.contraseña}</td>
            <td>${user.telefono}</td>
            <td>${user.direccion}</td>
            <td>${user.rol}</td>
            <td>
                <button type="button" class="btn btn-link btn-rounded btn-sm fw-bold" data-mdb-ripple-color="dark" onclick="openEditModal(${user.id})">Editar</button>
                <button type="button" class="btn btn-link btn-rounded btn-sm fw-bold btn-delete" data-mdb-ripple-color="dark" onclick="deleteEditModal(${user.id})">Eliminar</button>
            </td>
        `;
        userList.appendChild(row);
    });

    updatePaginationControls();
}

function updatePaginationControls() {
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage * usersPerPage >= users.length;
    pageInfo.textContent = `Página ${currentPage}`;
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderUsers();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage * usersPerPage < users.length) {
        currentPage++;
        renderUsers();
    }
});

// Llama a la función para cargar los usuarios cuando la página esté lista
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
});




// Función para abrir el modal de edición de usuario
function openEditModal(userId) {
    fetch(`http://localhost:8000/users/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del usuario');
            }
            return response.json();
        })
        .then(user => {
            // Cargar los datos en el formulario
            document.getElementById('userId').value = user.id;
            document.getElementById('editUserName').value = user.nombre;
            document.getElementById('editUserEmail').value = user.correo;
            document.getElementById('editUserPassword').value = user.contraseña;
            document.getElementById('editUserPhone').value = user.telefono || ''; // Asegurarse de que sea vacío si no existe
            document.getElementById('editUserAddress').value = user.direccion || ''; // Asegurarse de que sea vacío si no existe
            document.getElementById('editUserRole').value = user.rol;

            // Mostrar el modal
            const modal = document.getElementById('editUserModal');
            modal.style.display = 'flex'; 
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
        })
        .catch(error => console.error('Error:', error));
}

// Función para cerrar el modal
function closeEditModal() {
    const modal = document.getElementById('editUserModal');
    modal.style.display = 'none';  // Ocultar el modal

    // Limpiar el formulario de edición (opcional)
    document.getElementById('editUserForm').reset();
}

// Función para cerrar el modal de editar
function closeEditUserModal() {
    const modal = document.getElementById('editUserModal');
    modal.style.display = 'none';  // Ocultar el modal
}


// Función para guardar los cambios del usuario editado
function saveUserEdit() {
    const userId = document.getElementById('userId').value;

    const updatedUser = {
        nombre: document.getElementById('editUserName').value,
        correo: document.getElementById('editUserEmail').value,
        telefono: document.getElementById('editUserPhone').value,
        direccion: document.getElementById('editUserAddress').value,
        contraseña: document.getElementById('editUserPassword').value,  // Asegúrate de que la contraseña esté incluida
        rol: document.getElementById('editUserRole').value,
    };

    fetch(`http://localhost:8000/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la actualización del usuario');
        }
        return response.json();
    })
    .then(data => {
        console.log('Usuario actualizado:', data);
        closeEditModal();
        // Recargar o actualizar la lista de usuarios si es necesario
        fetchUsers(); // Recarga la lista de usuarios
    })
    .catch(error => console.error('Error:', error));
}



/*Eliminar USER*/ 

let userIdToDelete = null; // Variable para almacenar el ID del usuario a eliminar

// Función para mostrar el modal de confirmación de eliminación
function deleteEditModal(userId) {
    userIdToDelete = userId; // Guarda el ID del usuario que deseas eliminar
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
    userIdToDelete = null; // Resetea el ID
}

// Función para eliminar el usuario
function confirmDeleteUser() {
    if (!userIdToDelete) return;

    fetch(`http://localhost:8000/users/${userIdToDelete}`, {
        method: 'DELETE', // Método DELETE para eliminar
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el usuario');
        }
        return response.json();
    })
    .then(data => {
        console.log('Usuario eliminado:', data);
        fetchUsers(); // Recarga la lista de usuarios después de eliminar
        closeDeleteModal(); // Cierra el modal de confirmación
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema al eliminar el usuario');
    });
}


