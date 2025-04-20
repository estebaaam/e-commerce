-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-04-2025 a las 19:46:19
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `e_commerce`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `id_producto` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`id_producto`, `id_usuario`, `cantidad`) VALUES
(32, 3, 1),
(38, 3, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito_pedido`
--

CREATE TABLE `carrito_pedido` (
  `id_producto` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `carrito_pedido`
--

INSERT INTO `carrito_pedido` (`id_producto`, `id_usuario`, `id_pedido`, `cantidad`) VALUES
(1, 3, 34, 2),
(1, 3, 36, 1),
(1, 3, 40, 2),
(1, 3, 41, 1),
(1, 4, 37, 1),
(1, 20, 28, 1),
(1, 21, 38, 1),
(1, 21, 39, 10),
(1, 25, 53, 1),
(2, 3, 34, 5),
(2, 3, 46, 1),
(2, 20, 30, 5),
(2, 20, 31, 1),
(3, 3, 34, 1),
(3, 20, 28, 4),
(3, 24, 43, 2),
(4, 3, 41, 1),
(4, 3, 48, 1),
(4, 25, 51, 1),
(5, 3, 35, 1),
(5, 3, 44, 1),
(5, 3, 47, 1),
(5, 19, 27, 2),
(5, 20, 29, 1),
(5, 20, 32, 5),
(5, 24, 43, 1),
(5, 25, 52, 1),
(6, 19, 27, 1),
(6, 20, 29, 8),
(6, 20, 32, 2),
(6, 20, 33, 20),
(7, 3, 42, 5),
(7, 20, 29, 1),
(7, 25, 54, 1),
(8, 3, 45, 1),
(8, 3, 49, 1),
(8, 19, 27, 1),
(8, 25, 50, 1),
(32, 3, 55, 2),
(33, 26, 56, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id`, `nombre`) VALUES
(1, 'portatiles'),
(2, 'celulares'),
(3, 'relojes'),
(4, 'auriculares'),
(5, 'monitores');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factura`
--

CREATE TABLE `factura` (
  `id` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `precio_total` double NOT NULL,
  `fecha_generacion` date NOT NULL,
  `cantidad_total` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `estado` varchar(30) NOT NULL,
  `nombre_envio` varchar(30) NOT NULL,
  `telefono_envio` varchar(30) NOT NULL,
  `correo_envio` varchar(30) NOT NULL,
  `direccion_envio` varchar(30) NOT NULL,
  `cantidad_total` int(11) NOT NULL,
  `precio_total` float NOT NULL,
  `fecha_pedido` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`id`, `id_usuario`, `estado`, `nombre_envio`, `telefono_envio`, `correo_envio`, `direccion_envio`, `cantidad_total`, `precio_total`, `fecha_pedido`) VALUES
(27, 19, 'entregado', 'prueba profe', '3147810003', 'prueba@gmail.com', 'barranquilla', 4, 1239.96, '2024-11-02 05:58:04'),
(28, 20, 'pendiente', 'yamal', '341232341', 'yamal@gmail.com', 'barranquilla', 5, 4299.95, '2024-11-04 10:46:02'),
(29, 20, 'pendiente', 'yamal', '341232341', 'yamal@gmail.com', 'barranquilla', 10, 1349.9, '2024-11-04 12:09:47'),
(30, 20, 'pendiente', 'yamal', '341232341', 'yamal@gmail.com', 'barranquilla', 5, 4999.95, '2024-11-04 15:45:21'),
(31, 20, 'pendiente', 'yamal', '341232341', 'yamal@gmail.com', 'barranquilla', 1, 999.99, '2024-11-04 15:49:03'),
(32, 20, 'pendiente', 'yamal', '341232341', 'yamal@gmail.com', 'barranquilla', 7, 909.93, '2024-11-04 16:02:28'),
(33, 20, 'pendiente', 'yamal', '341232341', 'yamal@gmail.com', 'barranquilla', 20, 2599.8, '2024-11-04 16:35:38'),
(34, 3, 'entregado', 'juan baleta', '3147810003', 'juan@gmail.com', 'calle 14 #29 156', 8, 7299.92, '2024-11-05 18:17:37'),
(35, 3, 'pendiente', 'juan baleta', '3147810003', 'juan@gmail.com', 'calle 14 #29 156', 1, 129.99, '2024-11-06 16:45:10'),
(36, 3, 'pendiente', 'juan baleta', '3147810003', 'juan@gmail.com', 'calle 14 #29 156', 1, 699.99, '2024-11-06 18:09:28'),
(37, 4, 'entregado', 'gerson', '23421244', 'gerson@gmail.com', 'malambo', 1, 699.99, '2024-11-07 17:45:48'),
(38, 21, 'pendiente', 'valentina baleta', '3231243', 'valentinaPerreo@gmail.com', 'barranquilla', 1, 699.99, '2024-11-10 15:35:30'),
(39, 21, 'pendiente', 'valentina baleta', '3231243', 'valentinaPerreo@gmail.com', 'barranquilla', 10, 6999.9, '2024-11-10 15:58:23'),
(40, 3, 'pendiente', 'juan baleta', '3147810003', 'juan@gmail.com', 'calle 14 #29 156', 2, 1399.98, '2024-11-12 07:59:40'),
(41, 3, 'pendiente', 'juan', '3147810003', 'juan@gmail.com', 'calle 14 #29 156', 2, 1399.99, '2024-11-17 15:47:30'),
(42, 3, 'pendiente', 'juan', '3147810003', 'juan@gmail.com', 'calle 14 #29 156', 5, 899.95, '2024-11-17 15:51:31'),
(43, 24, 'pendiente', 'tatakae', '3147810003', 'tatakae@gmail.com', 'barranquilla', 3, 1929.97, '2024-11-17 19:51:50'),
(44, 3, 'pendiente', 'juan', '3147810003', 'juan@gmail.com', 'calle 14 #29 156', 1, 129.99, '2024-11-23 10:33:41'),
(45, 3, 'pendiente', 'juan', '3147810003', 'juan@gmail.com', 'calle 14 #29 156', 1, 849.99, '2024-11-23 10:56:12'),
(46, 3, 'pendiente', 'juan', '3147810003', 'juan@gmail.com', 'calle 14 #29 156', 1, 999.99, '2024-11-23 16:25:46'),
(47, 3, 'pendiente', 'juan', '3147810003', 'juan@gmail.com', 'calle 14 #29 156', 1, 129.99, '2024-11-25 20:11:06'),
(48, 3, 'pendiente', 'juan', '3147810003', 'juan@gmail.com', 'calle 14 #29 156', 1, 1399.99, '2024-11-25 20:13:46'),
(49, 3, 'pendiente', 'juan', '3147810003', 'juan@gmail.com', 'calle 14 #29 156', 1, 849.99, '2024-11-25 20:15:06'),
(50, 25, 'pendiente', 'jesus', '32314', 'jesus@gmail.com', 'barranquilla', 1, 849.99, '2024-11-26 22:33:29'),
(51, 25, 'pendiente', 'jesus', '32314', 'jesus@gmail.com', 'barranquilla', 1, 1399.99, '2024-11-26 22:41:58'),
(52, 25, 'pendiente', 'jesus', '32314', 'jesus@gmail.com', 'barranquilla', 1, 129.99, '2024-11-26 22:43:48'),
(53, 25, 'pendiente', 'jesus', '32314', 'jesus@gmail.com', 'barranquilla', 1, 699.99, '2024-11-26 22:48:03'),
(54, 25, 'pendiente', 'jesus', '32314', 'jesus@gmail.com', 'barranquilla', 1, 179.99, '2024-11-26 22:49:36'),
(55, 3, 'pendiente', 'juan', '3147810003', 'juan@gmail.com', 'calle 14 #29 156', 2, 1078.44, '2024-11-27 08:02:36'),
(56, 26, 'pendiente', 'fulanito', '3147810003', 'fulanio@gmail.com', 'barranquilla', 2, 259.98, '2024-12-05 23:19:28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id` int(11) NOT NULL,
  `nombre` varchar(40) NOT NULL,
  `descripcion` varchar(300) NOT NULL,
  `precio` float NOT NULL,
  `imagen` varchar(200) NOT NULL,
  `existencias` int(11) NOT NULL,
  `ultima_actualizacion` date NOT NULL,
  `id_categoria` int(11) NOT NULL,
  `estado` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id`, `nombre`, `descripcion`, `precio`, `imagen`, `existencias`, `ultima_actualizacion`, `id_categoria`, `estado`) VALUES
(1, 'Google Pixel 8', 'El Google Pixel 8 ofrece una experiencia pura de Android con una cámara avanzada, pantalla OLED de 6.2 pulgadas y un rendimiento impresionante con el chip Tensor G3.', 699.99, 'https://raw.githubusercontent.com/estebaaam/e-commerce/refs/heads/main/images/products/producto-4.png', 1, '2024-11-26', 2, 'activado'),
(2, 'Apple iPhone 15', 'El iPhone 15 ofrece un nuevo diseño de titanio, pantalla Super Retina XDR de 6.1 pulgadas y el potente chip A16 Bionic para un rendimiento sin igual.', 999.99, 'https://raw.githubusercontent.com/estebaaam/e-commerce/refs/heads/main/images/products/producto-2.jpg', 23, '2024-11-23', 2, 'activado'),
(3, 'Google Pixel 8 Pro', 'El Pixel 8 Pro viene con una pantalla QHD+ de 6.7 pulgadas, triple cámara con tecnología avanzada de IA y el chip Tensor G3 para un rendimiento sobresaliente.', 899.99, 'https://raw.githubusercontent.com/estebaaam/e-commerce/refs/heads/main/images/products/producto-3.png', 7, '2024-11-17', 2, 'activado'),
(4, 'Lenovo ThinkPad X1 Carbon', 'El portátil Lenovo ThinkPad X1 Carbon es ultraligero, con una pantalla de 14 pulgadas, procesador Intel Core i7 de 11ª generación, y batería de larga duración.', 1399.99, 'https://raw.githubusercontent.com/estebaaam/e-commerce/refs/heads/main/images/products/producto-1.png', 7, '2024-11-26', 1, 'activado'),
(5, 'SKG Smart Watch 4', 'El SKG Smart Watch 4 es un reloj inteligente con pantalla AMOLED, monitoreo de actividad física, GPS integrado y resistencia al agua.', 129.99, 'https://raw.githubusercontent.com/estebaaam/e-commerce/refs/heads/main/images/products/producto-5.png', 5, '2024-11-26', 3, 'activado'),
(6, 'Audífonos Gamer HyperX Cloud II', 'El SKG Smart Watch 4 es un reloj inteligente con pantalla AMOLED, monitoreo de actividad física, GPS integrado y resistencia al agua.', 129.99, 'https://raw.githubusercontent.com/estebaaam/e-commerce/refs/heads/main/images/products/producto-6.png', 0, '2024-10-26', 4, 'activado'),
(7, 'Monitor Koorui 24\' LED', 'El monitor Koorui de 24 pulgadas tiene una resolución Full HD, panel LED, y frecuencia de actualización de 75Hz, ideal para gaming y trabajo diario.', 179.99, 'https://raw.githubusercontent.com/estebaaam/e-commerce/refs/heads/main/images/products/producto-7.png', 22, '2024-11-26', 5, 'activado'),
(8, 'HP Pavilion', 'El HP Pavilion 15 cuenta con una pantalla de 15.6 pulgadas, procesador Intel Core i5, 16GB de RAM y 512GB de SSD, perfecto para productividad y entretenimiento.', 849.99, 'https://raw.githubusercontent.com/estebaaam/e-commerce/refs/heads/main/images/products/producto-8.png', 27, '2024-11-26', 1, 'activado'),
(26, ' Galaxy S24', 'NUESTRO SMARTPHONE GALAXY MÁS POTENTE Aún: Salta sin problemas entre aplicaciones sin esperar y ver contenido en alta calidad con nuestro procesador más rápido hasta ahora, Snapdragon 8 Gen 3 para Galaxy¹', 199.88, 'https://m.media-amazon.com/images/I/71WcjsOVOmL._AC_SX522_.jpg', 75, '2024-11-26', 2, 'activado'),
(27, 'Galaxy A25', 'SU CONTENIDO, SUPERSUAVE: Ya sea viendo programas, jugando juegos o leyendo en línea, la pantalla ultra clara y superfluida¹ del Galaxy A25 5G da vida a tu contenido; además, Vision Booster te permite disfrutar de la brillante experiencia de pantalla de 800 nits', 120.99, 'https://m.media-amazon.com/images/I/61cwMOVn17L._AC_SX679_.jpg', 54, '2024-11-26', 2, 'activado'),
(28, 'Fitbit Versa 4 Fitness', 'Reloj inteligente con preparación diaria, GPS, frecuencia cardíaca 24/7, más de 40 modos de ejercicio, seguimiento del sueño y más, azul cascada/platino, talla única (bandas S y L incluidas)', 119.95, 'https://m.media-amazon.com/images/I/61OEuoqFqYL._AC_SX679_.jpg', 34, '2024-11-26', 3, 'activado'),
(29, 'Reloj Chofit', 'Correa de malla metálica de acero inoxidable compatible con Fitpolo IDW15/Quican IDW15 Correa de reloj para mujeres y hombres, correa ajustable de repuesto para reloj inteligente Fitpolo/Quican', 9.99, 'https://m.media-amazon.com/images/I/81PNCA8g7jL._AC_SY500_.jpg', 23, '2024-11-26', 3, 'activado'),
(30, 'Galaxy Watch FE', 'Reloj inteligente Bluetooth AI de 1.575 pulgadas con seguimiento de fitness, sensor BIA, zonas HR personalizadas, rastreador de frecuencia cardíaca, monitor de sueño, 2024', 129.71, 'https://m.media-amazon.com/images/I/71EHTkDQqfL._AC_SX522_.jpg', 23, '2024-11-26', 3, 'activado'),
(31, 'Acer Aspire 3', 'Laptop delgada, pantalla IPS Full HD de 15.6 pulgadas, procesador AMD Ryzen 3 7320U de cuatro núcleos, gráficos AMD Radeon, 8 GB LPDDR5, SSD NVMe de 128 GB, Wi-Fi 6,', 279.99, 'https://m.media-amazon.com/images/I/61gKkYQn6lL._AC_SX425_.jpg', 34, '2024-11-26', 1, 'activado'),
(32, 'Lenovo Portátil empresarial', 'Rendimiento robusto: maneja sin problemas aplicaciones exigentes con el procesador Intel Core i3-1215U, complementado con hasta 36 GB de memoria DDR4 para una multitarea fluida y una SSD PCIe de hasta 2 TB para un almacenamiento amplio y rápido.', 539.22, 'https://m.media-amazon.com/images/I/71KYOJ4oPUL._AC_SX425_.jpg', 32, '2024-11-27', 1, 'activado'),
(33, 'Skullcandy Crusher', 'Tecnología patentada de graves sensoriales Crusher: Skullcandy Crusher es el bajo sensorial original, inmersivo y ajustable. Tu música y películas cobrarán vida con una experiencia de sonido que realmente puedes sentir. Crusher Bass es diferente a todo lo que hayas escuchado antes.', 129.99, 'https://m.media-amazon.com/images/I/61SYYayECFL._AC_SX569_.jpg', 51, '2024-12-05', 4, 'activado'),
(34, 'JBL Vibe Beam', 'JBL Sonido de graves profundos: aprovecha al máximo tus mezclas con audio de alta calidad de auriculares seguros y confiables con controladores de 0.315 in con sonido JBL Deep Bass', 23.38, 'https://m.media-amazon.com/images/I/41+1Csr1pSL._AC_SL1000_.jpg', 36, '2024-11-26', 4, 'activado'),
(35, 'JBL Tune 510BT', 'Los audífonos inalámbricos Tune 510BT destacan por su reconocido sonido JBL Pure Bass, que se puede encontrar en los eventos más famosos de todo el mundo.', 29.99, 'https://m.media-amazon.com/images/I/61kFL7ywsZS._AC_SX425_.jpg', 46, '2024-11-27', 4, 'activado'),
(36, 'Apple AirPods Max', 'Impresionante calidad de audio: el controlador dinámico diseñado por Apple proporciona audio de alta fidelidad. El audio computacional combina un diseño acústico personalizado con el chip Apple H1 y el software para experiencias auditivas innovadoras.', 480.99, 'https://m.media-amazon.com/images/I/81thV7SoLZL._AC_SX425_.jpg', 33, '2024-11-27', 4, 'activado'),
(37, 'SAMSUNG Monitor', 'VISTA TODO EXPANSIVA: La pantalla sin bordes de 3 lados aporta una estética limpia y moderna a cualquier entorno de trabajo. En una configuración de varios monitores, las pantallas se alinean sin problemas para una vista prácticamente sin interrupciones. Relación de aspecto: 16:9. Tiempo de respuest', 99.99, 'https://m.media-amazon.com/images/I/61B8Lq5NXmL._AC_SX425_.jpg', 56, '2024-11-27', 5, 'activado'),
(38, 'Sceptre - Monitor curvo', 'Monitor curvo 1800R. La pantalla curva ofrece una experiencia visual revolucionaria con una curvatura de pantalla 1800R dando la sensación de que las imágenes te envuelven para una experiencia de inmersión profunda', 74.97, 'https://m.media-amazon.com/images/I/71P0M7tKjYL._AC_SX425_.jpg', 46, '2024-11-27', 5, 'activado'),
(39, 'SAMSUNG Monitor para juegos', 'REACCIÓN EN TIEMPO REAL: la frecuencia de actualización de 180 Hz elimina el retraso para un juego emocionante con acción ultrassuave; el tiempo de respuesta de 1 ms (MPRT) proporciona cuadros con un mínimo de desenfoque, lo que te permite saltar sobre los enemigos justo cuando los ve¹', 128.99, 'https://m.media-amazon.com/images/I/814EGetuvLS._AC_SX425_.jpg', 46, '2024-11-27', 5, 'activado'),
(40, 'Acer Nitro', 'Monitor VA de pantalla ancha Full HD (1920 x 1080 píxeles) de 23.8 pulgadas. Tecnología AMD FreeSync prémium.', 94.99, 'https://m.media-amazon.com/images/I/71yo3bmyBnL._AC_SX425_.jpg', 46, '2024-11-27', 5, 'activado'),
(41, 'mi producto', 'este es mi producto', 30, 'https://raw.githubusercontent.com/estebaaam/e-commerce/refs/heads/main/images/products/producto-4.png', 24, '2024-11-28', 1, 'activado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reporte`
--

