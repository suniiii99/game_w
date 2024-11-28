<?php
// Incluye el archivo de conexión a la base de datos
include 'connection.php'; // Asegúrate de que 'conexion.php' contiene la lógica para conectar a tu base de datos

// Procesa el formulario cuando se envía
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Obtén los datos del formulario
    $nombre_usuario = $_POST['username'];
    $contrasena = $_POST['password']; // No encriptes la contraseña
    $correo = $_POST['email'];

    // Verifica si el nombre de usuario o el correo electrónico ya existen
    $sql_check = "SELECT * FROM usuarios WHERE nombre_usuario = ? OR correo = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param("ss", $nombre_usuario, $correo);
    $stmt_check->execute();
    $result = $stmt_check->get_result();

    // Si ya existe un registro con el mismo nombre de usuario o correo
    if ($result->num_rows > 0) {
        $mensaje = "Ya tienes una cuenta con este nombre de usuario o correo electrónico.";
    } else {
        // Inserta los datos en la base de datos
        $sql = "INSERT INTO usuarios (nombre_usuario, contrasena, correo) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $nombre_usuario, $contrasena, $correo);

        if ($stmt->execute()) {
            $mensaje = "Registro exitoso. Ahora puedes iniciar sesión.";
        } else {
            $mensaje = "Error al registrar: " . $stmt->error;
        }

        $stmt->close();
    }

    $stmt_check->close();
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
            <?php if (isset($mensaje)) : ?>
                <p class="message"><?php echo $mensaje; ?></p>
            <?php endif; ?>
            
            <form class="login-form" method="POST">
                <h2>Welcome to play</h2>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
                
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>

                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
                <a class="link" href="login.php">Login</a>
                <button type="submit">Register</button>
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


