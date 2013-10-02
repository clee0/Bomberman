canvas = document.getElementById('gameCanvas');
context = canvas.getContext('2d');

hudCanvas = document.getElementById('hudCanvas');
hudContext = hudCanvas.getContext('2d');

canvas.style.border = "black 1px solid";
hudCanvas.style.border = "black 1px solid";

var gameStarted = false;
var gameEnded = false;
var explImg = new Array();
var tiles = new Array(13); // all tiles in game
for (var i = 0; i < 13; i++) {
	tiles[i] = new Array(13);
}
var players = new Array();
var bombs = new Array();
var types = new Array('extra-bomb','fire'/* 'skate', 'kick', 'glove', 'disease', 'crane'*/);

var clock;
var TO_RADIANS = Math.PI/180;

var clockone = new Image();
var clocktwo = new Image();
var clockmid = new Image();
var wallImg = new Image();
var player1Img = new Image();
var player2Img = new Image();
var emptyImg = new Image();
var bombImg = new Image();
var twoHudImg = new Image();
var powerupImg = new Image();
var hudNumbers = new Image();
explImg[0] = new Image();
explImg[1] = new Array(); explImg[1][0] = new Image(); explImg[1][1] = new Image();
explImg[2] = new Array(); explImg[2][0] = new Image(); explImg[2][1] = new Image();
explImg[3] = new Array(); explImg[3][0] = new Image(); explImg[3][1] = new Image();
explImg[4] = new Array(); explImg[4][0] = new Image(); explImg[4][1] = new Image();

// object for making clocks so powerups can have different clocks at different references
var powclock = {
	Index: 0
};
var bombclocks = {
	Index: 0
}

var currentTime = 1;
var timeBlocks = 0;
var scores = new Array();

// TODO: Reset HUD scores & Stuff if / when game restarts?

function checkGameTermination() {
	// If only one player alive, that player wins
	// If no players alive, draw
	
	var livePlayers = new Array();
	for (var i = 0; i < players.length; i++) {
		if(players[i].alive)
			livePlayers.push(players[i]);
	}
	
	if(livePlayers.length == 1) {
		alert(livePlayers[0].name + ' wins by elimination');
		gameEnded = true;
	}
	if(livePlayers.length == 0) {
		var winnerIndex = -1;
		var maxScore = 0;
		for(var j = 0; j < players.length; j++) {
			if(players[j].score > maxScore) {
				winnerIndex = j;
				maxScore = players[j].score;
			}
		}
		if(winnerIndex >= 0)
			alert(players[winnerIndex].name + ' wins with score: ' + players[winnerIndex].score.toString());
		else
			if (livePlayers.length == 1)
				alert(livePlayers[0].name + ' wins');
			else
				alert('Game is a draw');
		gameEnded = true;
	}
}

function smallClockUpdate(){
	currentTime += 1;
	modTime = currentTime % 8;

	updateSmallClock(modTime);

	// there are 28 blocks to be colored black before time ends
	if (timeBlocks === 28) {
		// GAME ENDS BY TIME DELAY
		
		// Find player with highest score
		var livePlayers = new Array();
		for (var i = 0; i < players.length; i++) {
			if(players[i].alive)
				livePlayers.push(players[i]);
		}
		var winnerIndex = -1;
		var maxScore = 0;
		var checkTie = 0;
		for(var j = 0; j < players.length; j++) {
			if(players[j].score > maxScore) {
				winnerIndex = j;
				maxScore = players[j].score;
			}
			if(players[j].score == maxScore)
				checkTie++;
		}
		
		if(winnerIndex >= 0 && checkTie != players.length)
			alert('Game over by timeout! ' + players[winnerIndex].name + ' wins with score: ' + maxScore);
		else if(checkTie == players.length)
			alert('Game over by timeout: score is tied');
		clearInterval(clock);
		gameEnded = true;

	}

	if ((currentTime % 16) == 0) {
		hudContext.fillStyle="black";
		if (timeBlocks < 14) {
			hudContext.fillRect(10 + (8*timeBlocks),26,4,3);
		} else {
			hudContext.fillRect(26 + (8*timeBlocks),26,4,3);
		}
		++timeBlocks;
	}
}
	
