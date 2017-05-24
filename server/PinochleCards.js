'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Cards_1 = require('./Cards');
var PinochleCards = (function (_super) {
    __extends(PinochleCards, _super);
    function PinochleCards() {
        _super.call(this);
        this.suits = ["Spade", "Hearts", "Clubs", "Diamonds"];
        this.ranks = ["A", "10", "K", "Q", "J", "9"];
        this.SUITS = 4;
        this.PACKS = 2;
        this.RANKS = 6;
        this.CARDSINDECK = this.SUITS * this.RANKS * this.PACKS;
        this.CARDSINSUIT = this.RANKS * this.PACKS;
    }
    PinochleCards.prototype.getSuit = function (card) {
        if (card >= 0 && card < this.CARDSINDECK) {
            return card / this.CARDSINSUIT;
        }
        else {
            return -1;
        }
    };
    PinochleCards.prototype.getRank = function (card) {
        if (card >= 0 && card < this.CARDSINDECK) {
            return (card % this.CARDSINSUIT) / this.PACKS;
        }
        else {
            return this.RANKS;
        } // lowest ranking card
    };
    PinochleCards.prototype.getSuitStr = function (card) {
        if (card >= 0 && card < this.CARDSINDECK) {
            return this.suits[card / this.CARDSINSUIT];
        }
        else {
            return "(no card)";
        }
    };
    PinochleCards.prototype.getRankStr = function (card) {
        if (card >= 0 && card < this.CARDSINDECK) {
            return this.RANKS[(card % this.CARDSINSUIT) / this.PACKS];
        }
        else {
            return "(no card)";
        }
    };
    return PinochleCards;
}(Cards_1["default"]));
exports.__esModule = true;
exports["default"] = PinochleCards;
//# sourceMappingURL=PinochleCards.js.map