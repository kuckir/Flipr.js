	
	function Controller(m, v)
	{
		Controller.cur = this;
	
		this.model = m;
		this.view = v;
		this.start = 0;			// click started on left / right side
		this.moviePage = false;	// if mouse is down
		this.finishing = false;
		this.m = new Point(0,0); // mouse
		this.p = new Point(0,0); // corner point
		this.tp = new Point(m.width, m.height);	// target point
		
		this.view.drawBook(null);
		
		this.view.addEventListener2(Event.ADDED_TO_STAGE, this.onATS, this);
		
		//this.loadClients();
	}
	
	Controller.prototype.onATS = function(e)
	{
		var st = this.view.stage;
		st.addEventListener2(MouseEvent.MOUSE_DOWN, this.viewMD, this);
		st.addEventListener2(MouseEvent.MOUSE_UP  , this.viewMU, this);
		st.addEventListener2(MouseEvent.MOUSE_MOVE, this.viewMM, this);
			
		st.addEventListener2(KeyboardEvent.KEY_DOWN, this.onKD, this);
		st.addEventListener2(Event.ENTER_FRAME, this.viewEF, this);
	}
	
	Controller.prototype.resize = function(w, h)
	{
		this.view.resize(w, h);
	}
	
	Controller.prototype.onKD = function(e)
	{
		if(e.keyCode == 37) this.flipBack();
		if(e.keyCode == 39) this.flipFront();
	}
	
	Controller.prototype.loadClients = function()
	{
		var request = new XMLHttpRequest();  
		request.onload = this.checkClients;
		request.open('GET', 'http://flipr.ivank.net/clients.php'); 		
		request.send();
	}
	
	Controller.prototype.checkClients = function(e)
	{
		var clients = e.target.response.split("\n");
		var domain = window.location.href;
		var allowed = false;
		for(var i=0; i<clients.length; i++)
		{
			if(clients[i].length >2) allowed = allowed || (domain.indexOf(clients[i])>-1);
		}
		
		if(true) Controller.cur.view.officBTN.visible = false;
		
	}
	
	Controller.prototype.finishFlip = function()	// d = 0/1
	{
		if(! this.finishing) return;
		
		var p = this.p;
		this.finishing = false;
		if(p.x<0 && this.start==1) this.model.FlipForward();
		if(p.x>0 && this.start==0) this.model.FlipBack();
		this.view.drawBook(null, 0);
	}
	
	Controller.prototype.viewMD = function(e)
	{
		var mod = this.model;
		this.m.setTo(this.view.book.mouseX, this.view.book.mouseY);
		
		if(Math.abs(this.m.x)>mod.width)
		{
			if(this.m.x < 0) this.flipBack();
			if(this.m.x > 0) this.flipFront();
			return;
		}
		this.finishFlip();
		this.start = this.m.x<0 ? 0 : 1;
		this.movePage = true;
		this.viewMM(null);
	}
	
	Controller.prototype.flipFront = function()	{
		var mod = this.model;
		this.finishFlip();
		if(mod.current<mod.numOfPages-1){this.tp.x = -this.model.width; this.start = 1; this.finishing = true; }	
		this.p.y = 0.5*mod.height;
		this.p.x = -this.tp.x;
	}
	Controller.prototype.flipBack  = function()	{
		var mod = this.model;
		this.finishFlip();
		if(mod.current>0)				{this.tp.x =  this.model.width; this.start = 0; this.finishing = true; }
		this.p.y = 0.5*mod.height;
		this.p.x = -this.tp.x;
	}
	
	Controller.prototype.viewMU = function(e)
	{
		if(this.movePage) 
		{
			this.finishing = true; this.p.x = this.m.x; this.p.y = this.m.y;
			this.tp.x = (this.m.x>0) ? this.model.width : -this.model.width;
		}
		this.movePage = false;
	}
	
	Controller.prototype.viewMM = function(e)
	{
		var m = this.m;
		m.x = this.view.book.mouseX;
		m.y = Math.min(this.view.book.mouseY, this.model.height);
		if(this.movePage) this.view.drawBook(m, this.start);
	}
	
	Controller.prototype.viewEF = function(e)
	{
		var p = this.p, tp = this.tp;
		if(this.finishing)
		{
			p.x = (5*p.x+tp.x)/6;
			p.y = (5*p.y+tp.y)/6;
			this.view.drawBook(p, this.start);
			if(Point.distance(p, tp)<3) this.finishFlip();
		}
	}
	
	
	