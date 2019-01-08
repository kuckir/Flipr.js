	
	function Book(cID, w, h, urls)
	{
		var st = new Stage(cID);
		this.stage = st;
							
		this.model	= new Model(w, h, urls);
		this.view	= new View(this.model);
		this.clr	= new Controller(this.model, this.view);
		
		st.addEventListener2(Event.RESIZE, this.onRes, this);
		st.addChild(this.view);
		this.onRes(null);
	}
	
	Book.prototype.onRes = function(e)
	{
		this.clr.resize(this.stage.stageWidth, this.stage.stageHeight);
	}
	
	