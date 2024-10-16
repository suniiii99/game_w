let gameScene = new Phaser.Scene('Game');


// Inicializa los parámetros del jugador
gameScene.init = function () {
    this.playerSpeed = 500;//300
    this.playerJump = -650; // Altura de salto reducida

    // Coordenadas de los pisos
    this.floorCoordinates = [
        { x: 200, y: 650, type: 'floor_1' }, 
        { x: 950, y: 630, type: 'floor_3' }, 
        { x: 1400, y: 620, type: 'floor_3' },  
        { x: 2150, y: 640, type: 'floor_1' },
        { x: 3200, y: 600, type: 'floor_1' }, 
        { x: 4090, y: 620, type: 'floor_2' }, 
        { x: 5350, y: 610, type: 'floor_1' }
    ];
};



// Carga los recursos
gameScene.preload = function () {
    this.loadAssets();
};

// Función refactorizada para cargar recursos
gameScene.loadAssets = function () {
    this.load.image('background', '../img/Fondo.png');
    this.load.image('mid_layer', '../img/capa_medio.png');
    this.load.image('player', '../img/personaje_animate.png');
    this.load.image('floor_2', '../img/floor2.png');
    this.load.image
 }
// Carga los recursos
gameScene.preload = function () {
    this.loadAssets();
};

// Función refactorizada para cargar recursos
gameScene.loadAssets = function () {
    this.load.image('background', '../img/Fondo.png');
    this.load.image('mid_layer', '../img/capa_medio.png');
    this.load.image('player', '../img/personaje_animate.png');
    this.load.image('floor_2', '../img/floor2.png');
    this.load.image('floor_1', '../img/floor1.png');
    this.load.image('floor_3', '../img/floor3.png');
};

// Crea los elementos del juego
gameScene.create = function () {
    this.setupBackground();
    this.createFloors();
    this.createPlayer();  // Crea al jugador sobre el primer piso
    this.setupWorldBounds();
    this.setupCollisions();
    this.setupCamera();
    this.configureInput();
};

// Configuración del fondo
gameScene.setupBackground = function () {
    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.add.image(0, 0, 'mid_layer').setOrigin(0, 0);
};

// Creación del jugador
// Creación del jugador
gameScene.createPlayer = function () {
    const firstFloor = this.floorCoordinates[0]; 
    const playerStartingX = firstFloor.x; 
    const playerStartingY = firstFloor.y - 1000; // Ajuste para la posición inicial

    // Crear el jugador exactamente sobre el primer piso
    this.player = this.physics.add.sprite(playerStartingX, playerStartingY, 'player'); 
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(600); 
    this.player.body.setAllowGravity(true);
    this.player.body.setBounce(0);
    this.player.body.setOffset(0, -30); 
};


// Configuración de los límites del mundo
gameScene.setupWorldBounds = function () {
    this.physics.world.setBounds(0, 0, 5760, this.background.height);
};

// Creación de los pisos
gameScene.createFloors = function () {
    this.floors = this.physics.add.staticGroup();
    this.floorCoordinates.forEach(({ x, y, type }) => {
        this.floors.create(x, y, type).refreshBody();
    });
};

// Configuración de las colisiones
gameScene.setupCollisions = function () {
    this.physics.add.collider(this.player, this.floors);
};

// Configuración de la cámara
gameScene.setupCamera = function () {
    this.cameras.main.setBounds(0, 0, 5760, this.background.height);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(config.height / this.background.height);
};

// Configuración de la entrada
gameScene.configureInput = function () {
    this.cursors = this.input.keyboard.createCursorKeys();
};

// Manejo de la entrada
gameScene.handleInput = function () {
    if (!this.cursors) return;

    const velocityX = this.cursors.left.isDown ? -this.playerSpeed : this.cursors.right.isDown ? this.playerSpeed : 0;
    this.player.setVelocityX(velocityX);
    this.player.flipX = this.cursors.left.isDown;

    if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.player.body.blocked.down) {
        this.player.setVelocityY(this.playerJump);
    }

    this.keepPlayerInBounds();
};

// Verificación de límites del jugador
gameScene.keepPlayerInBounds = function () {
    if (this.player.x < 0) {
        this.player.setPosition(0, this.player.y);
    } else if (this.player.x > this.physics.world.bounds.width) {
        this.player.setPosition(this.physics.world.bounds.width, this.player.y);
    }
};

// Función de actualización
gameScene.update = function () {
    this.handleInput();
};

// Configuración del juego
let config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 997,
    scene: gameScene,
    title: 'The flower witcher',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 }, // Gravedad ajustada
            debug: false
        }
    }
};

// Crear el juego
let game = new Phaser.Game(config);
