canvas = document.getElementById('gameCanvas');
context = canvas.getContext('2d');

canvas.style.border = "black 1px solid";
startup();

var tiles = new Array();

function startup() {  
    if (context) {
    	// 13 x 13 tiles at 16 px each.. We should make this larger probably
        canvas.width = "208";
        canvas.height = "208";
    }

    var imageObj = new Image();
	imageObj.src = getTileSrc('/maptiles/maptiles.jpg');
	imageObj.onload = function() {
		// (image, x1, y1, wx, wy, offset x, offset y, wx, wy)
		drawMap1(imageObj);
    };
	
	var playerImg = new Image();
	playerImg.src = getTileSrc('/Player assets/playersheet.jpg');
	playerImg.onload = function() {
		drawPlayer(playerImg,1,11);
	}
}

function getTileSrc(imageSrc) {
	index = context.canvas.baseURI.indexOf('index.html');
	fileName = context.canvas.baseURI.slice(0 , index); // includes final '/' but excludes 'index.html'
	fileName += 'images/' + imageSrc;
	return fileName;
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

function drawMap1(img) {
	for (var x = 0; x < canvas.width/16; x++) {
		for (var y = 0; y < canvas.height/16; y++) {
			// top or bottom wall:
			if (y === 0 || y === (canvas.width/16)-1) {
				drawWallTile(img, x, y);
			}
			// for rows with dispersed walls:
			else if ((y%2) === 0) {
				if ((x%2) === 0) {
					drawWallTile(img, x, y);
				}
			}
			// for rows with only side walls:
			else if ((y%2) != 0) {
				if (x === 0 || x === (canvas.height/16)-1) {
					drawWallTile(img, x, y);
				}
			}
		}
	}
	
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

function drawPlayer(img,x,y) {
	context.drawImage(img, 18,1,16,25,x*16,y*16,16,16);
}