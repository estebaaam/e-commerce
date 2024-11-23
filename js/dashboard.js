// Función para obtener y mostrar los datos en las tarjetas
async function updateDashboard() {
    try {
        // Card: Ventas (Total de pedidos)
        const ordersResponse = await fetch('http://127.0.0.1:8000/orders/');
        if (!ordersResponse.ok) throw new Error('Error al obtener los pedidos');
        const ordersData = await ordersResponse.json();

        // Sumar los ingresos totales de la columna 'precio_total'
        const totalIngresos = ordersData.reduce((sum, order) => sum + order.precio_total, 0);
        document.getElementById('ingresos-total').textContent = `$${totalIngresos.toFixed(2)}`;
        document.getElementById('ventas-count').textContent = ordersData.length;

        // Card: Usuarios Registrados
        const usersResponse = await fetch('http://127.0.0.1:8000/users/');
        if (!usersResponse.ok) throw new Error('Error al obtener los usuarios');
        const usersData = await usersResponse.json();

        // Mostrar el total de usuarios
        document.getElementById('usuarios-count').textContent = usersData.length;

        // Card: Productos Activos
        const productsResponse = await fetch('http://127.0.0.1:8000/products/');
        if (!productsResponse.ok) throw new Error('Error al obtener los productos');
        const productsData = await productsResponse.json();

        // Contar los productos con estado 'activado'
        const activeProducts = productsData.filter(product => product.estado === 'activado').length;
        document.getElementById('productos-activos').textContent = activeProducts;

    } catch (error) {
        console.error('Error al actualizar el dashboard:', error);
    }
}

// Ejecutar la función al cargar la página
document.addEventListener('DOMContentLoaded', updateDashboard);



/* Gráfico para el gestor de Stock */
const ctx = document.getElementById('myChartProductoStock');

const myChartProductoStock = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [], // Inicializamos los labels vacíos
    datasets: [
      {
        label: 'Stock de Productos', // Etiqueta del dataset
        data: [], // Inicializamos el dataset vacío
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#9966FF', '#FF9F40',
          '#C9CBCF', '#008080', '#DC143C', '#40E0D0', '#800080', '#4BC0C0',
        ],
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
//FIN

/* Función para obtener los productos desde la API */
async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:8000/products/');
    if (!response.ok) {
      throw new Error('Error al obtener los productos');
    }

    const products = await response.json();
    Mostrar(products); 
  } catch (error) {
    console.error('Error al obtener productos:', error);
  }
}

/* Función para actualizar la gráfica con los datos obtenidos */
const Mostrar = (articulos) => {
  articulos.forEach((element) => {
    myChartProductoStock.data.labels.push(element.nombre); 
    myChartProductoStock.data.datasets[0].data.push(element.existencias); 
  });

  myChartProductoStock.update();
};

fetchProducts();
//FIN


