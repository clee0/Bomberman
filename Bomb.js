Bomb = function(imgObj, imgoffsetx, imgoffsety, imgwx, imgwy, newWx, newWy, player) {
	
	this.imgObj = imgObj;
	// var X = x, Y = y, Wx = wx, Wy = wy, offsetX = offx, offsetY = offy, newWidthX = newwx, newWidthY = newwy;
	this.x = player.x;   this.imgOffsetX = imgoffsetx;
	this.y = player.y;   this.imgOffsetY = imgoffsety;
	this.imgWx = imgwx; this.WidthX = newWx;
	this.imgWy = imgwy; this.WidthY = newWy;
	this.Context = player.ctx;
	
	this.size = player.bombSize;
	this.time = 3;
	this.canRemoteDetonate = new Boolean(player.canRemoteDetonate);
	this.hasExploded = new Boolean(0);
	
	this.Draw = function() {
		this.Context.drawImage(this.imageObj, this.imgOffsetX, this.imgOffsetY, this.imgWx, this.imgWy, 
			this.x, this.y, this.WidthX, this.WidthY);
	};
	
	this.countdown = function() {
		if(this.time <= 0) {
			this.hasExploded = new Boolean(1);
		}
		else {
			this.time--;
		}
	};
}