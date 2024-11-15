document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/api/productos");  // Endpoint para obtener productos
    const productos = await response.json();
    const productoSelect = document.getElementById("producto");

    productos.forEach(producto => {
        const option = document.createElement("option");
        option.value = producto.id;
        option.textContent = producto.nombre;
        productoSelect.appendChild(option);
    });
});
