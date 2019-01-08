	
	function View(m)
	{
		Sprite.apply(this);
		
		this.model = m;
		this.book = new Sprite();	//this.book.scaleX = this.book.scaleY = 0.8;
		this.addChild(this.book);
		
		var w = this.w = this.model.width;
		var h = this.h = this.model.height;
		
		this.pts = {
			temp: new Point(),
			dir : new Point(),
			m1  : new Point()
		}
		
		//	arrows
		var ar = new Sprite();
		ar.graphics.beginFill(0xcccccc, 1);
		ar.graphics.drawTriangles([-w-35,h/2, -w-20,h/2-20, -w-20,h/2+20,   w+35,h/2, w+20,h/2+20, w+20,h/2-20], [0,1,2, 3,4,5]);
		this.book.addChild(ar);
		
		this.tw = w;//this.nhpot(w);
		this.th = h;//this.nhpot(h);
		
		this.iw = 1/w;
		this.ih = 1/h;
		
		var rx = this.rx = w/this.tw;
		var ry = this.ry = h/this.th;
		
		this.lvrt = [-w,0, 0,0, -w,h, 0,h];
		this.rvrt = [ 0,0, w,0,  0,h, w,h];
		this.ind  = [0,1,2, 1,2,3];
		this.uvt  = [0,0, rx,0, 0,ry, rx,ry];
		
		this.cVrt = [0,0, w,0, 0,h, w,h];		// corner, 4 vertices
		this.cUvt = [0,0, 0,0, 0,0, 0,0];
		this.oVrt = [0,0, w,0, 0,h, w,h];		// opposite corner, 4 vertices
		this.oUvt = [0,0, 0,0, 0,0, 0,0];
		
		this.rVrt = [0,0, w,0, 0,h, w,h, 0,0];	// rest (page - corner), up to 5 vertices
		this.rUvt = [0,0, 0,0, 0,0, 0,0, 0,0];
		this.rInd = [0,1,2, 1,2,3, 1,3,4];
		
		this.zero		= new Point(0, 0);
		this.rTop		= new Point(w, 0);
		this.mBottom	= new Point(0, h);
		this.rBottom	= new Point(w, h);
		
		var tf = new TextFormat("Trebuchet MS", 18, 0xbbbbbb, true);
		var t = this.officBTN = new TextField();
		t.buttonMode = true;
		t.setTextFormat(tf);
		t.text = "made with Flipr";
		t.width = t.textWidth; t.height = t.textHeight;
		t.addEventListener(MouseEvent.MOUSE_DOWN, function(e){window.open("http://flipr.ivank.net", "_blank");});
		//this.addChild(t);
	}
	View.prototype = new Sprite();

	
	View.prototype.resize = function(w, h)
	{
		var w2 = this.model.width*this.model.width;
		var h2 = this.model.height*this.model.height;
		var diag = Math.sqrt(w2+h2);
		
		var rw = w/(this.model.width*2);
		var rh = h/ diag;
		this.book.scaleX = this.book.scaleY = 0.99* Math.min(rw, rh);
	
		this.book.x = w*0.5;
		this.book.y = (h-diag*this.book.scaleX)*0.5 + this.book.scaleX*(diag-this.model.height);
		//else		this.book.y = (h-diag*this.book.scaleX)*0.5;
		
		this.officBTN.x = w - this.officBTN.getRect(this).width- 15;
		this.officBTN.y = h - this.officBTN.getRect(this).height - 15;
	}
	
	View.prototype.drawBook = function(p, start)
	{
		var m = this.model;
		
		this.book.graphics.clear();
		
		if(p==null)
		{
			if(m.current >= 2)				this.drawPage(1);
			if(m.current < m.numOfPages  )	this.drawPage(2);
			return;
		}
		
		if(start==0) if(m.current <  m.numOfPages )	this.drawPage(2);
		if(start==1) if(m.current >= 2)				this.drawPage(1);
		if(start==0) if(m.current <  2)				return;
		if(start==1) if(m.current >= m.numOfPages )	return;
		
		//	D R A W I N G   C O R N E R S
		
		var cv = this.cVrt;			var ct = this.cUvt;		// corner
		var ov = this.oVrt;			var ot = this.oUvt;		// opposite
		var rv = this.rVrt;			var rt = this.rUvt;		// "rest"
		var w = this.model.width;	var h = this.model.height;
		
		p = p.clone();
		Geom.limit(p, w, 0, h);
		if(start==0) p.x *= -1;
		
		if(p.x-w>=-4 && p.y-h>=-4)
		{
			if(m.current >= 2)				this.drawPage(1);
			if(m.current < m.numOfPages  )	this.drawPage(2);
			return;
		}
		
		cv[2] = cv[6] = w; cv[3] = 0; cv[7] = h;
		
		var mid = Geom.mid(p, this.rBottom);
		var dir	= this.pts.dir;	dir.x	= mid.y-p.y;	dir.y	= p.x-mid.x;
		var m1	= this.pts.m1;	m1.x	= mid.x+dir.x;	m1.y	= mid.y+dir.y;
		
		var temp = this.pts.temp, good = false;
		var i0 = temp;
		good = Geom.lineIsc(mid, m1, this.mBottom, this.rBottom, i0);	// bottom side
		if(!good || i0.x<0) i0 = this.mBottom;
		cv[4]=rv[6] = i0.x;  cv[5]=rv[7] = i0.y;
		
		var i1 = temp;
		good = Geom.lineIsc(mid, m1, this.rTop, this.rBottom, i1);	// right side
		if(good && i1.y >0)
		{
			cv[0]=cv[2] = i1.x;  cv[1]=cv[3] = i1.y;
			rv[2]=w; rv[3]=0;  rv[8]=i1.x; rv[9]=i1.y;
		}
		else
		{
			cv[2] = w; cv[3] = 0;
			Geom.lineIsc(mid, m1, this.zero, this.rTop, i1);
			cv[0] = i1.x; cv[1] = i1.y;
			rv[2]=rv[8]=i1.x;  rv[3]=rv[9]= i1.y;
		}
		this.toTex(cv, ct);
		this.toTex(rv, rt);
		
		for(var i=0; i<ov.length; i++) { ov[i]=cv[i]; ot[i]=ct[i]; }
		
		var bd;
		
		// drawing "rest"
		if(start == 0) {this.Transform(rv, 0, -1);  this.Transform(rt, -this.rx, -1);}
		bd = this.model.images[this.model.current+(start==0?-1:0)];
		this.book.graphics.beginBitmapFill(bd);
		this.book.graphics.drawTriangles(rv, this.rInd, rt);
		
		if(!(start==0 && m.current==2) && !(start==1 && m.current==m.numOfPages-2))
		{
			// drawing bottom corner
			if(start == 0) {this.Transform(cv, 0, -1);  this.Transform(ct, -this.rx, -1);}
			bd = this.model.images[this.model.current+(start==0?-3:2)];
			this.book.graphics.beginBitmapFill(bd);
			this.book.graphics.drawTriangles(cv, this.ind, ct);
		}
		
		// drawing opposite corner
		temp.x = ov[2]; temp.y = ov[3];
		var rtMirr = Geom.mirror(temp , mid, dir);
		var rbMirr = Geom.mirror(this.rBottom, mid, dir);

		ov[2]=rtMirr.x; ov[3]=rtMirr.y;
		ov[6]=rbMirr.x; ov[7]=rbMirr.y;
		this.Transform(ot, -this.rx, -1);
		
		if(start == 0) {this.Transform(ov, 0, -1);  this.Transform(ot, -this.rx, -1);}
		bd = this.model.images[this.model.current+(start==0?-2:1)];
		this.book.graphics.beginBitmapFill(bd);
		this.book.graphics.drawTriangles(ov, this.ind, ot);
	}
	
	View.prototype.toTex = function(v, t)
	{
		for(var i=0; i<v.length; i+=2)
		{
			t[i  ]= this.rx*v[i  ]*this.iw;
			t[i+1]= this.ry*v[i+1]*this.ih;
		}
	}
	
	View.prototype.Transform = function(t, trx, scx)
	{
		for(var i=0; i<t.length; i+=2)
			t[i  ]= scx * (t[i]+trx);
	}
	
	View.prototype.drawPage = function(i)
	{
		var m = this.model;
		var gr = this.book.graphics;
		gr.beginBitmapFill(m.images[m.current-2+i]);
		if(i<2)	gr.drawTriangles(this.lvrt, this.ind, this.uvt);
		else	gr.drawTriangles(this.rvrt, this.ind, this.uvt);
	}
	
	View.prototype.nhpot = function(x) 
	{
		--x;
		for (var i = 1; i < 32; i <<= 1)   x = x | x >> i;
		return x + 1;
	}
	