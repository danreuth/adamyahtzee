var catalyst = catalyst || {};
catalyst.yahtzee = catalyst.yahtzee || {};

catalyst.yahtzee.ScoreCard = (function (Rules) {
	var UPPER_BONUS_LIMIT = 63,
		UPPER_BONUS_VALUE = 35;

	function ScoreCard(hand, View) {
		var scores = {},
			rollCount = 0,
			scoreCount = 0,
			turnCount = 0,
			deferred = View.getDeferred();

		scores[Rules.NAMES.ACES] = {value:0, onUpdate:upper, played: false};
		scores[Rules.NAMES.TWOS] = {value:0, onUpdate:upper, played: false};
		scores[Rules.NAMES.THREES] = {value:0, onUpdate:upper, played: false};
		scores[Rules.NAMES.FOURS] = {value:0, onUpdate:upper, played: false};
		scores[Rules.NAMES.FIVES] = {value:0, onUpdate:upper, played: false};
		scores[Rules.NAMES.SIXES] =	{value:0, onUpdate:upper, played: false};
		scores[Rules.NAMES.THREE_OF_A_KIND] = {value:0, onUpdate:lower, played: false};
		scores[Rules.NAMES.FOUR_OF_A_KIND] = {value:0, onUpdate:lower, played: false};
		scores[Rules.NAMES.FULL_HOUSE] = {value:0, onUpdate:lower, played: false};
		scores[Rules.NAMES.SMALL_STRAIT] = {value:0, onUpdate:lower, played: false};
		scores[Rules.NAMES.LARGE_STRAIT] = {value:0, onUpdate:lower, played: false};
		scores[Rules.NAMES.YAHTZEE] = {value:0, onUpdate:lower, played: false};
		scores[Rules.NAMES.CHANCE] = {value:0, onUpdate:lower, played: false};

		function upper() {
			var total = scores[Rules.NAMES.ACES].value + 
						scores[Rules.NAMES.TWOS].value +
						scores[Rules.NAMES.THREES].value +
						scores[Rules.NAMES.FOURS].value +
						scores[Rules.NAMES.FIVES].value +
						scores[Rules.NAMES.SIXES].value;

			View.setUpperSubTotal(total);

			if (total >= UPPER_BONUS_LIMIT) {
				View.setUpperBonus( UPPER_BONUS_VALUE );
				total += UPPER_BONUS_VALUE;
			}

			View.setUpperTotal(total);
			View.setUpperFinalTotal(total);

			return total;
		}

		function lower() {
			var total = scores[Rules.NAMES.THREE_OF_A_KIND].value + 
						scores[Rules.NAMES.FOUR_OF_A_KIND].value +
						scores[Rules.NAMES.FULL_HOUSE].value +
						scores[Rules.NAMES.SMALL_STRAIT].value +
						scores[Rules.NAMES.LARGE_STRAIT].value +
						scores[Rules.NAMES.YAHTZEE].value +
						scores[Rules.NAMES.CHANCE].value;

			View.setLowerTotal(total);

			return total;
		}

		function gameOver() {
			var total = upper() + lower();

			View.setGrandTotal(total);

			deferred.resolve(total);
		}

		function listenForRoll() {
			var deferred = hand.reset();

			rollCount = 0;

			deferred.progress(function () {
				rollCount++;
			});
		}

		View.getScoreCard().on('click', 'button', function (event) {
			var tar = event.currentTarget,
				value = tar.nextSibling;

			if (rollCount <= 0) {
				View.setScoreCardMessage("You have to roll before you can select an item.");
				return;
			} else {
				View.setScoreCardMessage('');
			}

			if (!scores[tar.id].played) {
				turnCount++;

				scores[tar.id].played = true;
				scores[tar.id].value = Rules.EVALUATE[tar.id](hand.getDice())

				tar.nextSibling.innerHTML = scores[tar.id].value;

				listenForRoll();

				scores[tar.id].onUpdate();

				if (turnCount == scoreCount) {
					gameOver();
				}
			}

			tar.disabled = true;
		});

		this.reset = function () {
			View.getScoreCardButtons().removeProp('disabled');
			scoreCount = 0;
			turnCount = 0;
			for (var prop in scores) {
				scores[prop].value = 0;
				scores[prop].played = false;
				scoreCount++;
			}
			upper();
			lower();
			listenForRoll();
		}

		this.onGameOver = function () {
			if (deferred.state() !== 'pending') {
				deferred = View.getDeferred();
			}

			return deferred.promise();
		}
	}

	return ScoreCard;
})(catalyst.yahtzee.Rules);