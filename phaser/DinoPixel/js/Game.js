var Game = {};
var player;
var playerSpeed = 200;
var gravity = 400;
var cursors;
var layer, layer2, layer3, layer4, layer5, layer6;
var bg;
var layerBack1, layerBack2;
var cloud;
var back1;
var track;
var humans;
var guy;
var soundFall;
var soundJump;
var SoundSmash;
Game = function()
{}
Game.prototype.create = function()
{
	track = game.add.audio('track',5,true);
	track.play();
	soundFall = game.add.audio('fall',5,false);
	soundJump = game.add.audio('jump',5,false);
	soundSmash = game.add.audio('smash',5,false);
	
	game.physics.startSystem(Phaser.Game.ARCADE);
	game.physics.arcade.gravity.y = gravity;

	bg = game.add.tileSprite(0,0,800,600,'backGround');
	bg.fixedToCamera = true;
	//cloud = game.add.sprite(0, 1000, 'cloud');

	map = game.add.tilemap('stage');
	map.addTilesetImage('cityThings','cityThings');
	map.addTilesetImage('urbanBuildings1','urbanBuildings1');
	map.addTilesetImage('urbanBuildings2','urbanBuildings2');
	map.addTilesetImage('back2','back2');
	map.addTilesetImage('back1','back1');
	layerBack2 = map.createLayer('back2');
	layerBack1 = map.createLayer('back1');
	layerBg = map.createLayer('bg');
	layer = map.createLayer('Camada de Tiles 1');
	layer2 = map.createLayer('Camada de Tiles 2');
	layer3 = map.createLayer('Camada de Tiles 3');
	layer4 = map.createLayer('Camada de Tiles 4');
	layer5 = map.createLayer('Camada de Tiles 5');
	layer6 = map.createLayer('Camada de Tiles 6');
	map.setCollision([162,163,15,16,19,20,21,22,23,24,25,26,2152,2153,2154,2155,2156,2083,2084,2085,2086,2089,2090],true,'Camada de Tiles 6'); // id dos tiles que colidem (plataformas).
	layerBack1.scrollFactorX = 0.35;
	layerBack2.scrollFactorX = 0.2;
	//layer.debug = true;
	//layer6.debug = true;
	layer.resizeWorld();
	
	game.stage.backgroundColor = '#000010';
	
	humans = game.add.group();
	
	player = game.add.sprite(50,1500,'dino');
	
	game.physics.enable(player);
	player.smoothed = false;
	player.anchor.setTo(0.4 ,0.5);
	player.scale.setTo(4,4);
	player.animations.add('walk',[0,1,2,3,4,5,6,7],12,true);
	player.body.collideWorldBounds = true;
	player.body.checkCollision.up = false;
	player.body.checkCollision.left = false;
	player.body.checkCollision.right = false;
	player.body.setSize(8,32,-4,-4);

	game.camera.follow(player);
	cursors = game.input.keyboard.createCursorKeys();
	jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	player.debug = true;
}
Game.prototype.update = function()
{
	game.physics.arcade.collide(player, layer);
	game.physics.arcade.collide(player, layer6);
	game.physics.arcade.collide(layer, humans);	
	game.physics.arcade.collide(layer6, humans);
	game.physics.arcade.overlap(player,humans,this.smashHuman);
	
	player.body.velocity.x = 0;
	if(cursors.left.isDown)
	{
		player.body.setSize(8,32,-2,-4);
		player.scale.setTo(-4,4);
		player.animations.play('walk');		
		player.body.velocity.x = -playerSpeed;
	}
	else if(cursors.right.isDown)
		{
		player.body.setSize(8,32,-4,-4);
		player.scale.setTo(4,4);
		player.animations.play('walk');		
		player.body.velocity.x = playerSpeed;
		}
	else 
		if(player.body.blocked.down)
	{
		player.animations.stop();
		player.frame = 1;
	}
	
	if(player.body.velocity.y < 0)
		player.frame = 9;
		else if(player.body.velocity.y > 0)
		player.frame = 8;
	if (jumpButton.isDown && player.body.onFloor())
	{
		soundJump.play();
		player.body.velocity.y = -400;
	}
}
Game.prototype.smashHuman = function (player, sprite)
{
	soundSmash.play();
	sprite.destroy();
}
