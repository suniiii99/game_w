<?php
require 'connection.php'; // Incluye tu archivo de conexión

// Consulta para obtener los 10 mejores jugadores
$sql = "SELECT nombre_usuario, score FROM usuarios ORDER BY score DESC LIMIT 10";
$result = $conn->query($sql);

// Comienza el HTML
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Flower Witch - Ranking</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Lilita+One&display=swap" rel="stylesheet">
</head>
<body>
    <header>
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
    <section class="game-section">
        <section class="ranking-section">
            <div class="ranking-container">
                <h2 class="title-ranking">Ranking</h2>
                <table class="ranking-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>User</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        // Comprobamos si hay resultados
                        if ($result->num_rows > 0) {
                            $rank = 1;
                            while ($row = $result->fetch_assoc()) {
                                echo "<tr>";
                                echo "<td>" . $rank++ . "</td>";
                                echo "<td>" . htmlspecialchars($row['nombre_usuario']) . "</td>";
                                echo "<td>" . htmlspecialchars($row['score']) . "</td>";
                                echo "</tr>";
                            }
                        } else {
                            echo "<tr><td colspan='3'>No hay jugadores en el ranking.</td></tr>";
                        }
                        ?>
                    </tbody>
                </table>
            </div>
        </section>
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
</body>
</html>

<?php
// Cerrar la conexión
$conn->close();
?>
