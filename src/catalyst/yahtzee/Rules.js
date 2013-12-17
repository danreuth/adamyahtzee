var catalyst = catalyst || {};
catalyst.yahtzee = catalyst.yahtzee || {};

catalyst.yahtzee.Rules = (function () {

	var SCORE_NAMES = {
		ACES : "aces",
		TWOS : "twos",
		THREES : "threes",
		FOURS : "fours",
		FIVES : "fives",
		SIXES : "sixes",
		THREE_OF_A_KIND : "three-of-a-kind",
		FOUR_OF_A_KIND : "four-of-a-kind",
		FULL_HOUSE : "full-house",
		SMALL_STRAIT : "small-strait",
		LARGE_STRAIT : "large-strait",
		YAHTZEE : "yahtzee",
		CHANCE : "chance"
	};

	function each(list, callback) {
		for (var index = 0; index < list.length; index++) {
			var doContinue = callback(index, list[index]);
			if (typeof doContinue === 'boolean' && !doContinue) {
				break;
			}
		}
	}

	function upperRules(side) {

		return function (dice) {
			var total = 0;
			each(dice, function (_, die) {
				if (die.value() == side) {
					total += die.value();
				}
			});
			return total;
		};
	}

	function matchingKind(numOfKind) {
		return function (dice) {
			var matches = {},
				foundMatch = false;

			each(dice, function (index, die){
				if (matches[die.value()]) {
					matches[die.value()]++;
				} else {
					matches[die.value()] = 1;
				}

				if (matches[die.value()] >= numOfKind) {
					foundMatch = true;
					return false;
				}
			});

			if (foundMatch) {
				return addAllDice(dice);
			} else {
				return 0;
			}
		}
	}

	function strait(straitLength, value) {
		return function(dice) {
			var sorted = dice.slice(0).sort(function (a,b) {return a.value()-b.value();}),
				length = sorted.length - 1,
				count = 1;

			for (var index=0; index < length; index++) {
				var lastIndex = sorted.lastIndexOf(sorted[index]);

				if (index === lastIndex) {

					if (sorted[index].value() + 1 === sorted[index + 1].value()) {
						count++;
					}

				} else {

					index = lastIndex - 1;
				}
			}

			if (count >= straitLength) {
				return value;
			} else {
				return 0;
			}

		}
	}

	function addAllDice(dice) {
		var total = 0;
		each(dice, function (_, die) {
			total += die.value();
		});
		return total;
	}

	var Rules = {
		NAMES : SCORE_NAMES,
		EVALUATE : {}
	};

	Rules.EVALUATE[SCORE_NAMES.ACES] = upperRules(1);
	Rules.EVALUATE[SCORE_NAMES.TWOS] = upperRules(2);
	Rules.EVALUATE[SCORE_NAMES.THREES] = upperRules(3);
	Rules.EVALUATE[SCORE_NAMES.FOURS] = upperRules(4);
	Rules.EVALUATE[SCORE_NAMES.FIVES] = upperRules(5);
	Rules.EVALUATE[SCORE_NAMES.SIXES] = upperRules(6);
	Rules.EVALUATE[SCORE_NAMES.THREE_OF_A_KIND] = matchingKind(3);
	Rules.EVALUATE[SCORE_NAMES.FOUR_OF_A_KIND] = matchingKind(4);
	Rules.EVALUATE[SCORE_NAMES.FULL_HOUSE] = function (dice) {
			var matches = {},
				count = 0;
			each(dice, function (index, die){
				if (matches[die.value()]) {
					matches[die.value()]++;
				} else {
					matches[die.value()] = 1;
					count++;
				}
			});

			if (count == 2) {
				return 25;
			} else {
				return 0;
			}
		};
	Rules.EVALUATE[SCORE_NAMES.SMALL_STRAIT] = strait(4, 30);
	Rules.EVALUATE[SCORE_NAMES.LARGE_STRAIT] = strait(5, 40);
	Rules.EVALUATE[SCORE_NAMES.YAHTZEE] = function (dice) {
			if (matchingKind(5)(dice) == 0) {
				return 0;
			} else {
				return 50;
			}
		};
	Rules.EVALUATE[SCORE_NAMES.CHANCE] = addAllDice;

	return Rules;
})();
