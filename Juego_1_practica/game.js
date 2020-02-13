// define variables
var game;
var player;
var platforms;
var badges;
var items;
var cursors;
var jumpButton;
var text;
var winningMessage;
var won = false;
var currentScore = 0;
var winningScore = 100;
var veneno;
var estrella;

// add collectable items to the game
function addItems() {
    items = game.add.physicsGroup();
    veneno = game.add.physicsGroup();
    estrella = game.add.physicsGroup();
    //createItem(375, 100, 'coin'); //Coin 1
    createItem(585, 150, 'coin'); //Coin 2
    createItem(220, 200, 'coin'); //Coin 3
    createItem(650, 250, 'coin'); //Coin 4
    createItem(375, 400, 'coin'); //Coin 5
    createItem(225, 500, 'coin'); //Coin 6
    createItem(590, 500, 'coin'); //Coin 7

    createPoison(375, 100, 'poison'); //veneno 1
    createPoison(370, 500, 'poison'); //veneno 2

    createStar(175, 40, 'star'); //estrella
}

// add platforms to the game
function addPlatforms() {
    platforms = game.add.physicsGroup();
    platforms.create(100, 100, 'platform2'); //Platform 0
    platforms.create(245, 150, 'platform'); //Platform 1
    platforms.create(560, 200, 'platform2'); //Platform 2
    platforms.create(140, 250, 'platform'); //Platform 3
    platforms.create(45, 300, 'platform'); //Platform 4
    platforms.create(650, 300, 'platform'); //Platform 5
    platforms.create(410, 360, 'platform2'); //Platform 6
    platforms.create(310, 450, 'platform2'); //Platform 7
    platforms.create(100, 550, 'platform'); //Platform 8
    platforms.create(465, 550, 'platform'); //Platform 9

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
    if (currentScore === winningScore) {
        createBadge();
    }
}

function poisonHandler(player, veneno) {
    veneno.kill();
    currentScore = currentScore - 10;
    if (currentScore === winningScore) {
        createBadge();
    }
}

function starHandler(player, estrella) {
    estrella.kill();
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

        //Load spritesheets
        game.load.spritesheet('player', 'chalkers.png', 48, 62); //sprite personaje
        game.load.spritesheet('coin', 'coin.png', 36, 44);
        game.load.spritesheet('badge', 'badge.png', 42, 54);
        game.load.spritesheet('poison', 'poison.png', 32, 32);
        game.load.spritesheet('star', 'star.png', 32, 32);
    }

    // initial game set up
    function create() {
        player = game.add.sprite(50, 600, 'player');
        player.animations.add('walk');
        player.anchor.setTo(0.5, 1);
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.body.gravity.y = 500;

        addItems();
        addPlatforms();

        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        text = game.add.text(16, 16, "SCORE: " + currentScore, { font: " 24px Impact", fill: "yellow" });
        winningMessage = game.add.text(game.world.centerX, 295, "", { font: "bold 60px Impact", fill: "white" });
        winningMessage.anchor.setTo(0.5, 1);
    }

    // while the game is running
    function update() {
        text.text = "SCORE: " + currentScore;
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
        // when the player winw the game
        if (won) {
            winningMessage.text = "YOU WIN!!!";
        }
    }

    function render() {

    }

};