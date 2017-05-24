'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SetOfCards_1 = require("./SetOfCards");
var Deck = (function (_super) {
    __extends(Deck, _super);
    function Deck(cType, maxCards) {
        _super.call(this, cType, maxCards);
        this.cardType = cType;
        this.reset();
    }
    Deck.prototype.shuffle = function () {
        var m;
        var tmp;
        for (var n = 0; n < this.cardCount; n++) {
            m = Math.floor(Math.random() * this.cardCount);
            tmp = this.cards[n];
            this.cards[n] = this.cards[m];
            this.cards[m] = tmp;
        }
    };
    Deck.prototype.getCard = function () {
        if (this.cardCount == 0) {
            return null;
        }
        this.cardCount--;
        //  System.out.println("cc: " + this.cardCount);
        return this.cards[this.cardCount];
    };
    Deck.prototype.dealCards = function (cardCount) {
        var deltCards = [];
        for (var n = 0; n < cardCount; n++)
            deltCards[n] = this.getCard();
        //       this.cards.addCard(getCard());
        return deltCards;
    };
    Deck.prototype.reset = function () {
        this.cardCount = this.maxCardCount;
        for (var n = 0; n < this.cardCount; n++)
            this.cards[n] = n;
        this.shuffle();
    };
    return Deck;
}(SetOfCards_1["default"]));
exports.__esModule = true;
exports["default"] = Deck;
//# sourceMappingURL=Deck.js.map