function drawRotatedImage(ctx,image, x, y, angle,offsetx,offsety) { 
	// save the current co-ordinate system 
	// before we screw with it
	ctx.save(); 
	// move to the middle of where we want to draw our image
	ctx.translate(x, y);
	// rotate around that point, converting our 
	// angle from degrees to radians 
	ctx.rotate(angle * TO_RADIANS);
	// draw it up and to the left by half the width
	// and height of the image 
	ctx.drawImage(image, -(image.width/3) + offsetx, -(image.height/3) - offsety);
	// and restore the co-ords to how they were when we began
	ctx.restore(); 
}

function updateSmallClock(imageNumber){	
	hudContext.drawImage(clockmid,0,0,7,7,125,15,7,7); //reset 
	if(imageNumber == 0){
		hudContext.drawImage(clockone,0,0,3,3,127,15,3,3); //top
	}else if (imageNumber == 1){
		drawRotatedImage(hudContext,clocktwo,126,15,90,2,5); //NE	
	}else if (imageNumber == 2){
		drawRotatedImage(hudContext,clockone,127,15,90,3,3); //right	
	}else if (imageNumber == 3){
		drawRotatedImage(hudContext,clocktwo,127,15,180,-3,6); //SE
	}else if (imageNumber == 4){
		drawRotatedImage(hudContext,clockone,127,15,180,-2,6); //bottom	
	}else if (imageNumber == 5){
		drawRotatedImage(hudContext,clocktwo,127,15,270,-5,1); //SW
	}else if (imageNumber == 6){
		drawRotatedImage(hudContext,clockone,127,15,270,-4,1); //right
	}else{
		hudContext.drawImage(clocktwo,0,0,3,3,126,15,3,3); //NW
	}
}


clock = self.setInterval(function() {
	if(gameStarted && !gameEnded) {
		smallClockUpdate();
		checkGameTermination();
		if(players.length != 0)
			updateHud();
	}
}, 1000);

function startup() {
    if (context) {
    	// 13 x 13 tiles at 16 px each.
        canvas.width = (tiles.length*16).toString();
        canvas.height = (tiles[0].length*16).toString();
    }

    if (hudContext) {
    	hudCanvas.width = 256;
    	hudCanvas.height = 32;
    }

    // load images before anything else.
	function loader(items, thingToDo, allDone) {
	    if (!items) {
	        // nothing to do.
	        return;
	    }

	    if ("undefined" === items.length) {
	        // convert single item to array.
	        items = [items];
	    }

	    var count = items.length;

	    // this callback counts down the things to do.
	    var thingToDoCompleted = function (items, i) {
	        count--;
	        if (0 == count) {
	            allDone(items);
	        }
	    };

	    for (var i = 0; i < items.length; i++) {
	        // 'do' each thing, and await callback.
	        thingToDo(items, i, thingToDoCompleted);
	    }
	}

	function loadImage(items, i, onComplete) {
	    var onLoad = function (e) {
	        e.target.removeEventListener("load", onLoad);

	        // notify that we're done.
	        onComplete(items, i);
	    }
	    var img = new Image();
	    img.addEventListener("load", onLoad, false);
	    img.src = items[i];
	}

	var items = [
		player1Img.src = getTileSrc('Player assets/player1sheet2.png', context),
		player2Img.src = getTileSrc('Player assets/player2sheet1.png', context),
		wallImg.src = getTileSrc('maptiles/maptiles.jpg', context),
		emptyImg.src = getTileSrc('maptiles/maptiles.jpg', context),
		bombImg.src = getTileSrc('bombs/bombs.png', context),
		twoHudImg.src = getTileSrc('Hud/twoplayerhud.png', hudContext),
		powerupImg.src = getTileSrc('powerups/powerups.jpg', context),
		clockone.src = getTileSrc('Hud/clockone.png',hudContext),
		clocktwo.src = getTileSrc('Hud/clocktwo.png',hudContext),
		clockmid.src = getTileSrc('Hud/clockmid.png',hudContext),
		hudNumbers.src = getTileSrc('Hud/hudnumbers.jpg', hudContext),

		explImg[0].src = getTileSrc('explosion/bombcenter.png', context),
		explImg[1][0].src = getTileSrc('explosion/up/bombmid.png', context),
		explImg[1][1].src = getTileSrc('explosion/up/bombend.png', context),
		explImg[2][0].src = getTileSrc('explosion/right/bombmid.png', context),
		explImg[2][1].src = getTileSrc('explosion/right/bombend.png', context),
		explImg[3][0].src = getTileSrc('explosion/down/bombmid.png', context),
		explImg[3][1].src = getTileSrc('explosion/down/bombend.png', context),
		explImg[4][0].src = getTileSrc('explosion/left/bombmid.png', context),
		explImg[4][1].src = getTileSrc('explosion/left/bombend.png', context)
	];

	loader(items, loadImage, function() {
		loadHud();
		loadSmallClock();
		loadMap1();
	});
	
	gameStarted = true;
}

