// Crea una nueva escena
let gameScene = new Phaser.Scene('Game');

// Inicializa los parámetros del jugador
gameScene.init = function () {
    this.playerSpeed = 500; // 300
    this.playerJump = -1000; 
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
    this.villainCoordinates = [
        { x: 1000, y: 490, type: 'planta', isFlying: false },  // Planta en el piso
        { x: 5200, y: 400, type: 'lobo', isFlying: false },    // Lobo
        { x: 1800, y: 380, type: 'hada', isFlying: true }      // Hada voladora
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

    // Arreglo para "gifts" y "props"
    this.gifts = [
        { x: 1500, y: 750, type: 'libro' },
        { x: 2500, y: 650, type: 'gato_negro' },
        { x: 3000, y: 680, type: 'gato_blanco' },
        { x: 4000, y: 750, type: 'varita' },
        { x: 4900, y: 700, type: 'cura' }
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
    this.load.image('planta', '../img/planta.png');  // Imagen de la planta
    this.load.image('lobo', '../img/villano_lobo.png');      // Imagen del lobo
    this.load.image('hada', '../img/hada.png');  
    this.load.image('libro', '../img/libro.png'); // Imagen del libro
    this.load.image('gato_negro', '../img/gato_negro.png'); // Imagen del gato negro
    this.load.image('gato_blanco', '../img/gato_blanco.png'); // Imagen del gato blanco
    this.load.image('varita', '../img/varita.png'); // Imagen de la varita
    this.load.image('cura', '../img/cura.png'); // Imagen del cura
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
    this.createVillains();
    this.createGifts(); // Crear objetos de regalo

    // Configuración de las colisiones
    this.physics.add.collider(this.player, this.floors);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.villains, this.floors);
    this.physics.add.collider(this.villains, this.platforms);
    this.physics.add.collider(this.villains, this.player);

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

// Creación de los villanos
gameScene.createVillains = function () {
    this.villains = this.physics.add.group();
    this.villainCoordinates.forEach(({ x, y, type, isFlying }) => {
        let villain = this.villains.create(x, y, type);
        villain.setCollideWorldBounds(true);
        villain.body.setBounce(0);

        if (isFlying) {
            villain.body.setAllowGravity(false);
            villain.body.setVelocityY(-5);
            this.setHitboxForFairy(villain); // Ajustar hitbox del hada
        } else {
            this.setHitboxForVillain(villain, type); // Ajustar hitbox para otros villanos
            villain.body.setVelocityY(0);
        }
    });
};

// Ajustar hitbox para el hada
gameScene.setHitboxForFairy = function (fairy) {
    fairy.body.setSize(45, 60); // Ajusta el tamaño del hitbox del hada
    fairy.body.setOffset(0, 0); // Ajusta la posición del hitbox si es necesario
};

// Ajustar hitbox para otros villanos
gameScene.setHitboxForVillain = function (villain, type) {
    if (type === 'lobo') {
        villain.body.setSize(40, 350); // Ajusta el tamaño del hitbox del lobo
        villain.body.setOffset(0, 0); // Ajusta la posición del hitbox del lobo
    } else if (type === 'planta') {
        villain.body.setSize(50, 300); // Ajusta el tamaño del hitbox de la planta
        villain.body.setOffset(0, 10); // Ajusta la posición del hitbox de la planta
    } else {
        villain.body.setSize(20, 350); // Tamaño por defecto para otros villanos
        villain.body.setOffset(0, -1); // Offset por defecto
    }
};


// Crear objetos de regalo
gameScene.createGifts = function () {
    this.giftGroup = this.physics.add.group();
    this.gifts.forEach(({ x, y, type }) => {
        let gift = this.giftGroup.create(x, y, type);
        gift.setCollideWorldBounds(true);
        gift.body.setBounce(0);
        gift.body.setOffset(0, 200);
    });
};

// Ajustar hitbox para el hada


// Función para actualizar el juego
gameScene.update = function () {
    this.player.setVelocityX(0);
    
    // Movimiento del jugador
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-this.playerSpeed);
        this.player.flipX = true;
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(this.playerSpeed);
        this.player.flipX = false;
    }

    // Salto del jugador
    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(this.playerJump);
    }

    // Lógica para los villanos
    this.villains.children.iterate(villain => {
        if (villain) {
            this.updateVillain(villain);
        }
    });

    // Lógica para los regalos
    this.giftGroup.children.iterate(gift => {
        if (gift) {
            this.updateGift(gift);
        }
    });
};

// Actualizar la lógica de los villanos
gameScene.updateVillain = function (villain) {
    if (villain.body.allowGravity === false) {
        if (villain.body.velocity.y <= 0) {
            villain.body.setVelocityY(5); // Cambia la dirección de vuelo
        }
        if (villain.body.y <= 100 || villain.body.y >= 500) { // Cambia la dirección de vuelo
            villain.body.setVelocityY(-villain.body.velocity.y);
        }
    }
};

// Actualizar la lógica de los regalos
gameScene.updateGift = function (gift) {
    // Lógica adicional para los regalos si es necesario
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
    }
};


let game = new Phaser.Game(config);
