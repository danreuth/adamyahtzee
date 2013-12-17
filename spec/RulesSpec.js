

describe("Rules", function () {
	var Rules = catalyst.yahtzee.Rules,
		Dice = catalyst.yahtzee.Dice,
		SIDES = 6,
		testHand;

	function createDice(values) {
		var result = [];

		for (var index=0; index<values.length; index++) {
			// create new Dice
			var dice = new Dice(SIDES);
			// set expected value
			dice.setValue(values[index]);
			// add to result
			result.push(dice);
		}

		return result;
	}

	describe(Rules.NAMES.ACES, function () {
		
		it("All true", function (){
			testHand = createDice( [ 1,1,1,1,1 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.ACES ](testHand)).toBe(5);
		});

		it("None True", function () {
			testHand = createDice( [ 2,2,2,2,2 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.ACES ](testHand)).toBe(0);
		});

		it("Mixed", function () {
			testHand = createDice( [ 1,2,1,2,1 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.ACES ](testHand)).toBe(3);
		});

	});

	describe(Rules.NAMES.TWOS, function () {
		
		it("All true", function (){
			testHand = createDice( [ 2,2,2,2,2 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.TWOS ](testHand)).toBe(5 * 2);
		});

		it("None True", function () {
			testHand = createDice( [ 1,1,1,1,1 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.TWOS ](testHand)).toBe(0);
		});

		it("Mixed", function () {
			testHand = createDice( [ 1,2,1,2,1 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.TWOS ](testHand)).toBe(2 * 2);
		});

	});

	describe(Rules.NAMES.THREES, function () {
		
		it("All true", function (){
			testHand = createDice( [ 3,3,3,3,3 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.THREES ](testHand)).toBe(5 * 3);
		});

		it("None True", function () {
			testHand = createDice( [ 1,1,1,1,1 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.THREES ](testHand)).toBe(0);
		});

		it("Mixed", function () {
			testHand = createDice( [ 3,2,3,2,1 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.THREES ](testHand)).toBe(2 * 3);
		});

	});

	describe(Rules.NAMES.FOURS, function () {
		
		it("All true", function (){
			testHand = createDice( [ 4,4,4,4,4 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.FOURS ](testHand)).toBe(5 * 4);
		});

		it("None True", function () {
			testHand = createDice( [ 1,1,1,1,1 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.FOURS ](testHand)).toBe(0);
		});

		it("Mixed", function () {
			testHand = createDice( [ 4,2,4,4,1 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.FOURS ](testHand)).toBe(3 * 4);
		});

	});

	describe(Rules.NAMES.FIVES, function () {
		
		it("All true", function (){
			testHand = createDice( [ 5,5,5,5,5 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.FIVES ](testHand)).toBe(5 * 5);
		});

		it("None True", function () {
			testHand = createDice( [ 1,1,1,1,1 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.FIVES ](testHand)).toBe(0);
		});

		it("Mixed", function () {
			testHand = createDice( [ 4,5,4,4,1 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.FIVES ](testHand)).toBe(1 * 5);
		});

	});

	describe(Rules.NAMES.SIXES, function () {
		
		it("All true", function (){
			testHand = createDice( [ 6,6,6,6,6 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.SIXES ](testHand)).toBe(5 * 6);
		});

		it("None True", function () {
			testHand = createDice( [ 1,1,1,1,1 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.SIXES ](testHand)).toBe(0);
		});

		it("Mixed", function () {
			testHand = createDice( [ 4,6,4,6,1 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.SIXES ](testHand)).toBe(2 * 6);
		});

	});

	describe(Rules.NAMES.THREE_OF_A_KIND, function () {
		
		it("Has 3 of a kind", function (){
			testHand = createDice( [ 6,1,6,3,6 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.THREE_OF_A_KIND ](testHand)).toBe(6+1+6+3+6);
		});

		it("Does Not have 3", function () {
			testHand = createDice( [ 1,5,3,2,3 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.THREE_OF_A_KIND ](testHand)).toBe(0);
		});

	});

	describe(Rules.NAMES.FOUR_OF_A_KIND, function () {
		
		it("Has 4 of a kind", function (){
			testHand = createDice( [ 3,6,3,3,3 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.FOUR_OF_A_KIND ](testHand)).toBe(3+6+3+3+3);
		});

		it("Does Not have 4", function () {
			testHand = createDice( [ 1,5,3,2,3 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.FOUR_OF_A_KIND ](testHand)).toBe(0);
		});

	});

	describe(Rules.NAMES.FULL_HOUSE, function () {
		
		it("Has Full House", function (){
			testHand = createDice( [ 4,2,4,2,4 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.FULL_HOUSE ](testHand)).toBe(25);
		});

		it("Does Not have Full House", function () {
			testHand = createDice( [ 1,1,3,4,1 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.FULL_HOUSE ](testHand)).toBe(0);
		});

	});

	describe(Rules.NAMES.SMALL_STRAIT, function () {
		
		it("Has small strait", function (){
			testHand = createDice( [ 1,4,2,3,6 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.SMALL_STRAIT ](testHand)).toBe(30);
		});

		it("Has Small Strait with repeating middle", function () {
			testHand = createDice( [ 1,2,4,3,3 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.SMALL_STRAIT ](testHand)).toBe(30);
		});

		it("Does Not have strait", function () {
			testHand = createDice( [ 1,1,3,4,1 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.SMALL_STRAIT ](testHand)).toBe(0);
		});

	});

	describe(Rules.NAMES.LARGE_STRAIT, function () {
		
		it("Has large strait 1-5", function (){
			testHand = createDice( [ 1,3,5,4,2 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.LARGE_STRAIT ](testHand)).toBe(40);
		});

		it("Has large strait 2-6", function (){
			testHand = createDice( [ 4,3,6,5,2 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.LARGE_STRAIT ](testHand)).toBe(40);
		});

		it("Does Not match small strait", function () {
			testHand = createDice( [ 1,4,2,3,6 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.LARGE_STRAIT ](testHand)).toBe(0);
		});

		it("Does Not have strait", function () {
			testHand = createDice( [ 1,1,3,4,1 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.LARGE_STRAIT ](testHand)).toBe(0);
		});

	});

	describe(Rules.NAMES.YAHTZEE, function () {
		
		it("Has yahtzee", function (){
			testHand = createDice( [ 1,1,1,1,1 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.YAHTZEE ](testHand)).toBe(50);
		});
		
		it("Does Not have yahtzee", function () {
			testHand = createDice( [ 1,1,3,4,1 ] );
			expect(Rules.EVALUATE[ Rules.NAMES.LARGE_STRAIT ](testHand)).toBe(0);
		});

	});

});