/*----- constants -----*/
/*
    ...
*/

/*----- app's state (variables) -----*/
/*
    array of arrays for the tableaus
    array of arrays for the foundations
    array for the stock
    array for the waste
    array of what we're holding (or pointer to selected card?)
*/


/*----- cached element references -----*/


/*----- event listeners -----*/
/*
on gameboard click
    call handleClick

on new game button click
    call init

undo?
restart game?
selectable rule variations?
*/

/*----- functions -----*/

/*
function init
    shuffle the deck (Fisher-Yates)
    deal to the tableaus
    put the rest of the deck on the stock

function render
    stock
        if not empty, draw a face-down card
    waste
        if not empty, draw the top 3 cards face-up
    foundation
        if not empty, draw top card face-up
    tableau
        if not empty, draw the piles face-up or face-down as appropriate

function handleClick
    check click location, call appropriate function
    reveal any hidden cards on the top of a tableau stack

function handleStockClick
    if holding a card, do nothing
    if not empty, deal up to 3 to waste
    else if empty, flip waste over

function handleWasteClick
    if not holding anything, pick up top card
    else if holding the top card, stop holding it

function handleFoundationClick
    if holding one card, and if same suit and rank is one higher
        place held card on foundation

function handleTableauClick
    if clicked on a hidden card, do nothing
    if not holding anything, and if top card of pile through clicked-on card are a sequence of ascending ranks and alternating suit colors, pick up stack from clicked on card
    if holding one or more cards, 
        if tableau stack is not empty, and bottom card of held stack is one rank less and is an opposite color suit of top card of tableau stack
            place held stack on tableau stack
        if tableau stack is empty and bottom card of held stack is a king
            place held stack on tableau stack








*/