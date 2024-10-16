// Create a new scene
let gameScene = new Phaser.Scene('Game');

// Initialize player parameters
gameScene.init = function () {
    this.playerSpeed = 300;
    this.playerJump = -400; // Reduced jump height

    // Floor coordinates
    this.floorCoordinates = [
        { x: 200, y: 650, type: 'floor_1' }, 
        { x: 950, y: 630, type: 'floor_3' }, 
        { x: 1400, y: 620, type: 'floor_3' },  
        { x: 2150, y: 640, type: 'floor_1' }
    ];
};

// Load assets
gameScene.preload = function () {
    this.loadAssets();
};

// Refactored asset loading function
gameScene.loadAssets = function () {
    this.load.image('background', '../img/Fondo.png');
    this.load.image('mid_layer', '../img/capa_medio.png');
    this.load.image('player', '../img/personaje_animate.png');
    this.load.image('floor_2', '../img/floor2.png');
    this.load.image('floor_1', '../img/floor1.png');
    this.load.image('floor_3', '../img/floor3.png');
};

// Create game elements
gameScene.create = function () {
    this.setupBackground();
    this.createPlayer();
    this.setupWorldBounds();
    this.createFloors();
    this.setupCollisions();
    this.setupCamera();
    this.configureInput();
};

// Refactored background setup
gameScene.setupBackground = function () {
    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.add.image(0, 0, 'mid_layer').setOrigin(0, 0);
};

// Refactored player creation
gameScene.createPlayer = function () {
    this.player = this.physics.add.sprite(100, this.background.height - 200, 'player');
    this.player.setCollideWorldBounds(true);

    // Ensure player has a dynamic body
    this.player.body.setGravityY(200); // Set player gravity to match the game's gravity
    this.player.body.setAllowGravity(true);
    this.player.body.setBounce(0); // No bounce on landing
    this.player.body.setVelocity(0, 0); // Reset velocity to prevent any initial movement
};

// Refactored world bounds setup
gameScene.setupWorldBounds = function () {
    this.physics.world.setBounds(0, 0, 5760, this.background.height);
};

// Refactored floor creation
gameScene.createFloors = function () {
    this.floors = this.physics.add.staticGroup();
    this.floorCoordinates.forEach(({ x, y, type }) => {
        this.floors.create(x, y, type).refreshBody();
    });
};

// Refactored collider setup
gameScene.setupCollisions = function () {
    // Ensure the player collides with the floors
    this.physics.add.collider(this.player, this.floors, () => {
        console.log('Player has landed on a platform.');
    });
};

// Refactored camera setup
gameScene.setupCamera = function () {
    this.cameras.main.setBounds(0, 0, 5760, this.background.height);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(config.height / this.background.height);
};

// Refactored input configuration
gameScene.configureInput = function () {
    this.cursors = this.input.keyboard.createCursorKeys();
};

// Refactored input handling (formerly update)
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

// Refactored player bounds checking
gameScene.keepPlayerInBounds = function () {
    if (this.player.x < 0) {
        this.player.setPosition(0, this.player.y);
    } else if (this.player.x > this.physics.world.bounds.width) {
        this.player.setPosition(this.physics.world.bounds.width, this.player.y);
    }
};

// Update function
gameScene.update = function () {
    this.handleInput();
};

// Game configuration
let config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 997,
    scene: gameScene,
    title: 'The flower witcher',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }, // Adjusted global gravity
            debug: false
        }
    }
};

// Create the game
let game = new Phaser.Game(config);
