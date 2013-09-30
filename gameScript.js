canvas = document.getElementById('gameCanvas');
context = canvas.getContext('2d');

hudCanvas = document.getElementById('hudCanvas');
hudContext = hudCanvas.getContext('2d');

var tiles = new Array(13); // all tiles in game

for (var i = 0; i < 13; i++) {
	tiles[i] = new Array(13);
}

var changedTiles = new Array(); // tiles that have been changed

var clock;

var wallImg = new Image();
var player1Img = new Image();
var emptyImg = new Image();
var bombImg = new Image();
var twoHud = new Image();

var explImg = new Array();
explImg[0] = new Image();
explImg[1] = new Image();
explImg[2] = new Image();

canvas.style.border = "black 1px solid";
hudCanvas.style.border = "black 1px solid";
startup();

var players = new Array();
var bombs = new Array();

function stopClock() {
	clock = clearInterval(clock);
}

//use setInteval for game loop?
 clock = self.setInterval(function() {
	for(var i = 0; i < bombs.length; i++) {
		if(bombs[i].hasExploded) {
			// TODO: Call function to explode bomb
			explodeBomb(bombs[i]);
			
		}
		else {
			bombs[i].countdown();
			//bombs[i].draw();
		}
	}
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
		twoHud.src = getTileSrc('Hud/twoplayerhud.png', hudContext),
		explImg[0].src = getTileSrc('bombs/bombcenter.png', context),
		explImg[1].src = getTileSrc('bombs/bombend.png', context),
		explImg[2].src = getTileSrc('bombs/bombmid.png', context),
	];

	loader(items, loadImage, function() {
		loadHud();
		loadMap1();
	});
}

function loadHud() {
	hudContext.drawImage(twoHud, 0, 0, 256, 32, 0, 0, 256,32);
}

function addPlayers() {
	// add Player 1
	players[0] = new Player(context, player1Img, 18, 1, 16, 23, 1*16, 1*16, 16, 16);
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
	tempBomb = new Bomb(bombImg, 0, 0, 14, 18, 16, 16, player);
	bombs[bombs.length] = tempBomb;
	tiles[tempBomb.x/16][tempBomb.y/16] = new Tile(context, 'bomb', bombImg, 0, 0, 14, 18, tempBomb.x, tempBomb.y, 16, 16);
}

function explodeBomb(bomb) {
	tiles[bomb.x/16][bomb.y/16] = new Tile(context, 'explosion', explImg[0], 0, 2, 12, 12, bomb.x, bomb.y, 16, 16);
	tiles[bomb.x/16][bomb.y/16].Draw();
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
	var x1 = players[0].X/16; var y1 = players[0].Y/16;
    if(event.keyCode == 37) {
    	if (!checkWall(x1 - 1, y1)) {
    		tiles[x1][y1].Draw();
    		players[0].Move('left');
    		drawPlayers();
    	}
    }
    else if(event.keyCode == 39) {
    	if (!checkWall(x1 + 1, y1)) {
    		tiles[x1][y1].Draw();
	    	players[0].Move('right');
	    	drawPlayers();
	    }
    }
	else if(event.keyCode == 38) {
		if (!checkWall(x1, y1 - 1)) {
			tiles[x1][y1].Draw();
			players[0].Move('up');
			drawPlayers();
		}
	}
	else if(event.keyCode == 40) {
		if (!checkWall(x1, y1 + 1)) {
			tiles[x1][y1].Draw();
			players[0].Move('down');
			drawPlayers();
		}
	}
	// Player 1 bomb key
	else if(event.keyCode == 16) {
		dropBomb(players[0]);
	}
});

function checkWall(x, y) {
	if (tiles[x][y].isSolid) {
		return true;
	}
	return false;
}
