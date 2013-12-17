var catalyst = catalyst || {};
catalyst.yahtzee = catalyst.yahtzee || {};

catalyst.yahtzee.Dice = (function () {

	function Dice(sides) {

		var value = 1,
			locked = false;

		this.roll = function () {
			value = ((Math.random() * sides) << 0) +1;
			return this.value();
		}
		this.value = function () {
			return value;
		}

		this.setValue = function (newValue) {
			value = newValue;
		}

		this.setLocked = function (state) {
			locked = state;
		}
		this.isLocked = function () {
			return locked;
		}

	}

	return Dice;
})();
