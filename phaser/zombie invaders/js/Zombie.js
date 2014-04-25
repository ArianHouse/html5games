var Zombie = function (index, game, person, classGame) {
	
    var x = game.world.randomX;
    var y = game.rnd.integerInRange(0, 100);
    

    this.game = game;
    this.spritePerson = person;
    this.alive = true;
    
    this.classGame = classGame;

    this.spriteZombie = this.game.add.sprite(x, y,'zombieDown');
    
    this.spriteZombie.animations.add('down');
    this.spriteZombie.play('down',7,true);

    this.spriteZombie.name = index.toString();
    this.game.physics.enable(this.spriteZombie, Phaser.Physics.ARCADE);

    this.spriteZombie.body.enable = true;
    
    this.spriteZombie.body.immovable = false;
    this.spriteZombie.body.collideWorldBounds = true;
    this.spriteZombie.body.bounce.setTo(1, 1);
    
    this.spriteZombie.inputEnabled=true;
    this.spriteZombie.body.velocity.x  = 0;
    
    this.spriteZombie.body.setSize(100,10, 0, zombieHeigth-10);
    
    this.spriteZombie.events.onInputDown.add(killZombie,this);
    
    this.sound = game.add.audio('audioZombieDead');
    
    this.spriteZombie.body.velocity.x  = Math.random()*10;
    this.spriteZombie.body.velocity.y  = Math.random()*10;
};

Zombie.prototype.update = function (){
	//this.classGame
};

Zombie.prototype.preload = function(){
	
};

function killZombie(){
	this.sound.play();
	this.spriteZombie.destroy();
    this.classGame.amountZombies -= 1;
    this.classGame.punctuate(1);
    console.log("amount zombie ="+this.classGame.amountZombie);
};

//Debug
/*Zombie.prototype.render = function(){

    this.game.debug.body(this.spriteZombie);
    

};*/
