/*----- constants -----*/
//initial unshuffled deck array
const INITIAL_DECK = [
	'sA', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10', 'sJ', 'sQ', 'sK',
	'cA', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07', 'c08', 'c09', 'c10', 'cJ', 'cQ', 'cK',
	'hA', 'h02', 'h03', 'h04', 'h05', 'h06', 'h07', 'h08', 'h09', 'h10', 'hJ', 'hQ', 'hK',
	'dA', 'd02', 'd03', 'd04', 'd05', 'd06', 'd07', 'd08', 'd09', 'd10', 'dJ', 'dQ', 'dK'
];

//Maybe...
//DEAL = 3;
//REDEALS = Math.INFINITY;
//as rule variant configs?


/*----- app's state (variables) -----*/
// 1D arrays (stacks)
let stock;
let waste;
// 2D arrays (array of stacks)
let foundations;
let tableaus;
let tableauCardIsHidden;
// Object: 'cards' (array) and 'source' (string)
let currentlyHeld;
// 1D array, untouched outside of init and restart
let shuffledDeck;

// Stretch Goals:
// array (stack) of undo functions
//     every time a handle*Click function moves one or more cards, push a function to reverse that change (including revealing cards)



/*----- cached element references -----*/
const stockEl = document.querySelector('#stock');
const wasteEl = document.querySelector('#waste');
const foundationEls = document.querySelectorAll('.foundation-base');
const tableauEls = document.querySelectorAll('.tableau-base');
const heldCardsEl = document.querySelector('#held-cards-container');

/*----- event listeners -----*/
document.querySelector('#gameboard').addEventListener('click', handleClick);
document.querySelector('#new-game').addEventListener('click', function () { init() });
document.querySelector('#restart').addEventListener('click', function () { init(shuffledDeck) });

// undo?
// selectable rule variations?

/*----- functions -----*/
function handleClick(e) {
	// check click location, call appropriate function
	console.log(e.target);
	// TODO: figure out how to identify something other than the base
	if (e.target.id === 'stock') handleStockClick(e);
	if (e.target.id === 'waste' || e.target.parentElement.id === 'waste') handleWasteClick(e);
	if (e.target.classList.contains('foundation-base') || e.target.classList.contains('foundation-card')) handleFoundationClick(e);
	if (e.target.classList.contains('tableau-base') || e.target.classList.contains('tableau-card')) handleTableauClick(e);

	// TODO: reveal any hidden cards on the top of a tableau stack
	if (currentlyHeld.cards.length === 0) {
		tableaus.forEach(function (pile, index) {
			tableauCardIsHidden[index][pile.length-1] = false;
		});
	}

	render();
}

function handleStockClick(e) {
	if (currentlyHeld.cards.length > 0) return;

	if (stock.length === 0) {
		while (waste.length > 0) {
			stock.push(waste.pop());
		}
		// TODO: add undo handler
	} else if (stock.length > 0) {
		// just dealing 1 card for now, because it's much easier to win
		waste.push(stock.pop());
		// TODO: add undo handler
	}
}

function handleWasteClick(e) {
	if (currentlyHeld.cards.length === 0 && waste.length > 0) {
		currentlyHeld.cards.push(waste.pop());
		currentlyHeld.source = 'waste';
	} else if (currentlyHeld.cards.length === 1 && currentlyHeld.source === 'waste') {
		waste.push(currentlyHeld.cards.pop());
		currentlyHeld.source = null;
	}
}

