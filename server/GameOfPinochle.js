'use strict';
var Cards_1 = require('./Cards');
var SetOfCards_1 = require('./SetOfCards');
var Deck_1 = require('./Deck');
var Player_1 = require('./Player');
var Util_1 = require('./Util');
var GameOfPinochle = (function () {
    function GameOfPinochle() {
        this.NumberOfPlayers = 4;
        this.stats = [];
        this.hela = false;
        this.dubbelhela = false;
        var trump;
        var CARDS_DEALT = 11;
        var MAX_CARDS = 15;
        var deck = new Deck_1["default"](Cards_1["default"].CARDSINDECK);
        var player = [];
        var cardsOnTable = new SetOfCards_1["default"](this.NumberOfPlayers);
        var talon = new SetOfCards_1["default"](this.NumberOfPlayers);
        var totalPlayerPoints = [0, 0, 0, 0];
        var gamePlayerPoints = [];
        var winningCards = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var winningCardCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var starter; // player who wins the bid and starts taking tricks
        var current; // current player (who is playing a card)
        var dealer = null; // player who is dealing the cards
        var bidWinner = null;
        var keptBids = 0;
        for (var n = 0; n < this.NumberOfPlayers; n++) {
            player[n] = new Player_1["default"](2 << n, this.NumberOfPlayers, MAX_CARDS);
        }
        player[0].playerStrategy = 1;
        player[1].playerStrategy = 1;
        player[2].playerStrategy = 1;
        player[3].playerStrategy = 1;
        for (var games = 0; games < 1; games++) {
            dealer = (dealer + 1) % this.NumberOfPlayers;
            deck.reset();
            console.log("Starting game " + games);
            starter = null;
            trump = null;
            var highestScore = 0;
            // *** Deal cards and check for totalPlayerPoints for each player ****
            for (var n = dealer + 1; n < dealer + 1 + this.NumberOfPlayers; n++) {
                var m = n % this.NumberOfPlayers;
                player[m].newGame();
                player[m].addCards(deck.dealCards(11), true);
                player[m].myCards.sortCards();
                gamePlayerPoints[m] = 0;
                var myTrump = player[m].bidForTrump();
                if (myTrump !== null && (player[m].points + player[m].trickPoints + player[m].potpoints) > highestScore) {
                    trump = myTrump;
                    highestScore = player[m].points + player[m].trickPoints + player[m].potpoints;
                    bidWinner = m;
                }
                console.log("Player " + m + " cards: " + player[m].myCards);
            }
            if (trump === null) {
                console.log('No one can bid, redeal');
                continue;
            }
            talon.clear();
            talon.addCards(deck.dealCards(4));
            talon.sortCards();
            console.log("Talon cards: " + talon);
            // **
            starter = bidWinner;
            console.log("Player " + starter + " wins the bid for " +
                Math.round(player[bidWinner].points) + "+" + Math.round(7 * player[bidWinner].trickPoints / 10) +
                "+" + Math.round(player[bidWinner].potpoints) + "=" + Math.round(highestScore));
            for (var i = 0; i < CARDS_DEALT; i++) {
                if (Cards_1["default"].getSuit(player[starter].myCards.cards[i]) == trump) {
                    winningCardCount[Cards_1["default"].getRank(player[starter].myCards.cards[i])]++;
                }
                else {
                    winningCardCount[Cards_1["default"].getRank(player[starter].myCards.cards[i]) + 6]++;
                }
            }
            // ** talon winner picks up talon **
            player[starter].addCards(talon.cards, false);
            trump = player[starter].bidForTrump();
            player[starter].checkForPoints(trump);
            // *** each player updates their card status info ***
            for (var n = dealer + 1; n < dealer + 1 + this.NumberOfPlayers; n++) {
                var m = n % this.NumberOfPlayers;
                if (m == starter) {
                    console.log("Player " + m + ": " + Math.round(player[m].points) +
                        " with " + player[m].pointCards[trump] + ". Trump: " + Cards_1["default"].suits[trump]);
                }
                else {
                    var bestOffer = player[m].points;
                    var trickPoints = player[m].trickPoints;
                    player[m].checkForPoints(trump);
                    console.log("Player " + m + ": " + player[m].points +
                        (player[m].points > 0 ?
                            " with " + player[m].pointCards[trump] + ". " +
                                (bestOffer > 0 ?
                                    "Bid: " + Math.round(bestOffer) + "+" + Math.round(player[m].potpoints) + "+" + Math.round(trickPoints) + "=" +
                                        Math.round(bestOffer + trickPoints + player[m].potpoints) : "") : ""));
                }
                for (var i = 0; i < this.NumberOfPlayers; i++)
                    player[i].updateCardsStatus(player[m].myCards.subset, 2 << m, m == starter);
                gamePlayerPoints[m] = player[m].points;
            }
            // ** talon winner discards cards **
            var discarded = player[starter].discardCards(4, trump);
            console.log('Discarded: ' + discarded);
            console.log('Starter (' + starter + ') cards: ' + player[starter].myCards);
            // ** play rounds **
            console.log('Starting game ');
            for (var round = 1; round <= CARDS_DEALT; round++) {
                console.log('Round ' + round);
                cardsOnTable.clear();
                for (var i = 0; i < this.NumberOfPlayers; i++) {
                    player[i].myCards.sortCards();
                }
                var highestCard = null;
                var playersRemaining = Util_1["default"].power(2, this.NumberOfPlayers + 1) - 2; // 2 + 4 + 8 + 16;
                var winningPlayer = starter;
                // *** each player plays a card ***
                for (var n = starter; n < starter + this.NumberOfPlayers; n++) {
                    current = n % this.NumberOfPlayers;
                    playersRemaining &= ~(2 << current);
                    var cardPlayed = player[current].playCard(cardsOnTable, trump, highestCard, playersRemaining);
                    cardsOnTable.addCard(cardPlayed);
                    console.log(current + " Cards on table: " + cardsOnTable);
                    // ** notify other players that card has been played **
                    for (var i = 0; i < this.NumberOfPlayers; i++)
                        player[i].cardStatusNotification(cardPlayed, 2 << current, highestCard, Cards_1["default"].getSuit(cardsOnTable.cards[0]), trump);
                    if (cardsOnTable.isHigherCard(cardPlayed, highestCard, trump)) {
                        highestCard = cardPlayed;
                        winningPlayer = current;
                    }
                }
                //        console.log(round+" Cards on table: " + cardsOnTable);
                // ** calculate totalPlayerPoints for winner ***
                var pts = cardsOnTable.calculatePoints(round);
                gamePlayerPoints[winningPlayer] += pts;
                console.log("Player " + winningPlayer + " wins round " +
                    round + " for " + pts + " totalPlayerPoints, with " + Cards_1["default"].cardString(highestCard));
                starter = winningPlayer;
                // ** calculate stats for bidWinner **
                if (winningPlayer == bidWinner) {
                    if (Cards_1["default"].getSuit(highestCard) == trump) {
                        winningCards[Cards_1["default"].getRank(highestCard)] += pts;
                    }
                    else {
                        winningCards[Cards_1["default"].getRank(highestCard) + 6] += pts;
                    }
                }
            }
            // ** game over **
            for (var n = 0; n < this.NumberOfPlayers; n++) {
                console.log("Player " + n + " totalPlayerPoints: " + gamePlayerPoints[n]);
                if (n == bidWinner) {
                    if (gamePlayerPoints[n] >= highestScore) {
                        keptBids++;
                    }
                }
                if (gamePlayerPoints[n] > player[n].points) {
                    totalPlayerPoints[n] += gamePlayerPoints[n];
                }
            }
        }
        for (var n = 0; n < this.NumberOfPlayers; n++) {
            console.log("Player " + n + " total totalPlayerPoints: " + totalPlayerPoints[n]);
        }
        console.log(JSON.stringify(winningCards));
        console.log(JSON.stringify(winningCardCount));
        for (var n = 0; n < 12; n++) {
            if (winningCardCount[n] > 0) {
                console.log(" " + Cards_1["default"].getRankStr((n * 2) % 12) +
                    " avg. totalPlayerPoints: " + winningCards[n] / winningCardCount[n]);
            }
        }
        console.log("Kept bids: " + keptBids);
    }
    return GameOfPinochle;
}());
exports.__esModule = true;
exports["default"] = GameOfPinochle;
//# sourceMappingURL=GameOfPinochle.js.map