let gameScene = new Phaser.Scene('Game');

// Inicializa los parámetros del jugador
gameScene.init = function () {
    this.playerSpeed = 300;
    this.playerJump = -600;
    this.playerLives = 3; // Vidas del jugador
    this.scoreText = null; // Texto para mostrar el puntaje
    this.isGameOver = false; // Estado del juego
    this.gameOverText = null; // Texto de juego terminado
    this.score = 0; // Inicializa el puntaje en 0
  
 
   
    
};

// Carga los recursos
gameScene.preload = function () {
    this.loadAssets();
    this.load.json('coordinates', './coordinates/coordinates.json');
    
};

// Función refactorizada para cargar recursos
gameScene.loadAssets = function () {
    this.load.image('background', './img/Fondo.png');
    this.load.image('mid_layer', './img/capa_medio.png');
    this.load.image('player', './img/personaje_animate.png');
    this.load.image('floor_2', './img/floor2.png');
    this.load.image('floor_1', './img/floor1.png');
    this.load.image('floor_3', './img/floor3.png');
    this.load.image('plataform', './img/Plataforma.png');
    this.load.image('plataform2', './img/plataform2.png');
    this.load.image('planta', './img/planta.png');
    this.load.image('lobo', './img/villano_lobo.png');
    this.load.image('hada', './img/hada.png');
    this.load.image('libro', './img/libro.png');
    this.load.image('gato_negro', './img/gato_negro.png');
    this.load.image('gato_blanco', './img/gato_blanco.png');
    this.load.image('varita', './img/varita.png');
    this.load.image('cura', './img/cura.png');
    this.load.image('flor', './img/flor.png');
};

// Crea los elementos del juego
gameScene.create = function () {
    // Fondo y capa intermedia
    gameScene.isPaused = false;
    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.add.image(0, 0, 'mid_layer').setOrigin(0, 0);

    // Cargar coordenadas desde el archivo JSON
    const coordinates = this.cache.json.get('coordinates');
    console.log('Datos del JSON cargados:', coordinates);

    this.floorCoordinates = coordinates.floors;
    this.villainCoordinates = coordinates.villains;
    this.platformCoordinates = coordinates.platforms;

    // Crear el jugador
    const firstFloor = this.floorCoordinates[0];
    const playerStartingX = firstFloor.x;
    const playerStartingY = firstFloor.y - 1080;
    this.player = this.physics.add.sprite(playerStartingX, playerStartingY, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(600);
    this.player.body.setAllowGravity(true);
    this.player.body.setBounce(0);
    this.player.body.setOffset(0, -15);
    this.playerLives = 3; // Inicializar vidas
    this.updateLivesText(); // Actualiza el texto de vidas en pantalla

    // Configuración de los límites del mundo
    this.physics.world.setBounds(0, 0, 5760, this.background.height);
    this.physics.world.setBoundsCollision(true, true, true, false);

    // Crear pisos, plataformas, villanos y regalos
    this.createFloors(); // Crear los pisos
    this.createPlatforms(); // Crear las plataformas
    this.createVillains(); // Crear los villanos
    this.createGifts();
    this.createPauseFunctionality();
    this.createJoystick();

    // Colisiones
    this.physics.add.collider(this.player, this.floors);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.villains, this.floors);
    this.physics.add.collider(this.villains, this.platforms);
    this.physics.add.collider(this.villains, this.player, this.handleVillainCollision, null, this);

    // Configuración de la cámara
    this.cameras.main.setBounds(0, 0, 5760, this.background.height);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(config.height / this.background.height);

    // Configuración de la entrada
    this.cursors = this.input.keyboard.createCursorKeys();
};

// Creación de los pisos
gameScene.createFloors = function () {
    this.floors = this.physics.add.staticGroup();
    this.floorCoordinates.forEach(({ x, y, type }) => {
        this.floors.create(x, y, type).refreshBody();
    });
};

