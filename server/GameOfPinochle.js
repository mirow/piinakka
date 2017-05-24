'use strict';
var Cards_1 = require('./Cards');
var SetOfCards_1 = require('./SetOfCards');
var Deck_1 = require('./Deck');
var Player_1 = require('./Player');
var Util_1 = require('./Util');
var GameOfPinochle = (function () {
    function GameOfPinochle() {
        this.cardType = new Cards_1["default"]();
        this.NumberOfPlayers = 4;
        this.stats = [];
        this.hela = false;
        this.dubbelhela = false;
        var trump;
        var CARDS_DEALT = 11;
        var MAX_CARDS = 15;
        var deck = new Deck_1["default"](this.cardType, this.cardType.CARDSINDECK);
        var player = [];
        var cardsOnTable = new SetOfCards_1["default"](this.cardType, this.NumberOfPlayers);
        var talon = new SetOfCards_1["default"](this.cardType, this.NumberOfPlayers);
        var points = [0, 0, 0, 0];
        var gamepoints = [];
        var winningCards = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var wCardCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var starter; // player who wins the bid and starts taking tricks
        var current; // current player (who is playing a card)
        var dealer = null; // player who is dealing the cards
        var bidwinner = null;
        var keptbids = 0;
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
            for (var n = dealer + 1; n < dealer + 1 + this.NumberOfPlayers; n++) {
                var m = n % this.NumberOfPlayers;
                player[m].newGame(2 << m);
                player[m].addCards(deck.dealCards(11), true);
                player[m].myCards.sortCards();
                gamepoints[m] = 0;
                var mytrump = player[m].bidForTrump();
                if (mytrump !== null && (player[m].points + player[m].trickPoints * 8 / 10 + player[m].potpoints) > highestScore) {
                    trump = mytrump;
                    highestScore = player[m].points + (player[m].trickPoints * 8 / 10) + player[m].potpoints;
                    bidwinner = m;
                }
                //        mytrump: boolean = player[n].checkForPoints(m);
                //   console.log("Player "+m+" "+Cards.getSuitStr(mytrump)+": "+player[m].points);
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
            //      console.log("Talon cards: "+talon);
            starter = bidwinner;
            console.log("Player " + starter + " wins the bid for " +
                Math.round(player[bidwinner].points) + "+" + Math.round(7 * player[bidwinner].trickPoints / 10) +
                "+" + Math.round(player[bidwinner].potpoints) + "=" + Math.round(highestScore));
            for (var i = 0; i < CARDS_DEALT; i++) {
                if (Math.floor(player[starter].myCards.cards[i] / 12) == trump) {
                    wCardCount[this.cardType.getRank(player[starter].myCards.cards[i])]++;
                }
                else {
                    wCardCount[this.cardType.getRank(player[starter].myCards.cards[i]) + 6]++;
                }
            }
            player[starter].addCards(talon.cards, false);
            trump = player[starter].bidForTrump();
            player[starter].checkForPoints(trump);
            for (var n = dealer + 1; n < dealer + 1 + this.NumberOfPlayers; n++) {
                var m = n % this.NumberOfPlayers;
                if (m == starter) {
                    console.log("Player " + m + ": " + Math.round(player[m].points) +
                        " with " + player[m].pointCards[trump] +
                        ". Trump: " +
                        this.cardType.suits[trump]);
                    /*          console.log("Player " + starter + " wins the bid for " +
                     player[m].points + "+" + player[m].trickPoints
                     + "+" +player[m].potpoints +"=" + (bid) + " with " +
                     player[m].pointCards[trump] +" ("+ player[m].posCards[trump]  + "). Trump: " +
                     this.cardType.suits[trump]);
                     */
                    //          console.log("Shown cards: "+player[m].myCards.subset);
                    for (var i = 0; i < this.NumberOfPlayers; i++)
                        player[i].cardOwnerNotification(player[m].myCards.subset, 2 << m, true);
                }
                else {
                    var bestoffer = player[m].points;
                    var tpoints = player[m].trickPoints;
                    player[m].checkForPoints(trump);
                    console.log("Player " + m + ": " + player[m].points +
                        (player[m].points > 0 ?
                            " with " + player[m].pointCards[trump] + ". " +
                                (bestoffer > 0 ?
                                    "Bid: " + Math.round(bestoffer) + "+" + Math.round(player[m].potpoints) + "+" + Math.round(tpoints) + "=" +
                                        Math.round(bestoffer + tpoints + player[m].potpoints) : "") : ""));
                    //          console.log("Shown cards: "+player[m].myCards.subset);
                    for (var i = 0; i < this.NumberOfPlayers; i++)
                        player[i].cardOwnerNotification(player[m].myCards.subset, 2 << m, false);
                }
                gamepoints[m] = player[m].points;
            }
            var discarded = player[starter].discardCards(4, trump);
            console.log('Discarded: ' + discarded);
            player[starter].myCards.sortCards();
            console.log('Starter (' + starter + ') cards: ' + player[starter].myCards);
            console.log('Starting game ');
            for (var round = 1; round <= CARDS_DEALT; round++) {
                console.log('Round ' + round);
                cardsOnTable.clear();
                for (var i = 0; i < this.NumberOfPlayers; i++) {
                    player[i].myCards.sortCards();
                }
                var highestCard = null;
                var playersRemaining = Util_1["default"].power(2, this.NumberOfPlayers + 1) - 2; // 2 + 4 + 8 + 16;
                for (var n = starter; n < starter + this.NumberOfPlayers; n++) {
                    current = n % this.NumberOfPlayers;
                    playersRemaining &= ~(2 << current);
                    var cardPlayed = player[current].playCard(cardsOnTable, trump, highestCard, playersRemaining);
                    cardsOnTable.addCard(cardPlayed);
                    console.log(current + " Cards on table: " + cardsOnTable);
                    for (var i = 0; i < this.NumberOfPlayers; i++)
                        player[i].cardStatusNotification(cardPlayed, 2 << current, highestCard, this.cardType.getSuit(cardsOnTable.
                            cards[0]), trump, i);
                    if (cardsOnTable.isHigherCard(cardPlayed, highestCard, trump)) {
                        highestCard = cardPlayed;
                    }
                }
                //        console.log(round+" Cards on table: " + cardsOnTable);
                for (var n = 0; n < this.NumberOfPlayers; n++) {
                    if (highestCard == cardsOnTable.cards[n]) {
                        var winningPlayer = (n + starter) % this.NumberOfPlayers;
                        var pts = this.calculatePoints(cardsOnTable, round);
                        gamepoints[winningPlayer] += pts;
                        console.log("Player " + winningPlayer + " wins round " +
                            round + " for " + pts + " points, with " + this.cardType.cardString(highestCard));
                        starter = winningPlayer;
                        if (winningPlayer == bidwinner) {
                            if (this.cardType.getSuit(highestCard) == trump) {
                                winningCards[this.cardType.getRank(highestCard)] += pts;
                            }
                            else {
                                winningCards[this.cardType.getRank(highestCard) + 6] += pts;
                            }
                        }
                        break;
                    }
                }
            }
            for (var n = 0; n < this.NumberOfPlayers; n++) {
                console.log("Player " + n + " points: " + gamepoints[n]);
                if (n == bidwinner) {
                    if (gamepoints[n] >= highestScore) {
                        keptbids++;
                    }
                }
                if (gamepoints[n] > player[n].points) {
                    points[n] += gamepoints[n];
                }
            }
        }
        for (var n = 0; n < this.NumberOfPlayers; n++) {
            console.log("Player " + n + " total points: " + points[n]);
        }
        console.log(JSON.stringify(winningCards));
        console.log(JSON.stringify(wCardCount));
        for (var n = 0; n < 12; n++) {
            if (wCardCount[n] > 0) {
                console.log(" " + this.cardType.getRankStr((n * 2) % 12) +
                    " avg. points: " + winningCards[n] / wCardCount[n]);
            }
        }
        console.log("Kept bids: " + keptbids);
    }
    GameOfPinochle.prototype.calculatePoints = function (cardsOnTable, round) {
        var sum = 0;
        for (var n = 0; n < this.NumberOfPlayers; n++) {
            if (cardsOnTable.cards[n] % 12 < 4) {
                sum += 10;
            }
            else if (cardsOnTable.cards[n] % 12 < 8) {
                sum += 5;
            }
        }
        if (round == 12) {
            sum += 10;
        }
        return sum;
    };
    return GameOfPinochle;
}());
exports.__esModule = true;
exports["default"] = GameOfPinochle;
//# sourceMappingURL=GameOfPinochle.js.map