function drawNumber(number, player, type) {
	var wx = 7,         wy = 14;
	var X, Y = 9;
	var imgX = 46,      imgY = 3; // 46 is where 0 starts - 10 px btw each #

	if (number > 999999999) {
		alert('cannot draw that high of a number in ' + player + ' ' + type);
	}
	if (player === 'p1') {
		if (type === 'kills' && number < 10) {
			X = 24;
		} else if (type === 'score') {
			X = 104;
		} else {
			alert('cannot draw that high of a number in ' + player + ' ' + type);
		}
	} else if (player === 'p2') {
		if (type === 'kills' && number < 10) {
			X = 160;
		} else if (type === 'score') {
			X = 240;
		} else {
			alert('cannot draw that high of a number in ' + player + ' ' + type);
		}
	} else {
		alert('error here!');
	}

	var num = number;
	var intArray = [0];
	if (num != 0) {
		intArray = [];
		for (var i = 0; i < num;) {
			intArray.push(num % 10);
			num = Math.floor(num/10);
		}
	}
	for (var i = 0; i < intArray.length; i++) {
		hudContext.drawImage(hudNumbers, 46+(intArray[i]*10), imgY, wx, wy, X-(i*7), Y, wx, wy);
	}
}

function loadHud() {
	// draw main hud image:
	hudContext.drawImage(twoHudImg, 0, 0, 256, 32, 0, 0, 256,32);

}

function updateHud() {
	for(var i = 0; i < players.length; i++) {
		scores[i] = players[i].score;
	}
	drawNumber(players[0].lives, 'p1', 'kills');
	drawNumber(players[1].lives, 'p2', 'kills');
	drawNumber(scores[0], 'p1', 'score');
	drawNumber(scores[1], 'p2', 'score');
}

function loadSmallClock() {	
	hudContext.drawImage(clockone,0,0,3,3,127,15,3,3); //top
}

function addPlayers() {
	players[0] = new Player(context, player1Img, 18, 1, 16, 23, 1*16, 1*16, 16, 16, 'Player 1');
	players[1] = new Player(context, player2Img, 18, 1, 16, 23, 11*16, 11*16, 16, 16, 'Player 2');
	drawPlayers();
}

function drawPlayers() {
	if (players.length != 'undefined') {
		for (var i = 0; i < players.length; i++) {
			players[i].Draw();
		}
	}
}

function drawTiles() {
	for (var i = 0; i < tiles.length; i++) {
		for (var j = 0; j < tiles[0].length; j++) {
			tiles[i][j].Draw();
		}
	}
	addPlayers();
}

function createPowerup(x, y) {
	var index = Math.floor(Math.random() * types.length);
	var offsetX;
	var tileType = types[index];

	if (index === 0) {
		offsetX = 3 + (0 * 17);
	} else if (index === 1) {
		offsetX = 3 + (4 * 17);
	}
	var tempTile = new Tile(context, tileType, powerupImg, offsetX, 3, 16, 16, x*16, y*16, 16, 16, powclock.Index);
	tiles[x][y] = tempTile;
	tiles[x][y].Draw();

	var Name = 'powClock' + powclock.Index;
	++powclock.Index;
	powclock[Name] = setInterval(function() {
		tiles[x][y].shiftImg();
	}, 400);
}