gameScene.updateLivesText = function () {
    const livesTextElement = document.getElementById("lives");
    if (livesTextElement) {
        livesTextElement.innerText = `Vidas: ${this.playerLives}`;
    } else {
        console.error("Elemento de vidas no encontrado en el DOM");
    }
};

// Creación de las plataformas
gameScene.createPlatforms = function () {
    this.platforms = this.physics.add.staticGroup();
    this.platformCoordinates.forEach(({ x, y, type }) => {
        this.platforms.create(x, y, type).refreshBody();
    });
};


// Creación de los villanos
gameScene.createVillains = function () {
    this.villains = this.physics.add.group();
    this.villainCoordinates.forEach(({ x, y, type, isFlying }) => {
        let villain = this.villains.create(x, y, type);
        villain.setCollideWorldBounds(true);
        villain.body.setBounce(1);

        // Ajuste de gravedad para el hada
        if (type === 'hada') {
            villain.body.setAllowGravity(false);
            villain.body.setVelocityY(Phaser.Math.Between(-20, 20)); // Movimiento aleatorio en Y
        } else {
            villain.body.setAllowGravity(true); 
        }

        // Ajustes de hitbox para el lobo y otros villanos
        if (type === 'lobo') {
            villain.body.setSize(villain.width * 0.8, villain.height * 0.5);
            villain.body.setOffset(villain.width * 0.1, villain.height * 0.2); 
        } else {
            villain.body.setSize(villain.width * 0.8, villain.height * 0.5); 
            villain.body.setOffset(villain.width * 0.1, villain.height * 0.5);
        }

        // Ajuste de offset para que caigan sobre el piso
        villain.body.setOffset(0, -1);

        // Movimiento horizontal para villanos que no son el hada
        if (!isFlying) {
            villain.body.setVelocityX(Phaser.Math.Between(50, 100)); // Variar la velocidad horizontal
        }
    });
};

gameScene.handleJoystickMovement = function () {
    // Manejo de movimiento
    this.joystick.on('move', (evt, data) => {
      if (data.direction) {
        const angle = data.angle.degree;
        const power = data.distance;
  
        // Calcular la velocidad en X
        const vx = Math.cos(Phaser.Math.DegToRad(angle)) * power * 10;
  
        // Aplicar la velocidad al jugador en X
        this.player.setVelocityX(vx);
        this.player.flipX = vx < 0;
  
        // Saltar si el joystick se mueve hacia arriba y el jugador está en el suelo
        if (data.direction.angle === 'up' && this.player.body.onFloor()) {
          this.player.setVelocityY(this.playerJump);
        }
      } else {
        this.player.setVelocityX(0); // Detener al jugador si no hay movimiento en el joystick
      }
    });
  
    // Manejar el fin del movimiento del joystick
    this.joystick.on('end', () => {
      this.player.setVelocityX(0);
    });
  };
  
  


// Creación de regalos
gameScene.createGifts = function () {
    // Obtén las posiciones de los gifts desde el JSON
    const giftPositions = this.cache.json.get('coordinates').gifts;

    // Crea el grupo para los gifts
    this.giftsGroup = this.physics.add.group();

    giftPositions.forEach(pos => {
        const gift = this.giftsGroup.create(pos.x, pos.y, pos.type);

        gift.setCollideWorldBounds(true); // Evita que los gifts salgan del mundo
        gift.body.setAllowGravity(false); // Desactiva la gravedad en los gifts
        gift.body.setBounce(0.2); // Añade un poco de rebote

        // Asigna el tipo al sprite
        gift.type = pos.type;

        // Configura colisiones con el piso y plataformas
        this.physics.add.collider(gift, this.floors);
        this.physics.add.collider(gift, this.platforms);
    });

    // Configura la detección de colisiones con el jugador
    this.physics.add.overlap(this.player, this.giftsGroup, this.collectItem, null, this);

    console.log('Gifts creados desde JSON: ', this.giftsGroup.children.entries);
};


