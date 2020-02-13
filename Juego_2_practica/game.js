// define variables
var game;
var player;
var platforms;
var badges; //Ficha roja para ganar
var items;
var cursors;
var jumpButton;
var text;
var text1; //Mensaje lose
var winningMessage;
var losingMessage;
var won = false;
var currentScore = 0; //Inicio puntuacion
var winningScore = 100; //Puntuacion para ganar
var currentLife = 3; //Vidas
var contCoins = 6; //Continuar jugando
var contStar = 1; //Contador estrellas

var veneno;
var estrella;

// add collectable items to the game
function addItems() {
    items = game.add.physicsGroup();
    veneno = game.add.physicsGroup();
    estrella = game.add.physicsGroup();

    createItem(375, 90, 'coin'); //Coin 0
    createItem(735, 125, 'coin'); //Coin 1
    createItem(220, 200, 'coin'); //Coin 2
    createItem(540, 300, 'coin'); //Coin 4
    createItem(225, 400, 'coin'); //Coin 6
    createItem(470, 500, 'coin'); //Coin 7

    createPoison(480, 95, 'poison'); //veneno 0
    createPoison(600, 300, 'poison'); //veneno 1
    createPoison(370, 500, 'poison'); //veneno 2

    createStar(745, 35, 'star'); //Estrella
}

// add platforms to the game
function addPlatforms() {
    platforms = game.add.physicsGroup();
    platforms.create(700, 80, 'platform'); //Platform 0
    platforms.create(360, 140, 'platform'); //Platform 1
    platforms.create(700, 180, 'platform2'); //Platform 2
    platforms.create(140, 250, 'platform'); //Platform 3
    platforms.create(-125, 300, 'platform2'); //Platform 4
    platforms.create(140, 450, 'platform'); //Platform 5
    platforms.create(700, 480, 'platform2'); //Platform 2
    platforms.create(465, 350, 'platform'); //Platform 6
    platforms.create(365, 550, 'platform2'); //Platform 9

    platforms.setAll('body.immovable', true);
}

// create a single animated item and add to screen
function createItem(left, top, image) {
    var item = items.create(left, top, image);
    item.animations.add('spin');
    item.animations.play('spin', 10, true);
}

function createPoison(left, top, image) {
    var item = veneno.create(left, top, image);
    item.animations.add('spin');
    item.animations.play('spin', 10, true);
}

function createStar(left, top, image) {
    var item = estrella.create(left, top, image);
    item.animations.add('spin');
    item.animations.play('spin', 10, true);
}

// create the winning badge and add to screen
function createBadge() {
    badges = game.add.physicsGroup();
    var badge = badges.create(750, 400, 'badge');
    badge.animations.add('spin');
    badge.animations.play('spin', 10, true);
}

// when the player collects an item on the screen
function itemHandler(player, item) {
    item.kill();
    currentScore = currentScore + 10;
    contCoins--;

    if (currentScore === winningScore) {
        createBadge();
    }
}

function poisonHandler(player, veneno) {
    veneno.kill();
    currentScore = currentScore - 10;
    currentLife = currentLife - 1;
    if (currentScore === winningScore) {
        createBadge();

    }
}

function starHandler(player, estrella) {
    estrella.kill();
    contStar--;
    currentScore = currentScore + 50;
    if (currentScore === winningScore) {
        createBadge();
    }
}

// when the player collects the badge at the end of the game
function badgeHandler(player, badge) {
    badge.kill();
    won = true;
}

// setup game when the web page loads
window.onload = function() {
    game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

    // before the game begins
    function preload() {
        game.stage.backgroundColor = '#5db1ad';

        //Load images
        game.load.image('platform', 'platform_1.png');
        game.load.image('platform2', 'platform_2.png');
        game.load.image('fondo', 'wUNsNFR.gif'); //cargar fondo

        //Load spritesheets
        game.load.spritesheet('player', 'chicken2.png', 60, 50); //sprite personaje
        game.load.spritesheet('coin', 'coin.png', 36, 40);
        game.load.spritesheet('badge', 'badge.png', 42, 54);
        game.load.spritesheet('poison', 'poison.png', 32, 32);
        game.load.spritesheet('star', 'star.png', 32, 32);
    }

    // initial game set up
    function create() {
        game.add.tileSprite(0, 0, 850, 600, 'fondo'); // ejercuta fondo (0, 0,posicion - 850, 600, dimension)
        player = game.add.sprite(25, 25, 'player'); //Ejecuta posicion del jugador
        player.animations.add('walk');
        player.anchor.setTo(0.5, 1);
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.body.gravity.y = 500;

        addItems();
        addPlatforms();

        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        text = game.add.text(16, 16, "SCORE: " + currentScore, { font: " 24px Impact", fill: "yellow" }); //Texto puntuacion
        text1 = game.add.text(700, 560, "Life: " + currentScore, { font: " 24px Impact", fill: "white" }); //Texto vidas
        winningMessage = game.add.text(game.world.centerX, 350, "", { font: "bold 80px Impact", fill: "black" }); //Texto Victoria
        winningMessage.anchor.setTo(0.5, 1);
        losingMessage = game.add.text(game.world.centerX, 400, "", { font: "bold 80px Impact", fill: "orange" }); //Texto derrota
        losingMessage.anchor.setTo(0.5, 1);
    }

    // while the game is running
    function update() {
        text.text = "SCORE: " + currentScore; // Puntuacion
        text1.text = "Life: " + currentLife; //Vidas
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.overlap(player, items, itemHandler);
        game.physics.arcade.overlap(player, veneno, poisonHandler);
        game.physics.arcade.overlap(player, estrella, starHandler);
        game.physics.arcade.overlap(player, badges, badgeHandler);
        player.body.velocity.x = 0;

        // is the left cursor key presssed?
        if (cursors.left.isDown) {
            player.animations.play('walk', 10, true);
            player.body.velocity.x = -300;
            player.scale.x = -1;
        }
        // is the right cursor key pressed?
        else if (cursors.right.isDown) {
            player.animations.play('walk', 10, true);
            player.body.velocity.x = 300;
            player.scale.x = 1;
        }
        // player doesn't move
        else {
            player.animations.stop();
        }

        if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
            player.body.velocity.y = -400;

        }

        if (currentScore < 0) { //Mantiene la puntuacion a 0 cuando esta es negativa
            currentScore = 0;
        }

        if (player.body.onFloor() || currentLife === 0) { //tocar suelo o coger todo el veneno pierdes
            player.kill(); // jugador muere
            currentLife = 0;
            losingMessage.text = "             YOU LOSE!!!\nPress F5 to start again";

        }

        if (contCoins === 0 && contStar === 0 && badges == true) { //La partida termina si se acaban las monedas y el jugador no ha llegado a 100 puntos
            player.kill();
            currentLife = 0;
            losingMessage.text = "             YOU LOSE!!!\nPress F5 to start again";
        }

        // when the player win the game
        if (won && currentScore >= 100) {
            winningMessage.text = "             YOU WIN!!!\nPress F5 to start again";
            player.kill();

        }
    }

    function render() {

    }
};