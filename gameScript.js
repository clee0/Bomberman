canvas = document.getElementById('gameCanvas');
context = canvas.getContext('2d');

canvas.style.border = "black 1px solid";
startup();

function startup() {  
    if (context) {
    	// 13 x 13 tiles at 16 px each.. We should make this larger probably
        canvas.width = "208";
        canvas.height = "208";
    }

    var imageObj = new Image();

	imageObj.onload = function() {
		// (image, x1, y1, wx, wy, offset x, offset y, wx, wy)
		drawMap1(imageObj);
    };
    imageObj.src = getTileSrc('/maptiles/maptiles.jpg');
}

function getTileSrc(imageSrc) {
	index = context.canvas.baseURI.indexOf('index.html');
	fileName = context.canvas.baseURI.slice(0 , index); // includes final '/' but excludes 'index.html'
	fileName += 'images/' + imageSrc;
	return fileName;
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
}

function drawWallTile(img, x, y) {
	context.drawImage(img, 1, 1, 16, 16, x*16, y*16, 16, 16);
}