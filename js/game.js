// Crea una nueva escena
let gameScene = new Phaser.Scene('Game');

// Inicializa los parámetros del jugador
gameScene.init = function () {
    this.playerSpeed = 300; // 300
    this.playerJump = -490; // Altura de salto reducida

    // Coordenadas de los pisos
    this.floorCoordinates = [
        { x: 200, y: 650, type: 'floor_1' }, 
        { x: 950, y: 630, type: 'floor_3' }, 
        { x: 1400, y: 620, type: 'floor_3' },  
        { x: 2150, y: 640, type: 'floor_1' },
        { x: 3200, y: 634, type: 'floor_1' }, 
        { x: 4090, y: 625, type: 'floor_2' }, 
        { x: 5350, y: 630, type: 'floor_1' }
    ];

    // Coordenadas de las plataformas
    this.platformCoordinates = [
        { x: 730, y: 500, type: 'plataform' }, // Plataforma separada
        { x: 1180, y: 500, type: 'plataform' }, // Plataforma separada
        { x: 1600, y: 490, type: 'plataform' },
        { x: 1400, y: 200, type: 'plataform2' },
        { x: 1490, y: 300, type: 'plataform2' },
        { x: 1700, y: 400, type: 'plataform2' }, // Plataforma separada
        { x: 1880, y: 430, type: 'plataform2' }, // Plataforma separada
        { x: 2600, y: 500, type: 'plataform' }, // Plataforma separada
        { x: 2700, y: 400, type: 'plataform' }, // Plataforma separada
        { x: 3800, y: 500, type: 'plataform' },//
        { x: 3610, y: 490, type: 'plataform' },//

        { x: 4450, y: 500, type: 'plataform2' },
        { x: 4600, y: 450, type: 'plataform' },
        { x: 4800, y: 500, type: 'plataform2' },

        { x: 5200, y: 490, type: 'plataform' },
        { x: 5300, y: 400, type: 'plataform2' },
        { x: 5500, y: 480, type: 'plataform' },
       

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
    this.load.image('floor_1', '../img/floor1.png');
    this.load.image('floor_3', '../img/floor3.png');
    this.load.image('plataform', '../img/Plataforma.png');
    this.load.image('plataform2', '../img/plataform2.png');
};

// Crea los elementos del juego
gameScene.create = function () {
    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.add.image(0, 0, 'mid_layer').setOrigin(0, 0);

    const firstFloor = this.floorCoordinates[0]; 
    const playerStartingX = firstFloor.x; 
    const playerStartingY = firstFloor.y - 1080; // Ajuste para la posición inicial

    // Crear el jugador exactamente sobre el primer piso
    this.player = this.physics.add.sprite(playerStartingX, playerStartingY, 'player'); 
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(600); 
    this.player.body.setAllowGravity(true);
    this.player.body.setBounce(0);
    this.player.body.setOffset(0, -15); 

    // Configuración de los límites del mundo
    this.physics.world.setBounds(0, 0, 5760, this.background.height);

    // Crear pisos y plataformas
    this.createFloors();
    this.createPlatforms();

    // Configuración de las colisiones
    this.physics.add.collider(this.player, this.floors);
    this.physics.add.collider(this.player, this.platforms);

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

// Creación de las plataformas
gameScene.createPlatforms = function () {
    this.platforms = this.physics.add.staticGroup();
    this.platformCoordinates.forEach(({ x, y, type }) => {
        this.platforms.create(x, y, type).refreshBody();
    });
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
    }
};

// Crear el juego
let game = new Phaser.Game(config);