function handleFoundationClick(e) {
	if (currentlyHeld.cards.length > 1) return;

	let pileIndex = e.target.id.match(/\d+/);
	let foundation = foundations[pileIndex];

	if (currentlyHeld.cards.length === 0 && foundation.length > 0) {
		currentlyHeld.cards.push(foundation.pop());
		currentlyHeld.source = `foundation${pileIndex}`;
	} else if (currentlyHeld.source !== null) { // implicit if (currentlyHeld.cards.length === 1)
		if (currentlyHeld.source.startsWith('foundation') && currentlyHeld.source.endsWith(pileIndex)) {
			foundation.push(currentlyHeld.cards.pop());
			currentlyHeld.source = null;
		} else if (!currentlyHeld.source.startsWith('foundation')) {
			// console.log(foundation);
			let topCard = foundation[foundation.length - 1];
			let heldCard = currentlyHeld.cards[0];

			if (foundation.length === 0 && heldCard.match(/A/)) {
				foundation.push(currentlyHeld.cards.pop());
				currentlyHeld.source = null;
				// TODO: add undo handler
			} else if (foundation.length > 0 && topCard[0] === heldCard[0] && INITIAL_DECK.indexOf(heldCard) === INITIAL_DECK.indexOf(topCard) + 1) {
				foundation.push(currentlyHeld.cards.pop());
				currentlyHeld.source = null;
				// TODO: add undo handler
			}
		}
	}
}

function handleTableauClick(e) {
	let [, col, , row] = e.target.id.match(/tableau-(\d+)(-card-(\d+))?/);
	col = Number.parseInt(col);
	row = Number.parseInt(row);
	let tableau = tableaus[col];
	
	// case: clicked on a hidden card that isn't the top card (second half relevant for returning a held card to its prior place)
	if (e.target.classList.contains('back') && row !== tableau.length - 1) return;
	
	// case: picking up one or more cards
	if (currentlyHeld.cards.length === 0 && tableau.length > 0) {
		for (let i = row; i < tableau.length - 1; i++) {
			console.log(i);
			if (!validAdjacentCards(tableau[i], tableau[i + 1])) return;
		}
		currentlyHeld.cards = [...tableau.splice(row)];
		currentlyHeld.source = `tableau${col}`;
	} else if (currentlyHeld.cards.length > 0) {
		// case: returning a card to its prior place
		if (currentlyHeld.source.startsWith('tableau') && currentlyHeld.source.endsWith(col)) {
			while (currentlyHeld.cards.length > 0) {
				tableau.push(currentlyHeld.cards.shift());
			}
			currentlyHeld.source = null;
		// case: placing one or more cards on another pile
		} else if (tableau.length > 0  && row === tableau.length - 1) {
			if (validAdjacentCards(tableau[row], currentlyHeld.cards[0])) {
				while (currentlyHeld.cards.length > 0) {
					tableau.push(currentlyHeld.cards.shift());
				}
				currentlyHeld.source = null;
				// TODO: add undo handler
			}
		} else { // implied tableau.length === 0
			// case: placing a king on an empty pile
			if (currentlyHeld.cards[0][1] === 'K') {
				while (currentlyHeld.cards.length > 0) {
					tableau.push(currentlyHeld.cards.shift());
				}
				currentlyHeld.source = null;
				// TODO: add undo handler
			}
		}
	}

}

// checks if two cards (on the tableau) can be placed or picked up together
function validAdjacentCards(firstCard, secondCard) {
	let colorCheck =
		((firstCard[0] === 's' || firstCard[0] === 'c') && (secondCard[0] === 'h' || secondCard[0] === 'd')) ||
		((firstCard[0] === 'h' || firstCard[0] === 'd') && (secondCard[0] === 's' || secondCard[0] === 'c'));
	let rankCheck = INITIAL_DECK.indexOf(firstCard) % 13 === INITIAL_DECK.indexOf(secondCard) % 13 + 1;
	return colorCheck && rankCheck;
}

function init(deckToUse) {
	stock = [];
	waste = [];
	foundations = [[], [], [], []];
	tableaus = [[], [], [], [], [], [], []];
	tableauCardIsHidden = [
		[false],
		[true, false],
		[true, true, false],
		[true, true, true, false],
		[true, true, true, true, false],
		[true, true, true, true, true, false],
		[true, true, true, true, true, true, false]
	];
	currentlyHeld = {
		cards: [],
		source: null
	};

	shuffledDeck = deckToUse ? deckToUse : shuffleDeck([...INITIAL_DECK]);
	let copyDeck = [...shuffledDeck]; // make a copy so we can use the original to restart a game
	// console.log(shuffledDeck);

	// deal to the tableaus
	tableaus.forEach(function (pileArr, pileNum) {
		for (let i = 0; i < pileNum + 1; i++) {
			pileArr.push(copyDeck.pop());
		}
	});
	// console.log(tableaus, copyDeck);

	// mark the top card of each tableau as visible - still need to decide how to track that

	// put the rest of the deck on the stock
	stock = [...copyDeck];
	// console.log(stock);

	render();
}

