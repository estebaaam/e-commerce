let users = []; // Lista de usuarios sin paginación

// Función para obtener los usuarios desde la API
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

// Función para renderizar los usuarios en la tabla
function renderUsers() {
    const userList = document.getElementById('customers_table').querySelector('tbody');
    userList.innerHTML = ''; // Limpiar la tabla antes de renderizar

    // Ya no necesitas la paginación, muestra todos los usuarios
    users.forEach(user => {
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
}

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

// Función para cerrar el modal de edición
function closeEditModal() {
    const modal = document.getElementById('editUserModal');
    modal.style.display = 'none';  // Ocultar el modal

    // Limpiar el formulario de edición (opcional)
    document.getElementById('editUserForm').reset();
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

// Eliminar usuario
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



// Función de búsqueda
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("keyup", searchTable);
});

// Función para buscar en la tabla
function searchTable() {
    const searchInput = document.getElementById("searchInput");
    const filter = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll("#userTableBody tr");
    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const match = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(filter));
        row.style.display = match ? "" : "none";
    });
}

// Funciones de exportación (PDF, Excel, JSON)
async function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let tableContent = document.getElementById("customers_table");
    let data = [];

    tableContent.querySelectorAll("tbody tr").forEach((row) => {
        let rowData = [];
        row.querySelectorAll("td").forEach((cell, index) => {
            // Omite la columna de imágenes (por ejemplo, si está en la segunda posición, índice 1)
            if (index !== 7) {
                rowData.push(cell.innerText);
            }
        });
        data.push(rowData);
    });

    doc.text("Gestor de Usuario", 10, 10); // Título en el PDF
    doc.autoTable({
        head: [["Id", "Nombre de Usuario", "Email", "Contraseña", "Telefono", "Dirección", "Rol"]],
        body: data
    });

    doc.save("usuario.pdf");
}

// Exportar a JSON
function exportToJSON() {
    const rows = Array.from(document.querySelectorAll("#customers_table tr"));
    const data = rows.map(row => {
        const cells = row.querySelectorAll("td");

        if(cells.length >= 6){
            return {
                id: cells[0].textContent.trim(),
                nombre_usuario: cells[1].textContent.trim(),
                email: cells[2].textContent.trim(),
                contraseña: cells[3].textContent.trim(),
                telefono: cells[4].textContent.trim(),
                direccion: cells[5].textContent.trim(),
                rol: cells[6].textContent.trim()
            };
        } 
        
    });
    if (data.length > 0) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "usuario.json";
        link.click();
    } else {
        alert("No hay datos disponibles para exportar.");
    }

}

// Exportar a Excel
function exportToExcel() {
    const table = document.getElementById("customers_table");
    const clonedTable = table.cloneNode(true);

    // Remueve la columna de "Acciones" (última columna) y "Imágenes" (segunda columna en este caso)
    clonedTable.querySelectorAll("tr").forEach(row => {
        row.removeChild(row.lastElementChild); // Elimina la columna de "Acciones"
    });

    const workbook = XLSX.utils.table_to_book(clonedTable, { sheet: "Sheet1" });
    XLSX.writeFile(workbook, "usuario.xlsx");
}


