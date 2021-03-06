var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var cursors;
var spriteMuro;
var spriteRua;
var spriteZombie;
var numeroDePessoas;
var numeroDeZumbis;
var grupoZumbis;
var grupoPessoas;
var timer;
//var zombie;

function preload()
{
	
	game.load.image('muro', imageMuro);
	game.load.image('rua',imageRua);
	game.load.image('zombie',imageZombie);
	game.load.image('pessoa',imagePessoa);
	
}

function create()
{
	//game.physics.startSystem(Phaser.Physics.ARCADE);
	
	cursors = game.input.keyboard.createCursorKeys();
	
	
	spriteMuro = game.add.sprite(0, 0, 'muro');
	game.physics.arcade.enable(spriteMuro);
	spriteMuro.body.setSize(0, 0, -100, 20);
	spriteMuro.body.immovable = true;
	
	spriteRua = game.add.sprite(0,260,'rua');
	game.physics.arcade.enable(spriteRua);
	spriteMuro.body.immovable = true;
	//Grupo de zumbis	
	grupoZumbis = game.add.group();
	grupoZumbis.enableBody = true;
	grupoZumbis.physicsBodyType = Phaser.Physics.ARCADE;
	//initZombies(grupoZumbis);
	
	//Grupo de pessoas
	grupoPessoas = game.add.group();
	grupoPessoas.enableBody = true;
	grupoPessoas.physicsBodyType = Phaser.Physics.ARCADE;
	game.physics.enable(grupoPessoas);
	game.time.events.repeat(Phaser.Timer.SECOND * 5, 3, initPessoas, this);
	
	timer = game.time.create(false);

	
}

function update() 
{
	game.physics.arcade.overlap(grupoZumbis, grupoPessoas, collisionHandler, null, this);
	
	
    //game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
	//zombie.move();
	//moveZombies(grupoZumbis);
}

function collisionHandler(zumbi,pessoa) {
	console.log("colis�o");
	pessoa.kill();
	var zumbi = grupoZumbis.create(pessoa.x, pessoa.y, 'zombie');
	zumbi.inputEnabled=true;
    zumbi.body.velocity.x  = 20;
    zumbi.events.onInputDown.add(elimine = function(zumbi){
		zumbi.destroy();
	},null);

}

function collisionWall(spriteMuro,pessoa) {
	console.log("colis�o");
	pessoa.body.velocity.y = pessoa.body.velocity.y * (-1);

}



function setHighScore()
{
   
}

function outOfBounds(object) {

};

function initZombies(grupoZumbis){
	
    for (var i = 0; i < 5; i++)
    {
       	var zumbi = grupoZumbis.create(i*110+1, 300, 'zombie');
       	game.physics.enable(zumbi,Phaser.Physics.ARCADE);
        zumbi.inputEnabled=true;
        zumbi.body.velocity.x  = 0;
        zumbi.events.onInputDown.add(elimine = function(zumbi){
			zumbi.destroy();
		},null);
    }
}

function initPessoas(){
	
	//for (var i = 0; i < 3; i++)
    //{
       	var pessoa = grupoPessoas.create(1000, Math.random(), 'pessoa');
       	game.physics.enable(pessoa,Phaser.Physics.ARCADE);
        pessoa.body.velocity.x  = -Math.random()*10;
        pessoa.body.velocity.y  = -Math.random()*10;
        pessoa.body.collideWorldBounds = true;
        pessoa.body.bounce.set(1);
    //}
}



function render() {
	console.log("render");
    //game.debug.bodyInfo(sprite2, 32, 32);
	game.debug.spriteInfo(spriteMuro, 800, 267);

    //game.debug.body(spriteMuro);
    //game.debug.body(sprite2);

}
