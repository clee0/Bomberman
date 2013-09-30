Tile = function(ctx, type, imageObj, imgoffsetx, imgoffsety, imgwx, imgwy, x, y, newWx, newWy)
{
	// _getTileSrc = function(imageSrc, scope) {
	// 	index = scope.Context.canvas.baseURI.indexOf('index.html');
	// 	fileName = scope.Context.canvas.baseURI.slice(0 , index); // includes final '/' but excludes 'index.html'
	// 	fileName += 'images/' + imageSrc;
	// 	return fileName;
	// };

	if (type === 'wall') {
		this.isSolid = true;
	} else {
		this.isSolid = false;
	}

	this.imageObj = imageObj
	// var X = x, Y = y, Wx = wx, Wy = wy, offsetX = offx, offsetY = offy, newWidthX = newwx, newWidthY = newwy;
	this.X = x;         this.imgOffsetX = imgoffsetx;
	this.Y = y;         this.imgOffsetY = imgoffsety;
	this.imgWx = imgwx; this.WidthX = newWx;
	this.imgWy = imgwy; this.WidthY = newWy;
	this.Context = ctx; this.Type = type;
	
	this.drawable = false;

	this.Draw = function() {
		// possibly this.X = imageIndex * 18 && this.Y = 1...?
		this.Context.drawImage(this.imageObj, this.imgOffsetX, this.imgOffsetY, this.imgWx, this.imgWy, 
			this.X, this.Y, this.WidthX, this.WidthY);
	}
};