function dropBomb(player) {
	if (player.bombCount > 0) {
		--player.bombCount;
		var tempBomb = new Bomb(bombImg, 0, 0, 14, 18, 16, 16, player, bombclocks.Index);
		var X = tempBomb.x/16; var Y = tempBomb.y/16;

		tiles[X][Y] = new Tile(context, 'bomb', bombImg, 0, 0,
			14, 18, tempBomb.x, tempBomb.y, 16, 16, bombclocks.Index);

		tiles[X][Y].Draw();
		player.Draw();

		var Name = 'bombClock' + bombclocks.Index;
		++bombclocks.Index;
		bombclocks[Name] = setInterval(function() {
			if (tempBomb.countdown()) {
				explodeBomb(tempBomb, player);
			}
		}, 400);
	}
}

// 5% to return true (checking if wall drops powerup)
function rollPowerup() {
	// Creates a random number between 0-100
	var rand = Math.floor(Math.random()*101);
	if(rand < 7) {return true;}
	return false;
}
	
function explodeBomb(bomb, player) {
	++player.bombCount;
	clearBombClock(bomb);
	var locx = bomb.x/16;
	var locy = bomb.y/16;

	var explosionTiles = new Array();
	var powerupTiles = new Array();

	tiles[locx][locy] = new Tile(context, 'explosion', explImg[0], 0, 2, 12, 12, bomb.x, bomb.y, 16, 16);
	tiles[locx][locy].Draw();

	explosionTiles.push(tiles[locx][locy]);
	var hitLeft = false, hitRight = false, hitUp = false, hitDown = false;
	for(var i = 1; i <= bomb.player.bombSize - 1; i++) {
		if(!hitRight && (locx+i) <= 12) {
			if(!tiles[locx+i][locy].isSolid) {
				if (tiles[locx+i][locy].isPowerup)
					clearPowerup(locx+i, locy, player);
				if(i == bomb.player.bombSize - 1)
					tiles[locx+i][locy] = new Tile(context, 'explosion', explImg[2][1], 84, 0, 16, 16, bomb.x+(16*i), bomb.y, 16, 16);
				else
					tiles[locx+i][locy] = new Tile(context, 'explosion', explImg[2][0], 84, 0, 16, 16, bomb.x+(16*i), bomb.y, 16, 16);
				tiles[locx+i][locy].Draw();
				explosionTiles.push(tiles[locx+i][locy]);
			}
			else {
				if(tiles[locx+i][locy].Type == 'destroyableWall') {
					tiles[locx+i][locy] = new Tile(context, 'explosion', explImg[2][1], 84, 0, 16, 16, bomb.x+(16*i), bomb.y, 16, 16);
					tiles[locx+i][locy].Draw();
					player.score += 125;
					updateHud();
					explosionTiles.push(tiles[locx+i][locy]);
					powerupTiles.push(tiles[locx+i][locy]);
				}
				hitRight = true;
			}
		}
		if(!hitLeft && (locx-i) >= 0) {
			if(!tiles[locx-i][locy].isSolid) {
				if (tiles[locx-i][locy].isPowerup)
					clearPowerup(locx-i, locy, player);
				if(i == bomb.player.bombSize - 1)
					tiles[locx-i][locy] = new Tile(context, 'explosion', explImg[4][1], 0, 0, 16, 16, bomb.x-(16*i), bomb.y, 16, 16);
				else
					tiles[locx-i][locy] = new Tile(context, 'explosion', explImg[4][0], 0, 0, 16, 16, bomb.x-(16*i), bomb.y, 16, 16);
				tiles[locx-i][locy].Draw();
				explosionTiles.push(tiles[locx-i][locy]);
			}
			else {
				if(tiles[locx-i][locy].Type == 'destroyableWall') {
					tiles[locx-i][locy] = new Tile(context, 'explosion', explImg[4][1], 0, 0, 16, 16, bomb.x-(16*i), bomb.y, 16, 16);
					tiles[locx-i][locy].Draw();
					player.score += 125;
					updateHud();
					explosionTiles.push(tiles[locx-i][locy]);
					powerupTiles.push(tiles[locx-i][locy]);
				}
				hitLeft = true;
			}
		}
		if(!hitUp && (locy-i) >= 0) {
			if(!tiles[locx][locy-i].isSolid) {
				if (tiles[locx][locy-i].isPowerup)
					clearPowerup(locx, locy-i, player);
				if(i == bomb.player.bombSize - 1)
					tiles[locx][locy-i] = new Tile(context, 'explosion', explImg[1][1], 0, 0, 16, 16, bomb.x, bomb.y-(16*i), 16, 16);
				else
					tiles[locx][locy-i] = new Tile(context, 'explosion', explImg[1][0], 0, 0, 16, 16, bomb.x, bomb.y-(16*i), 16, 16);
				tiles[locx][locy-i].Draw();
				explosionTiles.push(tiles[locx][locy-i]);
			}
			else {
				if(tiles[locx][locy-i].Type == 'destroyableWall') {
					tiles[locx][locy-i] = new Tile(context, 'explosion', explImg[1][1], 0, 0, 16, 16, bomb.x, bomb.y-(16*i), 16, 16);
					tiles[locx][locy-i].Draw();
					player.score += 125;
					updateHud();
					explosionTiles.push(tiles[locx][locy-i]);
					powerupTiles.push(tiles[locx][locy-i]);
				}
				hitUp = true;
			}
		}
		if(!hitDown && (locy+i) <= 12) {
			if(!tiles[locx][locy+i].isSolid) {
				if (tiles[locx][locy+i].isPowerup)
					clearPowerup(locx, locy+i, player);
				if(i == bomb.player.bombSize - 1)
					tiles[locx][locy+i] = new Tile(context, 'explosion', explImg[3][1], 0, 84, 16, 16, bomb.x, bomb.y+(16*i), 16, 16);
				else
					tiles[locx][locy+i] = new Tile(context, 'explosion', explImg[3][0], 0, 84, 16, 16, bomb.x, bomb.y+(16*i), 16, 16);
				tiles[locx][locy+i].Draw();
				explosionTiles.push(tiles[locx][locy+i]);
			}
			else {
				if(tiles[locx][locy+i].Type == 'destroyableWall') {
					tiles[locx][locy+i] = new Tile(context, 'explosion', explImg[3][1], 0, 84, 16, 16, bomb.x, bomb.y+(16*i), 16, 16);
					tiles[locx][locy+i].Draw();
					player.score += 125;
					updateHud();
					explosionTiles.push(tiles[locx][locy+i]);
					powerupTiles.push(tiles[locx][locy+i]);
				}
				hitDown = true;
			}
		}
	}
	
	// Check if any tiles has a player on it, and kill that player
	for(var i = 0; i < explosionTiles.length; i++) {
		for (var j = 0; j < players.length; j++) {
			if (explosionTiles[i].X == players[j].X && explosionTiles[i].Y == players[j].Y) {
				--players[j].lives;
				if(player != players[j])
					player.score += 1000;
				if(players[j].lives == 0)
					players[j].alive = false;
			}
		}
	}
	
	setTimeout(function() {
		// Reset explosion tiles to empty
		for(var i = 0; i < explosionTiles.length; i++) {
			var x = explosionTiles[i].X, y = explosionTiles[i].Y;
			if (tiles[x/16][y/16].Type == 'extra-bomb' || tiles[x/16][y/16].Type == 'fire') {
				clearPowerClock(x/16, y/16);
			}
			tiles[x/16][y/16] = new Tile(context, 'empty', emptyImg, 52, 1, 16, 16, x, y, 16, 16);
			tiles[x/16][y/16].Draw();
			drawPlayers();
		}
		
		// Check destroyed walls for powerups
		for(var j = 0; j < powerupTiles.length; j++) {
			if(rollPowerup()) createPowerup(powerupTiles[j].X/16, powerupTiles[j].Y/16);
		}
	}
	,1000);
}

