Clyde = function () {
	this.sprite = null;
	this.speed = 200;
	
	this.direction = "UP"; //LEFT, RIGHT, UP, DOWN
};

Clyde.prototype = {
	preload : function() {
		//Carrega o sprite do fantasminha clyde
		game.load.image('clyde', fp_clyde);
	},

	create : function() {
		//Adiciona o clyde na tela
		this.sprite = game.add.sprite(game.world.width/2 - 18, game.world.height/2 - 20, 'clyde');
		game.physics.enable(this.sprite);

		//Impede que o clyde saia dos limites da tela
		this.sprite.body.collideWorldBounds = true;
	},
	
	update : function(layer) {
		this.moveRandomly();
		this.verifyMapCollision(layer);
	},
	
	//Move o clyde
	moveRandomly : function() {
		//Move o clyde na horizontal (esquerda/direita)
		if (this.direction ==  "LEFT") {			
			this.sprite.body.velocity.x = -this.speed;
			this.sprite.body.velocity.y = 0;
		}
		if (this.direction == "RIGHT") {			
			this.sprite.body.velocity.x = this.speed;			
			this.sprite.body.velocity.y = 0;
		}
		
		//Move o clyde na vertical (cima/baixo)
		if (this.direction == "UP") {			
			this.sprite.body.velocity.x = 0;
			this.sprite.body.velocity.y = -this.speed;
		}
		if (this.direction == "DOWN") {
			this.sprite.body.velocity.x = 0;
			this.sprite.body.velocity.y = this.speed;
		}
	},
	
	//Verifica a colis�o do clyde com o mapa
	verifyMapCollision : function(layer) {		
		game.physics.arcade.overlap(this.sprite, layer, this.setNewDirection, null, this);
	},
	
	//Seta uma dire��o aleat�ria para o clyde
	setNewDirection : function() {
		var number = Math.round(1 + Math.random()*4);
		
		switch(number){
			case 1:				
				this.direction = "LEFT";
				break;
			case 2:				
				this.direction = "RIGHT";
				break;
			case 3:				
				this.direction = "UP";
				break;
			case 4:
				if (this.direction == "UP")
					this.setNewDirection();
				else
					this.direction = "DOWN";
				break;
		}		
	}
};