// In-place Fisher-Yates shuffle
function shuffleDeck(deck) {
	for (let i = deck.length - 1; i > 0; i--) {
		let rndIdx = Math.floor(Math.random() * (i + 1));
		let temp = deck[i];
		deck[i] = deck[rndIdx];
		deck[rndIdx] = temp;
	}
	return deck;
}

function render() {
	renderStock();
	renderWaste();
	renderFoundation();
	renderTableau();
	renderHeldCards();
}

function renderStock() {
	if (stock.length > 0) {
		stockEl.classList.replace('outline', 'back');
	} else {
		stockEl.classList.replace('back', 'outline');
	}
}

function renderWaste() {
	// currently only drawing 1 card
	if (waste.length > 0) {
		wasteEl.classList.remove('outline');
		let topCardEl = document.createElement('div');
		topCardEl.classList.add('card', 'large', waste[waste.length - 1]);
		wasteEl.firstChild ? wasteEl.firstChild.replaceWith(topCardEl) : wasteEl.appendChild(topCardEl);
	} else {
		if (wasteEl.firstChild) wasteEl.firstChild.remove();
		wasteEl.classList.add('outline');
	}
}

function renderFoundation() {
	if (foundations.length !== foundationEls.length) throw 'DATA ERROR: FOUNDATION SIZE';

	for (let i = 0; i < foundations.length; i++) {
		let foundationEl = foundationEls[i];
		let foundation = foundations[i];

		if (foundation.length > 0) {
			foundationEl.classList.remove('outline');
			let topCardEl = document.createElement('div');
			topCardEl.classList.add('foundation-card', 'card', 'large', foundation[foundation.length - 1]);
			topCardEl.id = `${foundationEl.id}-card`;
			foundationEl.firstChild ? foundationEl.firstChild.replaceWith(topCardEl) : foundationEl.appendChild(topCardEl);
		}
		else {
			if (foundationEl.firstChild) foundationEl.firstChild.remove();
			foundationEl.classList.add('outline');
		}
	}
}

function renderTableau() {
	if (tableaus.length !== tableauEls.length) throw 'DATA ERROR: TABLEAU SIZE';

	for (let i = 0; i < tableaus.length; i++) {
		let tableauEl = tableauEls[i];
		let tableau = tableaus[i];

		if (tableau.length > 0) {
			// clear previous child chain - room for optimization here
			if (tableauEl.firstChild) tableauEl.firstChild.remove();

			// build a div chain from the end of the pile
			let childCardEl;
			for (let j = tableau.length - 1; j >= 0; j--) {
				let newCardEl = document.createElement('div');
				newCardEl.classList.add('tableau-card', 'card', 'large', tableauCardIsHidden[i][j] ? 'back' : tableau[j]);

				newCardEl.id = `${tableauEl.id}-card-${j}`;
				if (childCardEl) {
					newCardEl.appendChild(childCardEl);
				}
				childCardEl = newCardEl;
			}
			tableauEl.appendChild(childCardEl);
		}
		else {
			if (tableauEl.firstChild) tableauEl.firstChild.remove();
		}
	}
}

function renderHeldCards() {
	// held cards
	// draw on the cursor
	if (currentlyHeld.cards.length > 0) {
		console.log('currentlyHeld:\n', currentlyHeld.cards, '\nfrom:', currentlyHeld.source);

		let newHeldCards = document.createElement('div');
		newHeldCards.classList.add('card', 'large', currentlyHeld.cards[0]);
		heldCardsEl.firstChild ? heldCardsEl.firstChild.replaceWith(newHeldCards) : heldCardsEl.appendChild(newHeldCards);
	} else {
		if (heldCardsEl.firstChild) heldCardsEl.firstChild.remove();
	}
}

init();
