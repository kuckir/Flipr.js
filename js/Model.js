	
	function Model(w, h, urls)
	{
		this.width	= w;
		this.height	= h;
		this.images	= [];
		this.numOfPages	= urls.length;
		this.current = 0;	// number of current page on the left side
		
		for(var i=0; i<urls.length; i++)
			this.images.push(new BitmapData(urls[i], 1));
	}
	
	Model.prototype.FlipForward = function()
	{
		this.current = Math.min(this.current+2, this.numOfPages);
	}
	
	Model.prototype.FlipBack = function()
	{
		this.current = Math.max(this.current-2, 0);
	}
	