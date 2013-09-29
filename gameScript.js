canvas = document.getElementById('gameCanvas');
context = canvas.getContext('2d');

var tiles = new Array(); // all tiles in game
var players = new Array();
var changedTiles = new Array(); // tiles that have been changed

var clock;

var imageObj = new Image();

canvas.style.border = "black 1px solid";
startup();

var tiles = new Array();
var players = new Array();

function stopClock() {
	clock = clearInterval(clock);
}

function startup() {  
    if (context) {
    	// 13 x 13 tiles at 16 px each.. We could make this larger if we want
        canvas.width = "208";
        canvas.height = "208";
    }

    // new setup:
    // loadMap1Stuff();

	imageObj.src = getTileSrc('/maptiles/maptiles.jpg');
	imageObj.onload = function() {
		// (image, x1, y1, wx, wy, offset x, offset y, wx, wy)
		drawMap1(imageObj);
		players[0] = new player(1,11);
		drawPlayer(players[0]);
    };

    //use setInteval for game loop?
    clock = self.setInterval(function() {
    	console.log('hi');
    }, 1000);
	
	/*var playerImg = new Image();
	playerImg.src = getTileSrc('/Player assets/playersheet.jpg');
	playerImg.onload = function() {
		drawPlayer(playerImg,1,11);
		players[0] = new player(1,11);
	}*/
}

function drawAllTiles() {
	for (var i = 0; i < tiles.length; i++) {
		tiles[i].Draw();
	}
}

function loadMap1Stuff() {
	imageObj.src = "file://localhost/Users/abeaman/Bomberman/images/maptiles/maptiles.jpg";
	imageObj.onload = function() {
		loadMap1();
		// (image, x, y, Wx, Wy, offsetX, offsetY, Wx, Wy)
		// drawMap1(imageObj);
		// context2.drawImage(imageObj2, 1, 1, 16, 16, x*16, y*16, 16, 16);
 	};
}

function loadMap1() {

}

// Constructor for tile objects
// Types: wall, space, explosion
function tile(type,isSolid,isVisible,isDestroyable,isDeadly) {
	this.type=type;
	this.isSolid=new Boolean(isSolid);
	this.isVisible=new Boolean(isVisible);
	this.isDestroyable=new Boolean(isDestroyable);
	this.isDeadly=new Boolean(isDeadly);
}

function getTile(x,y) {
	var index = (13*y)+x;
	return tiles[index];
}

function player(locx, locy) {
	this.locx = locx;
	this.locy = locy;
}

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        var targetTile = getTile(players[0].locx-1, players[0].locy);
		if(targetTile.isSolid == 0) {
			drawEmpty(players[0].locx, players[0].locy);
			players[0].locx--;
			drawPlayer(players[0]);
		}	
    }
    else if(event.keyCode == 39) {
		var targetTile = getTile(players[0].locx+1, players[0].locy);
		if(targetTile.isSolid == 0) {
			drawEmpty(players[0].locx, players[0].locy);
			players[0].locx++;
			drawPlayer(players[0]);
		}
    }
	else if(event.keyCode == 38) {
		var targetTile = getTile(players[0].locx, players[0].locy-1);
		if(targetTile.isSolid == 0) {
			drawEmpty(players[0].locx, players[0].locy);
			players[0].locy--;
			drawPlayer(players[0]);
		}
	}
	else if(event.keyCode == 40) {
		var targetTile = getTile(players[0].locx, players[0].locy+1);
		if(targetTile.isSolid == 0) {
			drawEmpty(players[0].locx, players[0].locy);
			players[0].locy++;
			drawPlayer(players[0]);
		}
	}
});

function drawMap1(img) {
	for (var x = 0; x < canvas.width/16; x++) {
		for (var y = 0; y < canvas.height/16; y++) {
			// top or bottom wall:
			if (y === 0 || y === (canvas.width/16)-1) {
				tiles.push(new Tile(context, imageObj, 1, 1, 16, 16, x*16, y*16, 16, 16));
				// drawWallTile(img, x, y);
			}
			// for rows with dispersed walls:
			else if ((y%2) === 0) {
				if ((x%2) === 0) {
					tiles.push(new Tile(context, imageObj, 1, 1, 16, 16, x*16, y*16, 16, 16));
					// drawWallTile(img, x, y);
				}
			}
			// for rows with only side walls:
			else if ((y%2) != 0) {
				if (x === 0 || x === (canvas.height/16)-1) {
					tiles.push(new Tile(context, imageObj, 1, 1, 16, 16, x*16, y*16, 16, 16));
					// drawWallTile(img, x, y);
				}
			}
		}
	}
	drawAllTiles();
}

function drawWallTile(img, x, y) {
	//context.drawImage(img, 1, 1, 16, 16, x*16, y*16, 16, 16);
	
	// Fill in all non-walls with a "space" tile
	for (var y = 0; y < canvas.height/16; y++) {
		for (var x = 0; x < canvas.width/16; x++) {
			var index = (13*y)+x;
			if(tiles[index] == null) {
				tiles[index] = new tile("space",0,1,0,0);
			}
		}
	}
}

function drawWallTile(img, x, y) {
	context.drawImage(img, 1, 1, 16, 16, x*16, y*16, 16, 16);
	
	// Create a "wall" tile at this location
	var index = (13*y)+x;
	tiles[index] = new tile("wall",1,1,0,0);
}

function drawPlayer(player) {
	var playerImg = new Image();
	playerImg.src = getTileSrc('/Player assets/playersheet.jpg');
	playerImg.onload = function() {
		context.drawImage(playerImg, 18,1,16,25,player.locx*16,player.locy*16,16,16);
	}
}

function drawEmpty(x,y) {
	var img = new Image();
	img.src = getTileSrc('/empty.jpg');
	img.onload = function() {
		context.drawImage(img, 1, 1, 16, 16, x*16, y*16, 16, 16);
	}
}