canvas = document.getElementById('gameCanvas');
context = canvas.getContext('2d');

var tiles = new Array(); // all tiles in game
var players = new Array();
var changedTiles = new Array(); // tiles that have been changed

var clock;

var imageObj = new Image();

canvas.style.border = "black 1px solid";
startup();

function startup() {  
    if (context) {
    	// 13 x 13 tiles at 16 px each.. We could make this larger if we want
        canvas.width = "208";
        canvas.height = "208";
    }

    loadMap1Stuff();

    //use setInteval for game loop?
    clock = self.setInterval(function() {
    	console.log('hi');
    }, 1000);
}

function stopClock() {
	clock = clearInterval(clock);
}

function drawAllTiles() {
	for (var i = 0; i < gameTiles.length; i++) {
		gameTiles[i].Draw();
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
	for (var x = 0; x < canvas.width/16; x++) {
		for (var y = 0; y < canvas.height/16; y++) {
			// top or bottom wall:
			if (y === 0 || y === (canvas.width/16)-1) {
				gameTiles.push(new Tile(context, imageObj, 1, 1, 16, 16, x*16, y*16, 16, 16));
				// drawWallTile(img, x, y);
			}
			// for rows with dispersed walls:
			else if ((y%2) === 0) {
				if ((x%2) === 0) {
					gameTiles.push(new Tile(context, imageObj, 1, 1, 16, 16, x*16, y*16, 16, 16));
					// drawWallTile(img, x, y);
				}
			}
			// for rows with only side walls:
			else if ((y%2) != 0) {
				if (x === 0 || x === (canvas.height/16)-1) {
					gameTiles.push(new Tile(context, imageObj, 1, 1, 16, 16, x*16, y*16, 16, 16));
					// drawWallTile(img, x, y);
				}
			}
		}
	}
	drawAllTiles();
}

function drawWallTile(img, x, y) {
	//context.drawImage(img, 1, 1, 16, 16, x*16, y*16, 16, 16);
}