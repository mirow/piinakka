'use strict';
var Cards = (function () {
    function Cards() {
        this.suits = ["♠", "♥", "♣", "♦"];
        this.ranks = ["A", "10", "K", "Q", "J", "9"];
        this.SUITS = 4;
        this.PACKS = 2;
        this.RANKS = 6;
        this.CARDSINDECK = this.SUITS * this.RANKS * this.PACKS;
        this.CARDSINSUIT = this.RANKS * this.PACKS;
    }
    Cards.prototype.getSuit = function (card) {
        if (card >= 0 && card < this.CARDSINDECK) {
            return Math.floor(card / this.CARDSINSUIT);
        }
        else {
            return null;
        }
    };
    Cards.prototype.getRank = function (card) {
        if (card >= 0 && card < this.CARDSINDECK) {
            return Math.floor((card % this.CARDSINSUIT) / this.PACKS);
        }
        else {
            return this.RANKS;
        } // lowest ranking card
    };
    Cards.prototype.getSuitStr = function (card) {
        if (card >= 0 && card < this.CARDSINDECK) {
            return this.suits[Math.floor(card / this.CARDSINSUIT)];
        }
        else {
            return "(no card)";
        }
    };
    Cards.prototype.getRankStr = function (card) {
        if (card >= 0 && card < this.CARDSINDECK) {
            return this.ranks[Math.floor((card % this.CARDSINSUIT) / this.PACKS)];
        }
        else {
            return "(no card)";
        }
    };
    Cards.prototype.cardString = function (card) {
        if (card === null) {
            return "(no card)";
        }
        return this.getRankStr(card) + "" + this.getSuitStr(card);
    };
    return Cards;
}());
exports.__esModule = true;
exports["default"] = Cards;
//# sourceMappingURL=Cards.js.map