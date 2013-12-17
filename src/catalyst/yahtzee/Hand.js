var catalyst = catalyst || {};
catalyst.yahtzee = catalyst.yahtzee || {};

catalyst.yahtzee.Hand = (function (Dice){

	function createDice(numOfDice, numOfSides) {
		var dice = [];
		for (var index=0; index< numOfDice; index++) {
			dice[index] = new Dice(numOfSides);
		}
		return dice;
	}
	
	function Hand(numOfDice, numOfSides, numOfRolls, View) {
		var dice = createDice(numOfDice, numOfSides),
			self = this,
			rolls = 0,
			deferred = View.getDeferred();

		for (var index=0; index< numOfDice; index++) {
			dice[index] = new Dice(numOfSides);
		}

		View.getRollForm().on('submit', function (event) {

			if (numOfRolls > rolls++) {
				deferred.notify(dice, rolls);
			} else {
				View.getRollForm().prop('disabled', 'true');
				View.setRollMessage("Please choose an option from the score card.");
				deferred.resolve(dice, rolls);
			}

			View.getDice().each(function (index, element) {
				dice[index].setLocked( element.checked );
			});

			roll();
		});

		function roll() {

			if (deferred.state() === 'pending') {
				View.getDice().each(function (index, element) {
					if (!dice[index].isLocked()) {
						dice[index].roll();

						element.setAttribute( 'value', dice[index].value() );
					}
				});
			}
		}

		this.reset = function () {
			View.getDice().attr('checked', null).attr('value', '0');
			View.getRollForm().removeProp('disabled');

			View.setRollMessage('');

			rolls = 0;

			deferred = View.getDeferred();

			return deferred.promise();
		}

		this.getDice = function () {
			return dice;
		}

		this.onRoll = function () {
			if (deferred.state() !== 'pending') {
				deferred = View.getDeferred();
			}

			return deferred.promise();
		}

	}

	return Hand;

})(catalyst.yahtzee.Dice);