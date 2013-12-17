var catalyst = catalyst || {};
catalyst.yahtzee = catalyst.yahtzee || {};

catalyst.yahtzee.Yahtzee = (function (Hand, View, ScoreCard) {
	var NUM_OF_SIDES = 6,
		NUM_OF_DICE = 5,
		NUM_OF_ROLLS = 3,
		hand,
		scoreCard;

	function listenForGameOver(scoreCard) {
		scoreCard.reset();
		scoreCard.onGameOver().done(function (total){
			View.setGameMessage("You scored " + total + " great job!");
		});
	}

	return function (jQuery) {
		View.init(jQuery);

		View.ready(function () {
			hand = new Hand(NUM_OF_DICE, NUM_OF_SIDES, NUM_OF_ROLLS, View);
			scoreCard = new ScoreCard(hand, View);

			listenForGameOver(scoreCard);

			View.getGame().on('click', '#new-game', function (event) {
				listenForGameOver(scoreCard);
			});
		});

	};
})(catalyst.yahtzee.Hand, catalyst.yahtzee.View, catalyst.yahtzee.ScoreCard);