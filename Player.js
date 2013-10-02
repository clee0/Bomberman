Player = function(ctx, imageObj, imgoffsetx, imgoffsety, imgwx, imgwy, x, y, newWx, newWy, name)
{
	this.X = x;          this.imgOffsetX = imgoffsetx;
	this.Y = y;          this.imgOffsetY = imgoffsety;
	this.imgWx = imgwx;  this.WidthX = newWx;
	this.imgWy = imgwy;  this.WidthY = newWy;
	this.Context = ctx;  this.imageObj = imageObj
	
	// default values - can be changed by powerups
	this.maxBombCount = 1;
	this.bombCount = 1;
	this.bombSize = 2;
	this.bombTime = 3;
	this.canRemoteDetonate = false;
	this.canKick = false;
	this.canPickup = false;
	this.alive = true;
	
	this.lives = 3;
	this.score = 0;
	
	this.drawable = false;
	this.name = name;

	this.Draw = function() {
		// possibly this.X = imageIndex * 18 && this.Y = 1...?
		
		// Only draw player if player is alive
		if(this.alive) {
			this.Context.drawImage(this.imageObj, this.imgOffsetX, this.imgOffsetY, this.imgWx, this.imgWy, 
				this.X, this.Y, this.WidthX, this.WidthY);
		}
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