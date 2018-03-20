'use strict';
exports.__esModule = true;
var Cards_1 = require("./Cards");
var SetOfCards_1 = require("./SetOfCards");
var Deck_1 = require("./Deck");
var Player_1 = require("./Player");
var GameOfPinochle = /** @class */ (function () {
    function GameOfPinochle() {
        this.NumberOfPlayers = 3;
        this.talonSize = this.NumberOfPlayers;
        this.CARDS_DEALT = this.NumberOfPlayers == 3 ? 15 : 11;
        this.MAX_CARDS = this.NumberOfPlayers == 3 ? 18 : 15;
        this.deck = new Deck_1["default"](Cards_1["default"].CARDSINDECK);
        this.player = [];
        this.totalPlayerPoints = [0, 0, 0, 0];
        this.meldPoints = [];
        this.trickPoints = [];
        this.winningCards = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.winningCardCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.dealer = 0; // player who is dealing the cards
        this.bidWinner = null;
        this.keptBids = 0;
        this.game = 0;
        this.winningBid = 0;
        this.state = "notStarted";
        this.gamePoints = [];
        this.playerKeptBids = [0, 0, 0];
        this.playerBids = [0, 0, 0];
        //    for (let n: number = 0; n < this.NumberOfPlayers; n++) {
        this.player[0] = new Player_1["default"](2 << 0, this.NumberOfPlayers, this.MAX_CARDS);
        this.player[1] = new Player_1["default"](2 << 1, this.NumberOfPlayers, this.MAX_CARDS);
        this.player[2] = new Player_1["default"](2 << 2, this.NumberOfPlayers, this.MAX_CARDS);
        //    this.player[3] = new Player(2 << 3, this.NumberOfPlayers, this.MAX_CARDS);
        //  }
        this.player[0].playerStrategy = 1;
        this.player[1].playerStrategy = 1;
        this.player[2].playerStrategy = 1;
        //    this.player[3].playerStrategy = 1;
        this.player[0].oddsLimit = 40;
        this.player[1].oddsLimit = 40;
        this.player[2].oddsLimit = 40;
        //    this.player[3].oddsLimit = 50;
    }
    GameOfPinochle.prototype.getState = function () {
        var playerData = [];
        for (var n = 0; n < this.NumberOfPlayers; n++) {
            playerData.push({
                cards: (this.state == "cannotBid" || this.state == "notStarted") ? this.player[n].myCards : this.player[n].myCards,
                meldCards: (this.state == "meldsShown") ? this.player[n].meldCards : SetOfCards_1["default"].dummySet(0, 4),
                id: this.player[n].myPlayerID,
                strategy: this.player[n].playerStrategy,
                bid: Math.ceil(this.player[n].myBid / 5) * 5,
                stack: Array.from(Array(this.player[n].stack), function () { return Math.floor(Math.random() * 5 - 2.5); }),
                meldPoints: this.meldPoints[n],
                trickPoints: this.trickPoints[n],
                gamePoints: this.gamePoints[n]
            });
        }
        return {
            players: playerData,
            dealer: this.dealer,
            bidWinner: this.bidWinner,
            game: this.game,
            winningBid: this.winningBid,
            state: this.state,
            starter: this.starter,
            trump: this.trump,
            cardsOnTable: this.cardsOnTable,
            talon: this.talon
        };
    };
    GameOfPinochle.prototype.newGame = function () {
        this.game++;
        console.log("Starting game " + this.game);
        this.starter = null;
        this.trump = null;
        this.cardsOnTable = new SetOfCards_1["default"](this.NumberOfPlayers);
        this.talon = new SetOfCards_1["default"](this.talonSize);
        this.dealer = (this.dealer + 1) % this.NumberOfPlayers;
        this.deck.reset();
        this.talon.clear();
        this.talon.addCards(this.deck.dealCards(this.talonSize));
        this.talon.sortCards();
        this.winningBid = 0;
        this.bidWinner = null;
        this.trump = null;
        console.log("Talon cards: " + this.talon);
        // *** Deal cards and check for points for each player ****
        for (var n = this.dealer + 1; n < this.dealer + 1 + this.NumberOfPlayers; n++) {
            var m = n % this.NumberOfPlayers;
            this.player[m].newGame();
            this.player[m].addCards(this.deck.dealCards(this.CARDS_DEALT), true);
            this.player[m].myCards.sortCards();
            this.meldPoints[m] = 0;
            this.trickPoints[m] = 0;
            this.gamePoints[m] = 0;
            var myTrump = this.player[m].findBestTrump();
            if (myTrump !== null && (this.player[m].myBid) > this.winningBid) {
                this.trump = myTrump;
                this.winningBid = this.player[m].myBid;
                this.bidWinner = m;
            }
            //      console.log("Player " + m + " cards: " + this.player[m].myCards);
            console.log("Player " + m + " bid: " + (this.player[m].myBid));
        }
        this.state = "cardsDealt";
        if (this.trump === null) {
            console.log('No one can bid, re-deal');
            this.state = "cannotBid";
            return;
        }
        this.starter = this.bidWinner;
        console.log("Player " + this.starter + " wins the bid for " +
            Math.round(this.player[this.bidWinner].meldPoints) + "+" + Math.round(this.player[this.bidWinner].trickPoints) +
            "+" + Math.round(this.player[this.bidWinner].potentialPoints) + "=" + Math.round(this.winningBid));
        // ** update statistics **
        for (var i = 0; i < this.CARDS_DEALT; i++) {
            if (Cards_1["default"].getSuit(this.player[this.starter].myCards.cards[i]) == this.trump) {
                this.winningCardCount[Cards_1["default"].getRank(this.player[this.starter].myCards.cards[i])]++;
            }
            else {
                this.winningCardCount[Cards_1["default"].getRank(this.player[this.starter].myCards.cards[i]) + 6]++;
            }
        }
        this.state = "bidWinnerSelected";
        this.pickupTalon();
        //    console.log("Player " + this.starter + " cards: " + this.player[this.starter].myCards);
        this.showMelds();
        this.round = 0;
        /*
    
            this.cpuDiscardCards();
            this.playRounds();
    
            return JSON.stringify(this);
            */
    };
    GameOfPinochle.prototype.pickupTalon = function () {
        // ** talon winner picks up talon cards **
        console.log('Player ' + this.starter + ' picks up talon');
        this.player[this.starter].addCards(this.talon.cards, false);
        this.trump = this.player[this.starter].findBestTrump(false, false);
        this.player[this.starter].checkForMeldPoints(this.trump);
    };
    GameOfPinochle.prototype.userDiscardCards = function () {
    };
    GameOfPinochle.prototype.cpuDiscardCards = function () {
        // ** this.talon winner discards cards **
        var discarded = this.player[this.starter].discardCards(this.talonSize, this.trump);
        console.log('Discarded: ' + discarded);
        this.trickPoints[this.starter] = discarded.calculatePoints(this.round);
        console.log('Starter (' + this.starter + ') cards: ' + this.player[this.starter].myCards);
        this.player[this.starter].stack = 4;
        this.state = "readyToPlay";
    };
    GameOfPinochle.prototype.showMelds = function () {
        // *** each player updates their card status info ***
        for (var n = this.dealer + 1; n < this.dealer + 1 + this.NumberOfPlayers; n++) {
            var m = n % this.NumberOfPlayers;
            if (m == this.starter) {
                console.log("Player " + m + ": " + Math.round(this.player[m].meldPoints) +
                    " with " + this.player[m].pointCards[this.trump] + ". Trump: " + Cards_1["default"].suits[this.trump] + ' Bid: ' + this.player[m].myBid);
            }
            else {
                var meldPoints = this.player[m].meldPoints;
                var trickPoints = this.player[m].trickPoints;
                this.player[m].checkForMeldPoints(this.trump, false);
                console.log("Player " + m + ": " + this.player[m].meldPoints +
                    " with " + this.player[m].pointCards[this.trump] + ". " +
                    "Bid: " + meldPoints + "+" + Math.round(this.player[m].potentialPoints) + "+" + Math.round(trickPoints) + "=" +
                    Math.round(meldPoints + trickPoints + this.player[m].potentialPoints) + ' bid: ' + this.player[m].myBid);
            }
            for (var i = 0; i < this.NumberOfPlayers; i++)
                this.player[i].updateCardsStatus(this.player[m].meldCards, 2 << m, m == this.starter);
            this.meldPoints[m] = this.player[m].meldPoints;
        }
        this.state = "meldsShown";
    };
    GameOfPinochle.prototype.playRound = function () {
        console.log('Round ' + this.round);
        this.cardsOnTable.clear();
        for (var i = 0; i < this.NumberOfPlayers; i++) {
            this.player[i].myCards.sortCards();
            //          console.log("Player " + i + " cards: " + this.player[i].myCards);
        }
        var highestCard = null;
        var playersRemaining = Math.pow(2, this.NumberOfPlayers + 1) - 2; // 2 + 4 + 8 + 16;
        var winningPlayer = this.starter;
        // *** each this.player plays a card ***
        for (var n = this.starter; n < this.starter + this.NumberOfPlayers; n++) {
            var current = n % this.NumberOfPlayers;
            playersRemaining &= ~(2 << current);
            var cardPlayed = this.player[current].playCard(this.cardsOnTable, this.trump, highestCard, playersRemaining);
            this.player[current].myCards.sortCards();
            this.cardsOnTable.addCard(cardPlayed);
            console.log('After player ' + current + ", cards on table: " + this.cardsOnTable);
            // ** notify other players that card has been played **
            for (var i = 0; i < this.NumberOfPlayers; i++)
                this.player[i].cardStatusNotification(cardPlayed, 2 << current, highestCard, Cards_1["default"].getSuit(this.cardsOnTable.cards[0]), this.trump);
            if (this.cardsOnTable.isHigherCard(cardPlayed, highestCard, this.trump)) {
                highestCard = cardPlayed;
                winningPlayer = current;
            }
        }
        //        console.log(round+" Cards on table: " + this.cardsOnTable);
        // ** calculate points for winner ***
        var pts = this.cardsOnTable.calculatePoints(this.round);
        this.player[winningPlayer].stack += this.NumberOfPlayers;
        // last trick gives 10 points
        this.trickPoints[winningPlayer] += pts + (this.round == this.CARDS_DEALT ? 10 : 0);
        console.log("Player " + winningPlayer + " wins round " +
            this.round + " for " + pts + " points, with " + Cards_1["default"].cardString(highestCard));
        this.starter = winningPlayer;
        // ** calculate stats for this.bidWinner **
        if (winningPlayer == this.bidWinner) {
            if (Cards_1["default"].getSuit(highestCard) == this.trump) {
                this.winningCards[Cards_1["default"].getRank(highestCard)] += pts;
            }
            else {
                this.winningCards[Cards_1["default"].getRank(highestCard) + 6] += pts;
            }
        }
        if (this.round == this.CARDS_DEALT) {
            this.state = 'gameOver';
            console.log('game over');
            this.gameOver();
        }
    };
    GameOfPinochle.prototype.playNextRound = function () {
        this.round++;
        if (this.round <= this.CARDS_DEALT) {
            this.playRound();
            return true;
        }
        else {
            return false;
        }
    };
    GameOfPinochle.prototype.gameOver = function () {
        for (var n = 0; n < this.NumberOfPlayers; n++) {
            console.log("Player " + n + " totalPlayerPoints: " + this.meldPoints[n]);
            if (n == this.bidWinner) {
                this.playerBids[n]++;
                if (this.meldPoints[n] + this.trickPoints[n] >= this.winningBid) {
                    this.keptBids++;
                    this.playerKeptBids[n]++;
                    this.gamePoints[n] = this.meldPoints[n] + this.trickPoints[n];
                }
                else {
                    this.gamePoints[n] = -this.winningBid;
                }
            }
            else {
                this.gamePoints[n] = this.meldPoints[n] + this.trickPoints[n];
            }
            //if (this.meldPoints[n] > this.player[n].meldPoints) {
            this.totalPlayerPoints[n] += this.gamePoints[n];
            //}
        }
    };
    GameOfPinochle.prototype.playRounds = function () {
        this.cpuDiscardCards();
        // ** play rounds **
        console.log('Starting game ');
        for (var round = 1; round <= this.CARDS_DEALT; round++) {
            this.round = round;
            this.playRound();
        }
    };
    GameOfPinochle.prototype.getStats = function () {
        for (var n = 0; n < this.NumberOfPlayers; n++) {
            console.log("Player " + n + " totalPlayerPoints: " + this.totalPlayerPoints[n]);
            console.log("Bids: " + this.playerKeptBids[n] + '/' + this.playerBids[n]);
        }
        console.log(JSON.stringify(this.winningCards));
        console.log(JSON.stringify(this.winningCardCount));
        for (var n = 0; n < 12; n++) {
            if (this.winningCardCount[n] > 0) {
                console.log(" " + Cards_1["default"].getRankStr((n * 2) % 12) +
                    " avg. totalPlayerPoints: " + this.winningCards[n] / this.winningCardCount[n]);
            }
        }
        console.log("Kept playerBids: " + this.keptBids);
    };
    return GameOfPinochle;
}());
exports["default"] = GameOfPinochle;
//# sourceMappingURL=GameOfPinochle.js.map