gameScene.collectItem = function (player, gift) {
    console.log("Item detectado:", gift.type);

    // Evitar que los gatos sean recolectados
    if (gift.type === 'gato_negro' || gift.type === 'gato_blanco') {
        console.log("Los gatos no pueden ser recolectados.");
        return; // Salir del método sin hacer nada
    }

    if (gift.type === 'cura') {
        if (this.playerLives < 3) {
            this.playerLives++;
            console.log(`Vida incrementada: ${this.playerLives}`);
            this.updateLivesText();
        } else {
            console.log("La vida ya está al máximo.");
        }
    }

    // Incrementar el score al recolectar el gift
    this.score++;
    console.log(`Puntaje: ${this.score}`);
    this.updateScoreDiv(); // Actualiza el contenido del div en el HTML

    // Eliminar el item recolectado
    gift.destroy();
};




gameScene.updateScoreDiv = function () {
    const scoreDiv = document.getElementById('score');
    if (scoreDiv) {
        scoreDiv.textContent = `Score: ${this.score}`;
    }
};

gameScene.resetScoreText = function () {
    const scoreTextElement = document.getElementById("score");
    if (scoreTextElement) {
        scoreTextElement.innerText = "Score: 0";
        this.score = 0; // Reinicia el puntaje en la lógica del juego
    } else {
        console.error("Elemento de puntaje no encontrado en el DOM");
    }
};


function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Configurar joystick y pantalla completa en móviles
gameScene.createJoystick = function () {
    if (!isMobile()) return; // Solo se crea el joystick en dispositivos móviles

    const joystickArea = document.getElementById('joystick-area');
    if (!joystickArea) {
        console.error("El contenedor del joystick no existe");
        return;
    }

    // Inicia el joystick con configuración dinámica
    this.joystick = nipplejs.create({
        zone: joystickArea,
        mode: 'dynamic',
        color: 'gray',
        size: 100,
        threshold: 0.5
    });

    this.handleJoystickMovement();
};

// Código para el control del joystick
gameScene.handleJoystickMovement = function () {
    if (!this.joystick) return;

    this.joystick.on('move', (evt, data) => {
        if (data.direction) {
            const angle = data.angle.degree;
            const power = data.distance;
            const vx = Math.cos(Phaser.Math.DegToRad(angle)) * power * 10;
            this.player.setVelocityX(vx);
            this.player.flipX = vx < 0;

            if (data.direction.angle === 'up' && this.player.body.onFloor()) {
                this.player.setVelocityY(this.playerJump);
            }
        } else {
            this.player.setVelocityX(0);
        }
    });

    // Detener movimiento al finalizar joystick
    this.joystick.on('end', () => {
        this.player.setVelocityX(0);
    });
};



gameScene.handleVillainCollision = function (player, villain) {
    if (this.playerLives > 0 && !this.isGameOver) {
        if (!player.invulnerable) {
            player.invulnerable = true;
            this.playerLives--;
            console.log(`Vidas: ${this.playerLives}`);
            
            // Actualizar el texto de vidas en pantalla
            this.updateLivesText();

            if (this.playerLives <= 0) {
                this.isGameOver = true;

                // Crear el texto de Game Over
                this.gameOverText = this.add.text(player.x, player.y, 'Game Over', {
                    fontSize: '64px',
                    fill: '#FF0000',
                    fontFamily: 'Arial',
                    align: 'center'
                }).setOrigin(0.5, 0.5);

                // Cambiar el fondo a rojo
               

                this.time.delayedCall(2000, this.restartGame, [], this);
            }

            // Ajustar la reacción del villano
            villain.setVelocityY(-100);
            this.time.delayedCall(1000, () => {
                player.invulnerable = false;
            });
        }
    }
};


