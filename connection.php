<?php
$servername = "localhost"; // Cambia según tu configuración local
$username = "root";        // Usuario de tu base de datos
$password = "";            // Contraseña de tu base de datos
$dbname = "video_game"; // Nombre de tu base de datos

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
?>
