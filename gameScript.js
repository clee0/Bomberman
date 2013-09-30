canvas = document.getElementById('gameCanvas');
context = canvas.getContext('2d');

var tiles = new Array(13); // all tiles in game

for (var i = 0; i < 13; i++) {
	tiles[i] = new Array(13);
}

var changedTiles = new Array(); // tiles that have been changed

var clock;

var wallImg = new Image();
var player1Img = new Image();
var emptyImg = new Image();

canvas.style.border = "black 1px solid";
startup();

var players = new Array();

function stopClock() {
	clock = clearInterval(clock);
}

//use setInteval for game loop?
 clock = self.setInterval(function() {
	
 }, 1000);

function startup() {  
    if (context) {
    	// 13 x 13 tiles at 16 px each.. We could make this larger if we want
        canvas.width = (tiles.length*16).toString();
        canvas.height = (tiles[0].length*16).toString();
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

	        // this next line can be removed.
	        // only here to prove the image was loaded.
	        document.body.appendChild(e.target);

	        // notify that we're done.
	        onComplete(items, i);
	    }
	    var img = new Image();
	    img.addEventListener("load", onLoad, false);
	    img.src = items[i];
	}

	var items = [player1Img.src = getTileSrc('Player assets/playersheet1.jpg'),
				 wallImg.src = getTileSrc('maptiles/maptiles.jpg'),
				 emptyImg.src = getTileSrc('empty.jpg')];

	loader(items, loadImage, function() {
		loadMap1();
	});
}

function addPlayers() {
	// add Player 1
	players[0] = new Player(context, player1Img, 18, 1, 16, 25, 1*16, 1*16, 16, 16);
	// players.push(new Player(context, player1Img, 18, 1, 16, 25, 1*16, 1*16, 16, 16));
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

function getTileSrc(imageSrc) {
	var index = context.canvas.baseURI.indexOf('index.html');
	fileName = context.canvas.baseURI.slice(0 , index); // includes final '/' but excludes 'index.html'
	fileName += 'images/' + imageSrc;
	return fileName;
};

function loadMap1() {
	for (var x = 0; x < canvas.width/16; x++) {
		for (var y = 0; y < canvas.height/16; y++) {
			// top or bottom wall:
			if (y === 0 || y === (canvas.width/16)-1) {
				tiles[x][y] = new Tile(context, 'wall', wallImg, 1, 1, 16, 16, x*16, y*16, 16, 16);
			}
			// for rows with dispersed walls:
			else if ((y%2) === 0) {
				if ((x%2) === 0) {
					tiles[x][y] = new Tile(context, 'wall', wallImg, 1, 1, 16, 16, x*16, y*16, 16, 16);
				} else {
					tiles[x][y] = new Tile(context, 'empty', emptyImg, 1, 1, 16, 16, x*16, y*16, 16, 16);
				}
			}
			// for rows with only side walls:
			else if ((y%2) != 0) {
				if (x === 0 || x === (canvas.height/16)-1) {
					tiles[x][y] = new Tile(context, 'wall', wallImg, 1, 1, 16, 16, x*16, y*16, 16, 16);
				} else {
					tiles[x][y] = new Tile(context, 'empty', emptyImg, 1, 1, 16, 16, x*16, y*16, 16, 16);
				}
			}
		}
	}
	drawTiles();
}

// Constructor for tile objects
// Types: wall, space, explosion
// function tile(type,isSolid,isVisible,isDestroyable,isDeadly) {
// 	this.type=type;
// 	this.isSolid=new Boolean(isSolid);
// 	this.isVisible=new Boolean(isVisible);
// 	this.isDestroyable=new Boolean(isDestroyable);
// 	this.isDeadly=new Boolean(isDeadly);
// }

function getTile(x,y) {
	var index = (13*y)+x;
	return tiles[index];
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
});

function checkWall(x, y) {
	if (tiles[x][y].Type === 'wall') {
		return true;
	}
	return false;
}