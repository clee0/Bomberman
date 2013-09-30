Player = function(ctx, imageObj, imgoffsetx, imgoffsety, imgwx, imgwy, x, y, newWx, newWy, bombSize, bombTime, canRemoteDetonate)
{
	this.X = x;          this.imgOffsetX = imgoffsetx;
	this.Y = y;          this.imgOffsetY = imgoffsety;
	this.imgWx = imgwx;  this.WidthX = newWx;
	this.imgWy = imgwy;  this.WidthY = newWy;
	this.Context = ctx;  this.imageObj = imageObj
	
	this.bombCount = 1;
	this.bombSize = bombSize;
	this.canRemoteDetonate = new Boolean(canRemoteDetonate);
	this.canKick = false;
	
	this.drawable = false;

	this.Draw = function() {
		// possibly this.X = imageIndex * 18 && this.Y = 1...?
		this.Context.drawImage(this.imageObj, this.imgOffsetX, this.imgOffsetY, this.imgWx, this.imgWy, 
			this.X, this.Y, this.WidthX, this.WidthY);
	};

	this.Move = function(dir) {
		if (dir === 'left') {
			this.X -= 16;
		} else if (dir === 'right') {
			this.X += 16;
		} else if (dir === 'down') {
			this.Y += 16;
		} else if (dir === 'up') {
			this.Y -= 16;
		}
	}
};