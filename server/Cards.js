'use strict';
var Cards = (function () {
    function Cards() {
    }
    Cards.getSuit = function (card) {
        if (card >= 0 && card < Cards.CARDSINDECK) {
            return Math.floor(card / Cards.CARDSINSUIT);
        }
        else {
            return null;
        }
    };
    Cards.getRank = function (card) {
        if (card >= 0 && card < Cards.CARDSINDECK) {
            return Math.floor((card % Cards.CARDSINSUIT) / Cards.PACKS);
        }
        else {
            return Cards.RANKS;
        } // lowest ranking card
    };
    Cards.getSuitStr = function (card) {
        if (card >= 0 && card < Cards.CARDSINDECK) {
            return Cards.suits[Math.floor(card / Cards.CARDSINSUIT)];
        }
        else {
            return "(no card)";
        }
    };
    Cards.getRankStr = function (card) {
        if (card >= 0 && card < Cards.CARDSINDECK) {
            return Cards.ranks[Math.floor((card % Cards.CARDSINSUIT) / Cards.PACKS)];
        }
        else {
            return "(no card)";
        }
    };
    Cards.cardString = function (card) {
        if (card === null) {
            return "(no card)";
        }
        return Cards.getRankStr(card) + "" + Cards.getSuitStr(card);
    };
    Cards.suits = ["♠", "♥", "♣", "♦"];
    Cards.ranks = ["A", "10", "K", "Q", "J", "9"];
    Cards.SUITS = 4;
    Cards.PACKS = 2;
    Cards.RANKS = 6;
    Cards.CARDSINDECK = Cards.SUITS * Cards.RANKS * Cards.PACKS;
    Cards.CARDSINSUIT = Cards.RANKS * Cards.PACKS;
    return Cards;
}());
exports.__esModule = true;
exports["default"] = Cards;
//# sourceMappingURL=Cards.js.map