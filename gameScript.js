canvas = document.getElementById('gameCanvas');
context = canvas.getContext('2d');

canvas.style.border = "black 1px solid";
drawMap();

function drawMap() {  
    if (context) {
    	// 12 x 12 tiles at 16 px each.. We should make this larger probably
        canvas.width = "192";
        canvas.height = "192";
    }

    var imageObj = new Image();

	imageObj.onload = function() {
	    context.drawImage(imageObj, 0,0);
    };
    imageObj.src = getTileSrc('/maptiles/maptiles.jpg');
	// imageObj.src = 'file://localhost/Users/abeaman/Bomberman/images/maptiles/maptiles.jpg';
}

function getTileSrc(imageSrc) {
	index = context.canvas.baseURI.indexOf('index.html');
	fileName = context.canvas.baseURI.slice(0 , index); // includes final '/' but excludes 'index.html'
	fileName += 'images/' + imageSrc;
	return fileName;
}