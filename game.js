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
var textlives;
var won = false;
var currentScore = 0;
var winningScore = 100;
var poison = "poison"
var lost = false;
var lives = 3;
// add collectable items to the game
function addItems() {
  items = game.add.physicsGroup();
  createItem(150, 70, 'coin');
  createItem(600, 145, 'coin');
  createItem(500, 320, 'coin');
  createItem(250, 420, 'coin');
  createItem(300, 230,  'coin');
  createItem(600, 40, 'coin');
  createItem(40, 100, 'coin');
  createItem(50, 340, 'coin');
  createItem(230, 540, 'coin');
  createItem(400, 50, 'poison');
  createItem(560, 320, 'poison');
  createItem(360, 320, 'poison');
  createItem(160, 320, 'poison');
  createItem(450, 175, 'star');
}

// add platforms to the game
function addPlatforms() {
  platforms = game.add.physicsGroup();
  
  platforms.create(150, 100, 'platform1');
  platforms.create(600, 175, 'platform1');
  platforms.create(500, 350, 'platform2');
  platforms.create(200, 450, 'platform2');
  platforms.create(300, 250, 'platform1');
  platforms.create(600, 60, 'platform2');
  platforms.create(50, 600, 'platform1');
  platforms.create(250, 550, 'platform2');
  platforms.create(500, 350, 'platform1');
  platforms.create(10, 150, 'platform1');
  platforms.create(50, 400, 'platform2');
  platforms.setAll('body.immovable', true);
}

// create a single aimated item and add to screen
function createItem(left, top, image) {
  var item = items.create(left, top, image);
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
  if (item.key === 'star'){
      currentScore = currentScore + 25;
  }
  if (item.key === 'coin'){
      currentScore = currentScore + 10;
  }
  if (item.key === "poison"){
    currentScore = currentScore - 10;
    if (currentScore < 0 ){
      lives = lives - 1
      
    }
      
  
  if (lives === 0){
    lost = true

  }
  
}

  item.kill();
  if (currentScore >= winningScore) {
      createBadge();
  }
  
}

// when the player collects the badge at the end of the game
function badgeHandler(player, badge) {
  badge.kill();
  won = true;
}

// setup game when the web page loads
window.onload = function () {
  game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
  
  // before the game begins
  function preload() {
   
    game.load.image ("forest", 'game/forest.png');
    

    
    //Load images
    game.load.image('platform1', "game/platform_1.png"); 
    game.load.image('platform2', "game/platform_2.png");
    
    //Load spritesheets
    game.load.spritesheet('player', 'game/mikethefrog.png', 32, 32);
    game.load.spritesheet('coin', 'game/coin.png', 36, 44);
    game.load.spritesheet('badge', 'game/badge.png', 42, 54);
    game.load.spritesheet('poison', 'game/poison.png', 32, 32);
    game.load.spritesheet('star', 'game/star.png', 32, 32);
  }

  // initial game set up
  function create() {
    game.add.image (0,-160, 'forest')
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
    text = game.add.text(16, 16, "SCORE: " + currentScore, { font: "bold 24px Arial", fill: "white" });
    textlives = game.add.text(16, 60, "Lives: " + lives, { font: "bold 24px Arial", fill: "white" });
    winningMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "white" });
    winningMessage.anchor.setTo(0.5, 1);
  }

  // while the game is running
  function update() {
    text.text = "SCORE: " + currentScore;
    textlives.text = "Lives: " + lives;
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, items, itemHandler);
    game.physics.arcade.overlap(player, badges, badgeHandler);
    player.body.velocity.x = 0;

    // is the left cursor key presssed?
    if (cursors.left.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = -300;
      player.scale.x = - 1;
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
    if (lost) {
      winningMessage.text = "You lost!!";
    }
  }

  function render() {

  }

};