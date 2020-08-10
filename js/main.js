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
let stock;
let waste;
let foundations;
let tableaus;
let currentlyHeld;
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
function handleClick() {
	// check click location, call appropriate function
	// reveal any hidden cards on the top of a tableau stack

}

function handleStockClick() {
	// if holding a card, do nothing
	// if not empty, deal up to 3 to waste
	// else if empty, flip waste over

}

function handleWasteClick() {
	// if not holding anything, pick up top card
	// else if holding the top card, stop holding it

}

function handleFoundationClick() {
	// if holding one card, and if same suit and rank is one higher
	// place held card on foundation

}

function handleTableauClick() {
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
	// stock
	//     if not empty, draw a face-down card
	// waste
	//     if not empty, draw the top 3 cards face-up
	// foundation
	//     if not empty, draw top card face-up
	// tableau
	//     if not empty, draw the cards face-up or face-down as appropriate
}

init();
