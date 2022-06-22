; (function () {
	function Vec2(x = 0, y = 0) {
		if (typeof (x) == "object") {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x;
			this.y = y;
		}
		this.add = function (Vec) {
			return new Vec2(this.x + Vec.x, this.y + Vec.y);
		};
		this.onscalar = function (scalar) {
			return new Vec2(this.x * scalar, this.y * scalar);
		};
		this.length = function () {
			return Math.pow(Math.pow(this.x, 2) + Math.pow(this.y, 2), 0.5);
		};
		this.copy = function () {
			return new Vec2(this.x, this.y);
		};
	}
	window.Vec2 = Vec2;
}())