canvas = document.getElementById('gameCanvas');
context = canvas.getContext('2d');

hudCanvas = document.getElementById('hudCanvas');
hudContext = hudCanvas.getContext('2d');

canvas.style.border = "black 1px solid";
hudCanvas.style.border = "black 1px solid";

var changedTiles = new Array(); // tiles that have been changed
var explImg = new Array();
var tiles = new Array(13); // all tiles in game
for (var i = 0; i < 13; i++) {
	tiles[i] = new Array(13);
}
var players = new Array();
var bombs = new Array();
var types = new Array('extra-bomb', 'skate', 'kick', 'glove', 'fire', 'disease', 'crane');

var clock;
var TO_RADIANS = Math.PI/180;

var clockone = new Image();
var clocktwo = new Image();
var clockmid = new Image();
var wallImg = new Image();
var player1Img = new Image();
var emptyImg = new Image();
var bombImg = new Image();
var twoHudImg = new Image();
var powerupImg = new Image();
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

startup();

// TODO: give names to players so we know who wins at the end?

function smallClockUpdate(){
	var currentTime = new Date();
	var currentSeconds = currentTime.getSeconds();
	modTime = (currentSeconds%8)
	//console.log(modTime);
	updateSmallClock(modTime);
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

//use setInteval for game loop?
clock = self.setInterval(function() {
	smallClockUpdate();
	// for(var i = 0; i < bombs.length; i++) {
	// 	if(bombs[i].hasExploded) {
	// 		// TODO: Call function to explode bomb
	// 		explodeBomb(bombs[i]);
	// 		bombs.splice(i,1);
	// 	}
	// 	else {
	// 		bombs[i].countdown();
	// 		//bombs[i].draw();
	// 	}
	// }
 }, 1000);

function startup() {
    if (context) {
    	// 13 x 13 tiles at 16 px each.. We could make this larger if we want
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
		player1Img.src = getTileSrc('Player assets/playersheet2.png', context),
		wallImg.src = getTileSrc('maptiles/maptiles.jpg', context),
		emptyImg.src = getTileSrc('maptiles/maptiles.jpg', context),
		bombImg.src = getTileSrc('bombs/bombs.jpg', context),
		twoHudImg.src = getTileSrc('Hud/twoplayerhud.png', hudContext),
		powerupImg.src = getTileSrc('powerups/powerups.jpg', context),
		twoHudImg.src = getTileSrc('Hud/twoplayerhud.png', hudContext),
		clockone.src = getTileSrc('Hud/clockone.png',hudContext),
		clocktwo.src = getTileSrc('Hud/clocktwo.png',hudContext),
		clockmid.src = getTileSrc('Hud/clockmid.png',hudContext),

		// explImg[0].src = getTileSrc('bombs/bombcenter.png', context),
		// explImg[1].src = getTileSrc('bombs/bombmid.png', context),
		// explImg[2].src = getTileSrc('bombs/bombend.png', context),

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
		//startFakePowerups();
	});
}

function startFakePowerups() {
	// create powerup at x=1, y=2 on tile grid
	createPowerup(1,2);
	// create powerup at x=2, y=1 on tile grid
	createPowerup(2,1);
	createPowerup(3,1);
	createPowerup(3,2);
	createPowerup(3,3);
	createPowerup(3,4);
	createPowerup(3,5);
	createPowerup(3,6);
	createPowerup(3,7);
	createPowerup(3,8);
	createPowerup(3,9);
}

function createPowerup(x, y) {
	var index = Math.floor(Math.random() * types.length);
	var tileType = types[index]; // from stack overflow

	offsetX = 3 + (index * 17);

	tiles[x][y] = new Tile(context, tileType, powerupImg, offsetX, 3, 16, 16, x*16, y*16, 16, 16, powclock.Index);
	tiles[x][y].Draw();

	var Name = 'powClock' + powclock.Index;
	++powclock.Index;
	powclock[Name] = setInterval(function() {
		tiles[x][y].shiftImg();
	}, 400);
}

function loadHud() {
	hudContext.drawImage(twoHudImg, 0, 0, 256, 32, 0, 0, 256,32);
}

function loadSmallClock() {	
	hudContext.drawImage(clockone,0,0,3,3,127,15,3,3); //top
}

function addPlayers() {
	// add Player 1
	players[0] = new Player(context, player1Img, 18, 1, 16, 23, 1*16, 1*16, 16, 16, 2, 3, false);
	drawPlayers();
}

function next() {
	// debugger;
}

function drawPlayers() {
	if (players.length != 'undefined') {
		for (var i = 0; i < players.length; i++) {
			players[i].Draw();
		}
	}
	next();
}

function drawTiles() {
	for (var i = 0; i < tiles.length; i++) {
		for (var j = 0; j < tiles[0].length; j++) {
			tiles[i][j].Draw();
		}
	}
	addPlayers();
}

function dropBomb(player) {
	if (player.bombCount > 0) {
		--player.bombCount;
		var tempBomb = new Bomb(bombImg, 0, 0, 14, 18, 16, 16, player, bombclocks.Index);
		var X = tempBomb.x/16; var Y = tempBomb.y/16;

		tiles[X][Y] = new Tile(context, 'bomb', bombImg, 0, 0,
			14, 18, tempBomb.x, tempBomb.y, 16, 16, bombclocks.Index);

		tiles[X][Y].Draw();

		var Name = 'bombClock' + bombclocks.Index;
		++bombclocks.Index;
		bombclocks[Name] = setInterval(function() {
			console.log('bomb',tempBomb.ClockIndex,'still alive');
			if (tempBomb.countdown()) {
				explodeBomb(tempBomb, player);
			}
		}, 400);
	}
}

