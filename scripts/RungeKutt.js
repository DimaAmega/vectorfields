;(function () {
	var RungKut = function(Fxy,Vec,h) {
		var k1,k2,k3,k4;
		k1 = Fxy(Vec);
		k2 = Fxy([Vec[0] + k1[0]*h/2 , Vec[1] + k1[1]*h/2]);
		k3 = Fxy([Vec[0] + k2[0]*h/2 , Vec[1] + k2[1]*h/2]);
		k4 = Fxy([Vec[0] + k3[0]*h , Vec[1] + k3[1]*h]);    
		return [ Vec[0] + (k1[0] + 2*k2[0] +2*k3[0] + k4[0])*(h/6) , Vec[1] + (k1[1] + 2*k2[1] +2*k3[1] + k4[1])*(h/6) ];
	}
	window.RungKut = RungKut;
}())