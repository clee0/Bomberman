Player = function(ctx, imageObj, x, y, wx, wy, offx, offy, newwx, newwy)
{
	debugger;
	// _getTileSrc = function(imageSrc, scope) {
	// 	index = scope.Context.canvas.baseURI.indexOf('index.html');
	// 	fileName = scope.Context.canvas.baseURI.slice(0 , index); // includes final '/' but excludes 'index.html'
	// 	fileName += 'images/' + imageSrc;
	// 	return fileName;
	// };

	this.imageObj = imageObj
	// var X = x, Y = y, Wx = wx, Wy = wy, offsetX = offx, offsetY = offy, newWidthX = newwx, newWidthY = newwy;
	this.X = x;   this.offsetX = offx;
	this.Y = y;   this.offsetY = offy;
	this.Wx = wx; this.newWidthX = newwx;
	this.Wy = wy; this.newWidthY = newwy;
	this.Context = ctx;
	
	this.drawable = false;

	this.Draw = function() {
		// possibly this.X = imageIndex * 18 && this.Y = 1...?
		this.Context.drawImage(this.imageObj, this.X, this.Y, this.Wx, this.Wy, 
			this.offsetX, this.offsetY, this.newWidthX, this.newWidthY);
	};

	this.Move = function(dir) {
		// if (dir === 'left') {

		// } else if (dir === 'right') {

		// } else if (dir === 'down') {

		// } else if (dir === 'up') {

		// }
	}
};