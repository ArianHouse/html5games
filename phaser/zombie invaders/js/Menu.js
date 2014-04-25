var Menu = {};

Menu = function (game) {
    this.game = game;
    this.btnPlay = null;
    this.btnHowToPlay = null;
    this.btnHighScores = null;
    this.btnCredits = null;
};

Menu.prototype.preload = function(){
	game.load.image('menu', screenMenu);
	//game.load.atlas('buttons', spriteSheetsImageButtons, spriteSheetsJsonButtons);
	game.load.atlas('buttons', spriteSheetsImageButtons, spriteSheetsJsonButtons);
};

Menu.prototype.create = function() {
	var background = game.add.sprite(0, 0, 'menu');
	background.name = 'background';
	

    var fadeout;
    
    this.btnPlay = game.add.button(410,397, 'buttons',
    	    function(){ this.play(); }, this);
    	    this.btnPlay.setFrames(btPlaySelecionado,btPlay);
    	    this.btnPlay.anchor.x = 0.5;
    		    		
    this.btnHowToPlay = game.add.button(324, 467, 'buttons',
    	    function(){ this.howToPlay(); }, this);
    	    this.btnHowToPlay.setFrames(btHowToPlaySelelecionado,btHowToPlay);
    	    this.btnHowToPlay.anchor.x = 0.5;
    		
    this.btnHighScores = game.add.button(489, 467, 'buttons',
    	    function () { this.highScores(); }, this);
    	    this.btnHighScores.setFrames(btScoreSelecionado,btScore);
    	    this.btnHighScores.anchor.x = 0.5;

    this.btnCredits = game.add.button(410, 535, 'buttons',
    	    function(){ this.credits(); }, this);
    	    this.btnCredits.setFrames(btCreditsSelected,btCredits);
    	    this.btnCredits.anchor.x = 0.5;
   
};

Menu.prototype.play = function () {
    this.fadeOut();
    fadeout.onComplete.add(function () {
    	console.log("play");
        this.game.state.start('game', Game);
    });
};

//Menu.prototype.howToPlay = function() {
//    this.fadeOut();
//    fadeout.onComplete.add(function () {
//        //this.game.state.start('HowToPlay', HowToPlay);
//    });
//}
//
//Menu.prototype.highScores = function () {
//    this.fadeOut();
//    fadeout.onComplete.add(function () {
//        //this.game.state.start('HighScore', HighScore);
//    });
//}

//Menu.prototype.credits = function () {
//    this.fadeOut();
//    fadeout.onComplete.add(function () {
//        //this.game.state.start('Credits', Credits);
//    });
//};

Menu.prototype.fadeOut = function () {
    fadeout = game.add.tween(this.btnPlay).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, 0, true);
//    fadeout = game.add.tween(this.btnHowToPlay).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, 0, true);
//    fadeout = game.add.tween(this.btnHighScores).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, 0, true);
  // fadeout = game.add.tween(this.btnCredits).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, 0, true);
};