

var catalyst = catalyst || {};
catalyst.test = catalyst.test || {};


catalyst.test.ViewSpy = (function () {

	return {
		setGameMessage : function (text) {
			gameMessage.text(text);
		},
		setRollMessage : function (text) {
			rollMessage.text(text);
		},
		setScoreCardMessage : function (text) {
			scoreCardMessage.text(text);
		},
		setUpperSubTotal : function (text) {
			upperSubTotal.text(text);
		},
		setUpperBonus : function (text) {
			upperBonus.text(text);
		},
		setUpperTotal : function (text) {
			upperTotal.text(text);
		},
		setUpperFinalTotal : function (text) {
			upperFinalTotal.text(text);
		},
		addYahtzeeBonus : function () {
			yahtzeeBonus.append('<span></span>');
		},
		setLowerTotal : function (text) {
			lowerTotal.text(text);
		},
		setGrandTotal : function (text) {
			grandTotal.text(text);
		},
		getScoreCard : function () {
			return scoreCard;
		},
		getScoreCardButtons : function () {
			return scoreCardButtons;
		},
		getRollForm : function () {
			return rollForm;
		},
		getDice : function () {
			return dice;
		},
		getGame : function () {
			return game;
		},
		ready : function (callback) {
			return ready.done(callback).promise();
		},
		init : function (jQuery) {
			$ = jQuery;
			ready = this.getDeferred();

			$(document).ready(function () {
				rollForm = $('form.roll');
				dice = rollForm.find('input[name="dice"]');
				rollMessage = rollForm.find('.message');

				scoreCard = $('#score-card');
				scoreCardButtons = scoreCard.find('button');
				scoreCardMessage = scoreCard.find('.message');

				game = $('#game');
				gameMessage = game.find('.message');

				upperSubTotal = $('#upper-sub-total');
				upperBonus = $('#upper-bonus');
				upperTotal = $('#upper-total');
				upperFinalTotal = $('#upper-final-total');
				yahtzeeBonus = $('#yahtzee-bonus');
				lowerTotal = $('#lower-total');
				grandTotal = $('#grand-total');

				ready.resolve();
			});
		},
		getDeferred : function () {
		}
	};


})();