/* Función para obtener los pedidos desde la API y mostrar en la gráfica por mes vendio*/
document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "http://127.0.0.1:8000/orders/";

  async function fetchOrders() {
      try {
          const response = await fetch(apiUrl);
          if (!response.ok) throw new Error("Error al obtener los pedidos.");
          return await response.json();
      } catch (error) {
          console.error("Error al obtener los datos de la API:", error);
          return [];
      }
  }

  function processOrders(orders) {
      // Inicializar objeto para agrupar por mes
      const salesByMonth = {};

      orders.forEach(order => {
          const date = new Date(order.fecha_pedido);
          const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`; // Formato YYYY-MM
          const total = order.precio_total;

          // Sumar al mes correspondiente
          salesByMonth[monthYear] = (salesByMonth[monthYear] || 0) + total;
      });

      // Ordenar por mes
      const sortedMonths = Object.keys(salesByMonth).sort();
      const salesData = sortedMonths.map(month => ({
          month,
          total: salesByMonth[month]
      }));

      return salesData;
  }

  async function renderSalesChart() {
      const orders = await fetchOrders();
      const salesData = processOrders(orders);

      // Extraer etiquetas (meses) y datos (totales)
      const labels = salesData.map(data => data.month);
      const totals = salesData.map(data => data.total);

      // Configurar y crear la gráfica
      const ctx = document.getElementById("ventasPorMesChart").getContext("2d");
      new Chart(ctx, {
          type: "bar",
          data: {
              labels: labels,
              datasets: [
                  {
                      label: "Ventas Totales ($)",
                      data: totals,
                      backgroundColor: [
                        '#C9CBCF', '#008080', '#DC143C', '#40E0D0', '#800080', '#4BC0C0',
                        '#FF6384', '#36A2EB', '#FFCE56', '#9966FF', '#FF9F40',
                      ],
                      borderColor: "rgba(54, 162, 235, 1)",
                      borderWidth: 1
                  }
              ]
          },
          options: {
              responsive: true,
              plugins: {
                  legend: { display: true, position: "top" }
              },
              scales: {
                  x: { beginAtZero: true },
                  y: { beginAtZero: true }
              }
          }
      });
  }

  renderSalesChart();
});
/*FIN*/ 



/* INICIO*/
/* Función para obtener los productos y las categorías desde la API */
async function fetchCategoriesAndProducts() {
  try {
    const categoriesResponse = await fetch("http://localhost:8000/categories/");
    if (!categoriesResponse.ok) throw new Error("Error al obtener las categorías");
    const categories = await categoriesResponse.json();

    const productsResponse = await fetch("http://localhost:8000/products/");
    if (!productsResponse.ok) throw new Error("Error al obtener los productos");
    const products = await productsResponse.json();

    renderCategoryDistributionChart(categories, products);
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}

/* Función para procesar los datos y crear la gráfica */
function renderCategoryDistributionChart(categories, products) {
  // Contar productos por categoría
  const categoryCounts = categories.map((category) => {
    const count = products.filter((product) => product.id_categoria === category.id).length;
    return { nombre: category.nombre, count };
  });

  // Extraer etiquetas (categorías) y datos (conteo)
  const labels = categoryCounts.map((cat) => cat.nombre);
  const data = categoryCounts.map((cat) => cat.count);

  // Crear gráfica
  const ctx = document.getElementById("categoryDistributionChart").getContext("2d");
  new Chart(ctx, {
    type: "pie", // Cambiar a "bar" para barras horizontales
    data: {
      labels: labels,
      datasets: [
        {
          label: "Productos por Categoría",
          data: data,
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#9966FF", "#FF9F40", "#C9CBCF",
            "#008080", "#DC143C", "#40E0D0", "#800080", "#4BC0C0",
          ],
          borderColor: "black",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: "top" },
      },
    },
  });
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", fetchCategoriesAndProducts);


/* Función para obtener y mostrar los productos con bajo stock */
async function fetchLowStockProducts() {
  try {
      const response = await fetch('http://localhost:8000/products/');
      if (!response.ok) {
          throw new Error('Error al obtener los productos');
      }

      const products = await response.json();

      // Filtrar productos con existencias menores a 5
      const lowStockProducts = products.filter(product => product.existencias < 5);

      // Renderizar los productos con bajo stock
      renderLowStockProducts(lowStockProducts);
  } catch (error) {
      console.error('Error al obtener los datos:', error);
  }
}

/* Función para mostrar los productos en una tabla */
function renderLowStockProducts(products) {
  const lowStockTable = document.getElementById('lowStockTable');
  lowStockTable.innerHTML = ''; // Limpiar la tabla antes de renderizar

  if (products.length === 0) {
      lowStockTable.innerHTML = '<tr><td colspan="4">No hay productos con bajo stock.</td></tr>';
      return;
  }

  products.forEach(product => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${product.id}</td>
          <td><img src="${product.imagen}" alt="${product.nombre}" style="width: 50px;"></td>
          <td>${product.nombre}</td>
          <td>${product.existencias}</td>
      `;
      lowStockTable.appendChild(row);
  });
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', fetchLowStockProducts);




/* Función para obtener y procesar el estado de los pedidos */
async function fetchOrderStatusData() {
  try {
      const response = await fetch('http://127.0.0.1:8000/orders/');
      if (!response.ok) {
          throw new Error('Error al obtener los pedidos');
      }

      const orders = await response.json();

      // Agrupar los pedidos por estado
      const statusCounts = orders.reduce((acc, order) => {
          acc[order.estado] = (acc[order.estado] || 0) + 1;
          return acc;
      }, {});

      // Extraer etiquetas y datos
      const labels = Object.keys(statusCounts);
      const data = Object.values(statusCounts);

      // Renderizar la gráfica
      renderOrderStatusChart(labels, data);
  } catch (error) {
      console.error('Error al obtener los datos de los pedidos:', error);
  }
}

/* Función para renderizar la gráfica de estados de pedidos */
function renderOrderStatusChart(labels, data) {
  const ctx = document.getElementById('orderStatusChart').getContext('2d');

  new Chart(ctx, {
      type: 'doughnut', // Gráfica tipo donut
      data: {
          labels: labels, // Estados de los pedidos
          datasets: [
              {
                  label: 'Estado de los Pedidos',
                  data: data, // Cantidad de pedidos por estado
                  backgroundColor: [
                      '#FF6384', '#36A2EB', '#FFCE56', '#9966FF', '#4BC0C0', '#FF9F40',
                  ],
                  borderColor: '#FFFFFF',
                  borderWidth: 2,
              },
          ],
      },
      options: {
          responsive: true,
          plugins: {
              legend: {
                  display: true,
                  position: 'top',
              },
              tooltip: {
                  callbacks: {
                      label: function (tooltipItem) {
                          const total = data.reduce((sum, value) => sum + value, 0);
                          const percentage = ((tooltipItem.raw / total) * 100).toFixed(2);
                          return `${tooltipItem.label}: ${tooltipItem.raw} (${percentage}%)`;
                      },
                  },
              },
          },
      },
  });
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', fetchOrderStatusData);




/* Función para obtener y mostrar los últimos pedidos */
async function fetchAndDisplayRecentOrders() {
  try {
      const response = await fetch('http://127.0.0.1:8000/orders/');
      if (!response.ok) {
          throw new Error('Error al obtener los pedidos');
      }

      const orders = await response.json();

      // Ordenar los pedidos por fecha en orden descendente
      const sortedOrders = orders.sort((a, b) => new Date(b.fecha_pedido) - new Date(a.fecha_pedido));

      // Seleccionar los últimos 10 pedidos
      const recentOrders = sortedOrders.slice(0, 10);

      // Renderizar los pedidos en la tabla
      renderRecentOrdersTable(recentOrders);
  } catch (error) {
      console.error('Error al obtener los pedidos:', error);
  }
}

/* Función para renderizar la tabla de últimos pedidos */
function renderRecentOrdersTable(orders) {
  const tableBody = document.getElementById('recentOrdersTableBody');

  // Limpiar el contenido previo
  tableBody.innerHTML = '';

  // Agregar cada pedido a la tabla
  orders.forEach(order => {
      const row = document.createElement('tr');

      row.innerHTML = `
          <td>${order.nombre_envio}</td>
          <td>${new Date(order.fecha_pedido).toLocaleDateString()}</td>
          <td>$${order.precio_total.toFixed(2)}</td>
          <td>${order.estado}</td>
      `;

      tableBody.appendChild(row);
  });
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', fetchAndDisplayRecentOrders);
