Inkey = function () {
	this.sprite = null;
	this.speed = 200;
	
	this.direction = "RIGHT"; //LEFT, RIGHT, UP, DOWN
};

Inkey.prototype = {
	preload : function() {
		//Carrega o sprite do fantasminha inkey
		game.load.image('inkey', fp_inkey);
	},

	create : function() {
		//Adiciona o inkey na tela		
		this.sprite = game.add.sprite(414, 540, 'inkey');
		game.physics.enable(this.sprite);

		//Impede que o inkey saia dos limites da tela
		this.sprite.body.collideWorldBounds = true;
	},
	
	update : function(layer) {
		this.moveRandomly();
		this.verifyMapCollision(layer);
	},
	
	//Move o inkey
	moveRandomly : function() {
		//Move o inkey na horizontal (esquerda/direita)
		if (this.direction ==  "LEFT") {			
			this.sprite.body.velocity.x = -this.speed;
			this.sprite.body.velocity.y = 0;
		}
		if (this.direction == "RIGHT") {			
			this.sprite.body.velocity.x = this.speed;			
			this.sprite.body.velocity.y = 0;
		}
		
		//Move o inkey na vertical (cima/baixo)
		if (this.direction == "UP") {			
			this.sprite.body.velocity.x = 0;
			this.sprite.body.velocity.y = -this.speed;
		}
		if (this.direction == "DOWN") {			
			this.sprite.body.velocity.x = 0;
			this.sprite.body.velocity.y = this.speed;
		}
	},
	
	//Verifica a colis�o do inkey com o mapa
	verifyMapCollision : function(layer) {		
		game.physics.arcade.overlap(this.sprite, map.layer, this.setNewDirection, null, this);
	},
	
	//Seta uma dire��o aleat�ria para o inkey
	setNewDirection : function() {
		var number = Math.round(1 + Math.random()*3);
		
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
				this.direction = "DOWN";
				break;
		}		
	},
	
	//Seta uma dire��o aleat�ria para o inkey
	correctPosition : function(player, decision) {						
		if (decision.body.checkCollision.left)
			this.sprite.x += 6;
		
		if (decision.body.checkCollision.right)
			this.sprite.x -= 6;
			
		if (decision.body.checkCollision.down)
			this.sprite.y -= 6;
		
		if (decision.body.checkCollision.up)
			this.sprite.y += 6;
		
		this.setNewDirection();
	},
	
	//Remove o Inkey do jogo
	kill : function() {
		this.sprite.kill();
	}
};