CREATE TABLE `reporte` (
  `id` int(11) NOT NULL,
  `fecha_generacion` date NOT NULL,
  `id_factura` int(11) NOT NULL,
  `tipo` varchar(30) NOT NULL,
  `cantidad_total` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reseña`
--

CREATE TABLE `reseña` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `comentario` varchar(200) NOT NULL,
  `calificacion` tinyint(4) NOT NULL,
  `fecha_reseña` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `reseña`
--

INSERT INTO `reseña` (`id`, `id_usuario`, `id_producto`, `id_pedido`, `comentario`, `calificacion`, `fecha_reseña`) VALUES
(7, 4, 1, 37, 'joda tronco de faltones, me llego un peñon en vez del celular, esa es mala. a no disculpa vale mia, no era un peñon, me confundi, esta firme la tienda', 5, '2024-11-09 02:52:28'),
(8, 3, 3, 34, 'me gusto, pero lo malo es que se me desarmo al dia siguiente', 5, '2024-11-10 17:03:33'),
(10, 3, 2, 34, 'me encanto', 5, '2024-11-17 18:07:46'),
(13, 3, 1, 34, 'me gusto mucho', 4, '2025-03-26 02:43:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `correo` varchar(30) NOT NULL,
  `contraseña` varchar(100) NOT NULL,
  `telefono` varchar(30) NOT NULL,
  `direccion` varchar(30) NOT NULL,
  `rol` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `correo`, `contraseña`, `telefono`, `direccion`, `rol`) VALUES
(3, 'juan esteban', 'juan@gmail.com', '$2a$12$sV4By9nJ7j4VcRu3mI0/a.MZcpAcm62Wu3UHyD6Lfe/03Oly.6JpK', '3147810003', 'calle 14 #29 156', 'cliente'),
(4, 'gerson', 'gerson@gmail.com', '12345', '23421244', 'malambo', 'cliente'),
(6, 'giselle', 'giselle@gmail.com', '12345', '32524123', 'barranquilla', 'cliente'),
(7, 'rebeca ayala', 'rebeca@gmail.com', '12345', '31234234', 'barranquilla', 'cliente'),
(8, 'eren', 'eren@gmail.com', '123456789', '31234231', 'barranquilla', 'cliente'),
(9, 'yoice', 'yoice@gmail.com', '123', '33213224', 'barranquilla', 'cliente'),
(10, 'camilo', 'camilo@gmail.com', '123456789', '3147810003', 'barranquilla', 'cliente'),
(11, 'brayan fernandez', 'bryan@gmail.com', '321', '3147810003', 'barranquilla', 'cliente'),
(12, 'pepito', 'pepito@gmail.com', '123', '3147810003', 'barranquilla', 'cliente'),
(13, 'ray', 'ray@gmail.com', '321', '3147810003', 'barranquilla', 'cliente'),
(14, 'carlitos', 'carlitos@gmail.com', '123456789', '2412134322', 'barranquilla', 'cliente'),
(15, 'perenjito', 'perenjito@gmail.com', '4321', '22123124', 'barranquilla', 'cliente'),
(16, 'yamato', 'yamato@gmail.com', '123', '3147810003', 'barranquilla', 'cliente'),
(17, 'carrillo', 'carrillo@gmail.com', '123', '3147810003', 'barranquilla', 'cliente'),
(18, 'admin', 'admin@gmail.com', '$2a$12$sV4By9nJ7j4VcRu3mI0/a.MZcpAcm62Wu3UHyD6Lfe/03Oly.6JpK', '342344523', 'china', 'administrador'),
(19, 'prueba profe', 'prueba@gmail.com', '12345', '3147810003', 'barranquilla', 'cliente'),
(20, 'yamal', 'yamal@gmail.com', '12345', '341232341', 'barranquilla', 'cliente'),
(21, 'valentina baleta', 'valentinaPerreo@gmail.com', '12345', '3231243', 'barranquilla', 'cliente'),
(22, 'kratos', 'kratos@gmail.com', '$2b$12$eQol4o7zWJO2iX8Bs8AOPOT9VJJySLilCzTkeyltj7xv4qsq3Kif2', '212312412', 'olimpo', 'cliente'),
(23, 'la gerson', 'lagerson@gmail.com', '$2b$12$dQjL1QuG7PCdjGM1Dt1.xeMgnoDWEWG.b67PLhJfEqcIKeaJxWW.q', '3147810003', 'barranquilla', 'cliente'),
(24, 'tatakae', 'tatakae@gmail.com', '$2b$12$QZEnNBJw8X7Z6aS1mkuO3eIp/l7We6Z1xSteBu.fjwPctoNon.Cp2', '3147810003', 'barranquilla', 'cliente'),
(25, 'jesus', 'jesus@gmail.com', '$2b$12$IRzXnjHpz5TLVcC/9aowBe04x5Ic5CbPy7Qutb2/KK31q8DJ5gcF.', '32314', 'barranquilla', 'cliente'),
(26, 'fulanito prueba', 'fulanio@gmail.com', '$2b$12$2VbwqDr0EypBtNeaU8vF5u7D3ep1AJ4rpZ3bNXHIH4uI3uOnlSlOK', '3147810003', 'barranquilla', 'cliente');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id_producto`,`id_usuario`),
  ADD KEY `id_producto` (`id_producto`,`id_usuario`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `carrito_pedido`
--
ALTER TABLE `carrito_pedido`
  ADD PRIMARY KEY (`id_producto`,`id_usuario`,`id_pedido`),
  ADD KEY `id_pedido` (`id_pedido`),
  ADD KEY `id_producto` (`id_producto`,`id_usuario`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `factura`
--
ALTER TABLE `factura`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pedido` (`id_pedido`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Indices de la tabla `reporte`
--
ALTER TABLE `reporte`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_factura` (`id_factura`);

--
-- Indices de la tabla `reseña`
--
ALTER TABLE `reseña`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pedido` (`id_pedido`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `factura`
--
ALTER TABLE `factura`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `reporte`
--
ALTER TABLE `reporte`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reseña`
--
ALTER TABLE `reseña`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id`);

--
-- Filtros para la tabla `carrito_pedido`
--
ALTER TABLE `carrito_pedido`
  ADD CONSTRAINT `carrito_pedido_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id`);

--
-- Filtros para la tabla `factura`
--
ALTER TABLE `factura`
  ADD CONSTRAINT `factura_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id`);

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id`);

--
-- Filtros para la tabla `reporte`
--
ALTER TABLE `reporte`
  ADD CONSTRAINT `reporte_ibfk_1` FOREIGN KEY (`id_factura`) REFERENCES `factura` (`id`);

--
-- Filtros para la tabla `reseña`
--
ALTER TABLE `reseña`
  ADD CONSTRAINT `reseña_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `carrito_pedido` (`id_pedido`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reseña_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `carrito_pedido` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reseña_ibfk_3` FOREIGN KEY (`id_usuario`) REFERENCES `carrito_pedido` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