function getTileSrc(imageSrc, ctx) {
	var index = ctx.canvas.baseURI.indexOf('index.html');
	fileName = ctx.canvas.baseURI.slice(0 , index);
	fileName += 'images/' + imageSrc;
	return fileName;
};

function loadMap1() {
	for (var x = 0; x < canvas.width/16; x++) {
		for (var y = 0; y < canvas.height/16; y++) {
			// top or bottom wall:
			if (y === 0 || y === (canvas.height/16)-1) {
				tiles[x][y] = new Tile(context, 'wall', wallImg, 1, 1, 16, 16, x*16, y*16, 16, 16);
			}
			// for rows with dispersed strong walls:
			else if ((y%2) === 0) {
				// Draws Solid Wall:
				if ((x%2) === 0) {
					tiles[x][y] = new Tile(context, 'wall', wallImg, 1, 1, 16, 16, x*16, y*16, 16, 16);
				}
				// Draws Destroyable Wall:
				else if ((y > 2 && y < (canvas.height/16)-3) || (x > 1 && x < (canvas.width/16)-2)) {
					tiles[x][y] = new Tile(context, 'destroyableWall', wallImg, 18, 1, 16, 16, x*16, y*16, 16, 16);	
				}
				// Draws Background Tile:
				else {
					tiles[x][y] = new Tile(context, 'empty', emptyImg, 52, 1, 16, 16, x*16, y*16, 16, 16);
				}
			}
			// for rows with only side strong walls:
			else if ((y%2) != 0) {
				// Draws Solid Wall:
				if (x === 0 || x === (canvas.width/16)-1) {
					tiles[x][y] = new Tile(context, 'wall', wallImg, 1, 1, 16, 16, x*16, y*16, 16, 16);
				}
				// Draws Destroyable Wall:
				else if ((x > 1 && x < (canvas.width/16)-2 && y > 1 && y < (canvas.height/16)-2) || 
					(x > 2 && x < (canvas.width/16)-3) || 
					(y > 2 && y < (canvas.height/16)-3)) {
					tiles[x][y] = new Tile(context, 'destroyableWall', wallImg, 18, 1, 16, 16, x*16, y*16, 16, 16);	
				} 
				// Draws Background Tile:
				else {
					tiles[x][y] = new Tile(context, 'empty', emptyImg, 52, 1, 16, 16, x*16, y*16, 16, 16);
				}
			}
		}
	}
	drawTiles();
}

