Tile = function(ctx, type, imageObj, imgoffsetx, imgoffsety, imgwx, imgwy, x, y, newWx, newWy, powClockIndex)
{
	if (type === 'wall' || type === 'destroyableWall') {
		this.isSolid = true;
	} else {
		this.isSolid = false;
	}

	this.powerupClockIndex = powClockIndex;
	this.imageObj = imageObj
	this.X = x;         this.imgOffsetX = imgoffsetx;
	this.Y = y;         this.imgOffsetY = imgoffsety;
	this.imgWx = imgwx; this.WidthX = newWx;
	this.imgWy = imgwy; this.WidthY = newWy;
	this.Context = ctx; this.Type = type;
	this.imgSlot = 'top';
	
	this.drawable = false;

	this.Draw = function() {
		// possibly this.X = imageIndex * 18 && this.Y = 1...?
		this.Context.drawImage(this.imageObj, this.imgOffsetX, this.imgOffsetY, this.imgWx, this.imgWy, 
			this.X, this.Y, this.WidthX, this.WidthY);
	}

	this.shiftImg = function() {
		if (this.imgSlot === 'top') {
			this.imgOffsetY += 17;
			this.imgSlot = 'bottom';
		} else if (this.imgSlot === 'bottom') {
			this.imgOffsetY -= 17;
			this.imgSlot = 'top';
		}
		this.Draw();
	}
};