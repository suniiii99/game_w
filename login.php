<?php
// Inicia la sesión
session_start();

// Incluye el archivo de conexión a la base de datos
include 'connection.php'; // Asegúrate de que contiene la conexión a tu base de datos

// Inicializa variables
$mensaje = "";
$mensaje_clase = "";

// Procesa el formulario cuando se envía
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Obtiene los datos del formulario
    $nombre_usuario = $_POST['username'];
    $contrasena = $_POST['password'];

    // Consulta para buscar al usuario
    $sql = "SELECT id, contrasena FROM usuarios WHERE nombre_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $nombre_usuario);
    $stmt->execute();
    $stmt->store_result();

    // Verifica si se encontró al usuario
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($user_id, $hash_contrasena);
        $stmt->fetch();

        // Verifica la contraseña
        if (password_verify($contrasena, $hash_contrasena)) {
            // Establece la sesión del usuario
            $_SESSION['user_id'] = $user_id; // Guarda el ID del usuario en la sesión
            $_SESSION['username'] = $nombre_usuario; // Guarda el nombre de usuario en la sesión

            // Redirige al menú principal
            header("Location: menu.php");
            exit();
        } else {
            $mensaje = "Credenciales incorrectas. Inténtalo de nuevo.";
            $mensaje_clase = "error"; // Clase para mensajes de error
        }
    } else {
        $mensaje = "Credenciales incorrectas. Inténtalo de nuevo.";
        $mensaje_clase = "error"; // Clase para mensajes de error
    }

    $stmt->close();
}
?>




<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Flower Witch - Login</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Lilita+One&display=swap" rel="stylesheet">
</head>
<body>
    <header class="header_page">
        <div class="header-content">
                <img src="./img/logo_gatoB.png" alt="The Flower Witch Logo" class="header-logo">
                <div class="menu-hamburger" onclick="toggleMenu()">
                    <img src="./img/hamburgerMenu.png" alt="Menu Icon" />
                </div>
            <nav class="menu-icons">
                <a href="credits.html">
                    <img src="./img/Info.png" alt="Credits">
                    <span>Credits</span>
                </a>
                <a href="index.html">
                    <img src="./img/Home.png" alt="Home">
                    <span>Home</span>
                </a>
                <a href="login.php">
                    <img src="./img/Log in.png" alt="Login">
                    <span>Login</span>
                </a>
                <a href="menu.php">
                    <img src="./img/Play.png" alt="Play">
                    <span>Play</span>
                </a>
                <a href="ranking.php">
                    <img src="./img/Users.png" alt="Ranking">
                    <span>Ranking</span>
                </a>
            </nav>
        </div>
    </header>
    <section class="login-section">
        <div class="login-container">
            <!-- Muestra un mensaje si existe -->
            <?php if (!empty($mensaje)) : ?>
                <p class="message"><?php echo $mensaje; ?></p>
            <?php endif; ?>
            
            <form class="login-form" method="POST">
                <h2>Welcome to play</h2>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
                
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
                
                <button type="submit">Login</button>
                <a class="link" href="register.php">Register</a>

                <a href="logout.php">Logout</a>
            </form>
        </div>
    </section>
    <footer>
        <div class="footer-content">
            <a href="index.html">
                <img src="./img/logo_footer.png" alt="The Flower Witch Logo" class="footer-logo">
            </a>
            <div class="footer-icons">
                <a href="https://instagram.com" class="icon-link">
                    <img src="./img/Instagram.png" alt="Instagram">
                </a>
                <a href="https://facebook.com" class="icon-link">
                    <img src="./img/Facebook.png" alt="Facebook">
                </a>
                <a href="mailto:email@example.com" class="icon-link">
                    <img src="./img/Mail.png" alt="Email">
                </a>
                <a href="tel:+506 84526060" class="icon-link">
                    <img src="./img/Phone.png" alt="Phone">
                </a>
            </div>
        </div>
    </footer>
    <script src="./js/hamburger.js"></script>
</body>
</html>
