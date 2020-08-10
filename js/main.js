/*----- constants -----*/
//initial unshuffled deck array
INITIAL_DECK = [
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
// Object: 'cards' (array) and 'source' (string)
let currentlyHeld;
// 1D array, untouched outside of init and restart
let shuffledDeck;

// Stretch Goals:
// array (stack) of undo functions
//     every time a handle*Click function moves one or more cards, push a function to reverse that change (including revealing cards)
// the original shuffled deck so the current game can be restarted
//     do we give init an optional arg then?
//         or do we always pass an arg of the shuffled deck?


/*----- cached element references -----*/
const stockEl = document.querySelector('#stock');
const wasteEl = document.querySelector('#waste');
const foundationEls = document.querySelectorAll('.foundation');
const tableauEls = document.querySelectorAll('.tableau');

/*----- event listeners -----*/
document.querySelector('#gameboard').addEventListener('click', handleClick);
document.querySelector('#new-game').addEventListener('click', init);
// document.querySelector('#restart').addEventListener('click', ???);

// undo?
// selectable rule variations?

/*----- functions -----*/
function handleClick(e) {
	// check click location, call appropriate function
	console.log(e.target);
	// TODO: figure out how to identify something other than the base
	if (e.target.id === 'stock') handleStockClick(e);
	if (e.target.id === 'waste' || e.target.parentElement.id === 'waste') handleWasteClick(e);
	if (e.target.classList.contains('foundation')) handleFoundationClick(e);
	if (e.target.classList.contains('tableau')) handleTableauClick(e);

	// TODO: reveal any hidden cards on the top of a tableau stack

	render();
}

function handleStockClick(e) {
	if (currentlyHeld.cards.length > 0) return;

	if (stock.length === 0) {
		while (waste.length > 0) {
			stock.push(waste.pop());
		}
	} else if (stock.length > 0) {
		// just dealing 1 card for now, because it's much easier to win
		waste.push(stock.pop());
	}
}

function handleWasteClick(e) {
	if (waste.length === 0) return;

	if (currentlyHeld.cards.length === 0 && waste.length > 0) {
		currentlyHeld.cards.push(waste.pop());
		currentlyHeld.source = 'waste';
	} else if (currentlyHeld.cards.length === 1 && currentlyHeld.source === 'waste') {
		waste.push(currentlyHeld.pop());
		currentlyHeld.source = null;
	}
}

function handleFoundationClick(e) {
	// if holding one card, and if same suit and rank is one higher
	// place held card on foundation

}

function handleTableauClick(e) {
	// if clicked on a hidden card, do nothing
	// if not holding anything, and if top card of pile through clicked-on card are a sequence of ascending ranks and alternating suit colors, pick up stack from clicked on card
	// if holding one or more cards, 
	// if tableau stack is not empty, and bottom card of held stack is one rank less and is an opposite color suit of top card of tableau stack
	// place held stack on tableau stack
	// if tableau stack is empty and bottom card of held stack is a king
	// place held stack on tableau stack

}

function init() {
	stock = [];
	waste = [];
	foundations = [[], [], [], []];
	tableaus = [[], [], [], [], [], [], []];
	currentlyHeld = {
		cards: [],
		source: null
	};

	// shuffle the deck (Fisher-Yates)
	shuffledDeck = shuffleDeck(INITIAL_DECK);
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
	if (stock.length > 0) {
		stockEl.classList.replace('outline', 'back');
	} else {
		stockEl.classList.replace('back', 'outline');
	}
	
	// currently only drawing 1 card
	if (waste.length > 0) {
		wasteEl.classList.remove('outline');
		let topCardEl = document.createElement('div');
		topCardEl.classList.add('card', 'large', waste[waste.length-1]);
		wasteEl.firstChild ? wasteEl.firstChild.replaceWith(topCardEl) : wasteEl.appendChild(topCardEl);
	} else {
		if (wasteEl.firstChild) wasteEl.firstChild.remove();
		wasteEl.classList.add('outline');
	}

	// foundation
	//     if not empty, draw top card face-up
	
	// tableau
	//     if not empty, draw the cards face-up or face-down as appropriate

	// held cards
	// draw on the cursor
}

init();