// 30% to return true (checking if wall drops powerup)
function rollPowerup() {
	// Creates a random number between 0-100
	var rand = Math.floor(Math.random()*101);
	if(rand < 30) {return true;}
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
	var hitLeft = false; var hitRight = false; var hitUp = false; var hitDown = false;
	for(var i = 1; i <= bomb.player.bombSize - 1; i++) {
		if(!hitRight) {
			if(!tiles[locx+i][locy].isSolid) {
				if(i = bomb.player.bombSize - 1)
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
					explosionTiles.push(tiles[locx+i][locy]);
					powerupTiles.push(tiles[locx+i][locy]);
				}
				hitRight = true;
			}
		}
		if(!hitLeft) {
			if(!tiles[locx-i][locy].isSolid) {
				if(i = bomb.player.bombSize - 1)
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
					explosionTiles.push(tiles[locx-i][locy]);
					powerupTiles.push(tiles[locx-i][locy]);
				}
				hitLeft = true;
			}
		}
		if(!hitUp) {
			if(!tiles[locx][locy-i].isSolid) {
				if(i = bomb.player.bombSize - 1)
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
					explosionTiles.push(tiles[locx][locy-i]);
					powerupTiles.push(tiles[locx][locy-i]);
				}
				hitUp = true;
			}
		}
		if(!hitDown) {
			if(!tiles[locx][locy+i].isSolid) {
				if(i = bomb.player.bombSize - 1)
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
					explosionTiles.push(tiles[locx][locy+i]);
					powerupTiles.push(tiles[locx][locy+i]);
				}
				hitDown = true;
			}
		}
	}
	
	setTimeout(function() {
		// Reset explosion tiles to empty
		for(var i = 0; i < explosionTiles.length; i++) {
			tiles[explosionTiles[i].X/16][explosionTiles[i].Y/16] = new Tile(context, 'empty', emptyImg, 52, 1, 16, 16, explosionTiles[i].X, explosionTiles[i].Y, 16, 16);
			tiles[explosionTiles[i].X/16][explosionTiles[i].Y/16].Draw();
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
	fileName = ctx.canvas.baseURI.slice(0 , index); // includes final '/' but excludes 'index.html'
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

function player(locx, locy) {
	this.locx = locx;
	this.locy = locy;
}

document.addEventListener('keydown', function(event) {
	var p1 = players[0];
	var x1 = p1.X/16; var y1 = p1.Y/16;
    if(event.keyCode == 37) {
    	if (!checkWall(x1 - 1, y1)) {
    		tiles[x1][y1].Draw();
    		p1.Move('left');
    		checkPickup(p1);
    		drawPlayers();
    	}
    }
    else if(event.keyCode == 39) {
    	if (!checkWall(x1 + 1, y1)) {
    		tiles[x1][y1].Draw();
	    	p1.Move('right');
	    	checkPickup(p1);
	    	drawPlayers();
	    }
    }
	else if(event.keyCode == 38) {
		if (!checkWall(x1, y1 - 1)) {
			tiles[x1][y1].Draw();
			p1.Move('up');
			checkPickup(p1);
			drawPlayers();
		}
	}
	else if(event.keyCode == 40) {
		if (!checkWall(x1, y1 + 1)) {
			tiles[x1][y1].Draw();
			p1.Move('down');
			checkPickup(p1);
			drawPlayers();
		}
	}
	// Player 1 bomb key
	else if(event.keyCode == 16) {
		dropBomb(p1);
	}
});

function checkPickup(player) {
	var x = player.X/16, y = player.Y/16;
	if (tiles[x][y].Type === 'extra-bomb') {
		// console.log('prev. bomb count:', player.bombCount);
		++player.bombCount;
		clearPowerup(x, y, player);
		// console.log('new bomb count:', player.bombCount);
	} else if (tiles[x][y].Type === 'skate') {
		// speed increase?
		clearPowerup(x, y, player);
	} else if (tiles[x][y].Type === 'kick') {
		// console.log('prev. canKick:', player.canKick);
		player.canKick = true;
		clearPowerup(x, y, player);
		// console.log('now canKick:', player.canKick);
	} else if (tiles[x][y].Type === 'glove') {
		// not sure what this does
		clearPowerup(x, y, player);
	} else if (tiles[x][y].Type === 'fire') {
		// increase blast length?
		clearPowerup(x, y, player);
	} else if (tiles[x][y].Type === 'disease') {
		// disease effect for player?
		clearPowerup(x, y, player);
	} else if (tiles[x][y].Type === 'crane') {
		// allow player to pickup other bombs?
		clearPowerup(x, y, player);
	}
}

function clearBombClock(bomb) {
	var index = bomb.ClockIndex;
	clearInterval(bombclocks['bombClock' + index]);
}

function clearPowerup(x, y, player) {
	clearInterval(powclock['powClock' + tiles[x][y].ClockIndex]);
	tiles[x][y] = new Tile(context, 'empty', emptyImg, 52, 1, 16, 16, player.X, player.Y, 16, 16);
	tiles[x][y].Draw();
	player.Draw();
}

function checkWall(x, y) {
	if (tiles[x][y].isSolid) {
		return true;
	}
	return false;
}