document.addEventListener('keydown', function(event) {
	if(gameStarted) {
		var p1 = players[0];
		var x1 = p1.X/16, y1 = p1.Y/16;

		var p2 = players[1];
		var x2 = p2.X/16, y2 = p2.Y/16;
		if(!gameEnded) {
			if(event.keyCode == 37) {
				if (!checkWall(x1 - 1, y1)) { // p1 move left
					tiles[x1][y1].Draw();
					p1.Move('left');
					checkPickup(p1);
					drawPlayers();
					if(checkFire(x1 - 1, y1)) {
						--p1.lives;
						if (p1.lives == 0) {
							p1.alive = false;
						}
					}
				}
			}
			else if(event.keyCode == 39) {
				if (!checkWall(x1 + 1, y1)) { // p1 move right
					tiles[x1][y1].Draw();
					p1.Move('right');
					checkPickup(p1);
					drawPlayers();
					if(checkFire(x1 + 1, y1)) {
						--p1.lives;
						if (p1.lives == 0) {
							p1.alive = false;
						}
					}
				}
			}
			else if(event.keyCode == 38) {
				if (!checkWall(x1, y1 - 1)) { // p1 move up
					tiles[x1][y1].Draw();
					p1.Move('up');
					checkPickup(p1);
					drawPlayers();
					if(checkFire(x1, y1 - 1)) {
						--p1.lives;
						if (p1.lives == 0) {
							p1.alive = false;
						}
					}
				}
			}
			else if(event.keyCode == 40) {
				if (!checkWall(x1, y1 + 1)) { // p1 move down
					tiles[x1][y1].Draw();
					p1.Move('down');
					checkPickup(p1);
					drawPlayers();
					if(checkFire(x1, y1 + 1)) {
						--p1.lives;
						if (p1.lives == 0) {
							p1.alive = false;
						}
					}
				}
			}
			else if(event.keyCode == 65) { // player 2 moving left
				if (!checkWall(x2-1, y2)) {
					tiles[x2][y2].Draw();
					p2.Move('left');
					checkPickup(p2);
					drawPlayers();
					if(checkFire(x2 - 1, y2)) {
						--p2.lives;
						if (p2.lives == 0) {
							p2.alive = false;
						}
					}
				}
			}
			else if(event.keyCode == 68) { // player 2 moving right
				if (!checkWall(x2+1, y2)) {
					tiles[x2][y2].Draw();
					p2.Move('right');
					checkPickup(p2);
					drawPlayers();
					if(checkFire(x2 + 1, y2)) {
						--p2.lives;
						if (p2.lives == 0) {
							p2.alive = false;
						}
					}
				}
			}
			else if(event.keyCode == 87) { // player 2 moving up
				if (!checkWall(x2, y2-1)) {
					tiles[x2][y2].Draw();
					p2.Move('up');
					checkPickup(p2);
					drawPlayers();
					if(checkFire(x2, y2 - 1)) {
						--p2.lives;
						if (p2.lives == 0) {
							p2.alive = false;
						}
					}
				}
			}
			else if(event.keyCode == 83) { // player 2 moving down
				if (!checkWall(x2, y2+1)) {
					tiles[x2][y2].Draw();
					p2.Move('down');
					checkPickup(p2);
					drawPlayers();
					if(checkFire(x2, y2 + 1)) {
						--p2.lives;
						if (p2.lives == 0) {
							p2.alive = false;
						}
					}
				}
			}
			// Player 1 bomb key
			else if(event.keyCode == 16 && players[0].alive) { // shift key
				dropBomb(p1);
			}
			// Player 2 bomb key
			else if(event.keyCode == 32 && players[1].alive) { // space key
				dropBomb(p2);
			}
		}
	}
});

