	
	var Geom = {};
	
	Geom.limit = function(p, l, cx, cy)
	{
		var dx = p.x-cx;
		var dy = p.y-cy;
		var cl = Math.sqrt(dx*dx + dy*dy);
		var sc = l/cl;
		if(cl>l)
		{
			p.x = cx+dx*sc;
			p.y = cy+dy*sc;
		}
	}
	
	Geom.mid = function(a, b, d)
	{
		//d.x = 0.5*(a.x+b.x);
		//d.y = 0.5*(a.y+b.y);
		return new Point(0.5*(a.x+b.x), 0.5*(a.y+b.y));
	}
	
	Geom.mirror = function(a, p, dir, des)
	{
		if(dir.x == 0) return new Point(p.x - (a.x-p.x), a.y);
		
		var f = dir.y/dir.x;
		var g = p.y - f*p.x;
		var d = (a.x + (a.y - g)*f)/(1 + f*f)
		var x = 2*d - a.x;
		var y = 2*d*f -a.y +2*g;
		
		return new Point(x, y);
	}
	
	Geom.lineIsc = function(a1, a2, b1, b2, d)
	{			
		var dax = (a1.x-a2.x), dbx = (b1.x-b2.x);
		var day = (a1.y-a2.y), dby = (b1.y-b2.y);
				
		var Den = dax*dby - day*dbx;
		if (Den == 0) return false;	// parallel

		var A = (a1.x * a2.y - a1.y * a2.x);
		var B = (b1.x * b2.y - b1.y * b2.x);
			
		d.x = ( A*dbx - dax*B ) / Den;
		d.y = ( A*dby - day*B ) / Den;
		
		return true;
	}