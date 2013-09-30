Bomb = function(imgObj, imgoffsetx, imgoffsety, imgwx, imgwy, newWx, newWy, player) {
	
	this.imgObj = imgObj;
	// var X = x, Y = y, Wx = wx, Wy = wy, offsetX = offx, offsetY = offy, newWidthX = newwx, newWidthY = newwy;
	this.x = player.X;   this.imgOffsetX = imgoffsetx;
	this.y = player.Y;   this.imgOffsetY = imgoffsety;
	this.imgWx = imgwx; this.WidthX = newWx;
	this.imgWy = imgwy; this.WidthY = newWy;
	this.Context = player.Context;
	
	this.size = player.bombSize;
	this.time = 3;
	this.canRemoteDetonate = new Boolean(player.canRemoteDetonate);
	this.hasExploded = false;
	
	this.draw = function() {
		this.Context.drawImage(this.imgObj, this.imgOffsetX, this.imgOffsetY, this.imgWx, this.imgWy, 
			this.x, this.y, this.WidthX, this.WidthY);
	};
	
	this.countdown = function() {
		if(this.time <= 0) {
			this.hasExploded = true;
		}
		else {
			this.time--;
		}
	};
}