function checkPickup(player) {
	var x = player.X/16, y = player.Y/16;
	
	if (tiles[x][y].Type === 'extra-bomb') {
		player.score += 220;
		updateHud();
		++player.bombCount;
		++player.maxBombCount;
		clearPowerup(x, y, player);
	}
	// For use in later versions of game:
	else if (tiles[x][y].Type === 'skate') {
		// speed increase?
		clearPowerup(x, y, player);
	}
	// For use in later versions of game:
	else if (tiles[x][y].Type === 'kick') {
		player.canKick = true;
		clearPowerup(x, y, player);
	}
	// For use in later versions of game:
	else if (tiles[x][y].Type === 'glove') {
		// not sure what this does
		clearPowerup(x, y, player);
	}
	else if (tiles[x][y].Type === 'fire') {
		player.score += 220;
		updateHud();
		player.bombSize++;
		clearPowerup(x, y, player);
	}
	// For use in later versions of game:
	else if (tiles[x][y].Type === 'disease') {
		// disease effect for player?
		clearPowerup(x, y, player);
	}
	// For use in later versions of game:
	else if (tiles[x][y].Type === 'crane') {
		// allow player to pickup other player's bombs?
		player.canPickup = true;
		clearPowerup(x, y, player);
	}
}

function clearBombClock(bomb) {
	var index = bomb.ClockIndex;
	clearInterval(bombclocks['bombClock' + index]);
}

function clearPowerup(x, y, player) {
	clearPowerClock(x,y);
	tiles[x][y] = new Tile(context, 'empty', emptyImg, 52, 1, 16, 16, player.X, player.Y, 16, 16);
	tiles[x][y].Draw();
	player.Draw();
}

function clearPowerClock(x, y) {
	clearInterval(powclock['powClock' + tiles[x][y].ClockIndex]);
}

function checkWall(x, y) {
	if (tiles[x][y].isSolid) {
		return true;
	}
	return false;
}

function checkFire(x, y) {
	if (tiles[x][y].Type == 'explosion') {
		return true;
	}
	return false;
}