gameScene.handlePlayerDeath = function () {
    if (this.playerLives > 0 && !this.isGameOver) {
        this.isGameOver = true;

        // Pausar la física y detener el seguimiento de la cámara
        this.physics.pause();
        this.cameras.main.stopFollow();

        // Mostrar el fondo negro
        const gameOverBackground = document.getElementById('game-over-background');
        if (gameOverBackground) {
            gameOverBackground.style.display = 'block';
        }

        // Mostrar el mensaje de "Game Over"
        const gameOverTextElement = document.getElementById('game-over-text');
        if (gameOverTextElement) {
            gameOverTextElement.textContent = 'Game Over!';
            gameOverTextElement.style.display = 'block';
        }

        // Reiniciar el juego después de 2 segundos
        this.time.delayedCall(2000, this.restartGame, [], this);
    }
};






gameScene.update = function () {
    if (this.isGameOver) {
        // Asegurarse de que el texto sigue en la posición del jugador
        if (this.gameOverText) {
            this.gameOverText.setPosition(this.player.x, this.player.y);
        }
        return; 
    }

    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-this.playerSpeed);
        this.player.flipX = true; 
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(this.playerSpeed);
        this.player.flipX = false; 
    } else {
        this.player.setVelocityX(0);
    }

    // Salto
    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(this.playerJump);
    }  if (this.player.y > this.physics.world.bounds.height) {
        this.handlePlayerDeath();
      }
    

};



// Función para crear la funcionalidad de pausa
gameScene.createPauseFunctionality = function () {
    const pauseButton = document.getElementById('pause-button');
    const pausePanel = document.getElementById('pause-panel');
    const resumeButton = document.getElementById('resume-button');
  
    // Evento para pausar el juego usando el botón
    pauseButton.addEventListener('click', () => this.togglePause());
  
    // Evento para reanudar el juego usando el botón
    resumeButton.addEventListener('click', () => this.togglePause());
  
    // Evento para el botón del menú principal
    document.getElementById("menu-button").addEventListener("click", () => {
      // Redirige al menú principal
      window.location.href = "menu.php";
    });
  
    // Evento para la tecla ESC
    this.input.keyboard.on('keydown-ESC', () => this.togglePause());
  };
  
  // Función para alternar pausa/reanudación"
  gameScene.togglePause = function () {
    if (!this.isPaused) {
      this.isPaused = true;
      this.physics.pause(); // Pausa el juego
      this.cameras.main.setAlpha(0.5); // Efecto de transparencia
      document.getElementById('pause-panel').style.display = 'flex'; // Muestra el panel de pausa
    } else {
      this.isPaused = false;
      this.physics.resume(); // Reanuda el juego
      this.cameras.main.setAlpha(1); // Elimina el efecto de transparencia
      document.getElementById('pause-panel').style.display = 'none'; // Oculta el panel de pausa
    }
  };
  
  document.getElementById("menu-button").addEventListener("click", () => {
    // Redirige al menú principal
    window.location.href = "menu.html";
  });



  


// Reinicia el juego
gameScene.restartGame = function () {
    this.scene.restart();
    this.isGameOver = false;
    this.playerLives = 3; // Reinicia vidas a 3
    this.score = 0; // Reinicia el puntaje en la lógica del juego
    console.log(`Vidas reiniciadas: ${this.playerLives}`);
    console.log(`Puntaje reiniciado: ${this.score}`);
    this.giftsGroup.clear(true, true);
    this.updateLivesText();
    this.resetScoreText(); // Llama al método para actualizar el DOM
    this.createGifts();
    this.isPaused = false;
    this.physics.resume();
    this.cameras.main.setAlpha(1);


};





// Inicializa el juego
let config = {
    type: Phaser.CANVAS,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: gameScene,
    title: 'The flower witcher',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 }, // Gravedad ajustada
            debug: false
        }
    },
    
};


let game = new Phaser.Game(config);