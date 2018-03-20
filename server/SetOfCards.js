'use strict';
exports.__esModule = true;
var Cards_1 = require("./Cards");
var Util_1 = require("./Util");
var SetOfCards = /** @class */ (function () {
    function SetOfCards(maxCards) {
        this.sorted = false;
        this.cardCount = 0;
        this.maxCardCount = maxCards;
        this.cards = [];
    }
    SetOfCards.dummySet = function (count, maxCount) {
        var set = new SetOfCards(maxCount);
        for (var n = 0; n < count; n++)
            set.cards[n] = -1;
        set.cardCount = count;
        return set;
    };
    SetOfCards.prototype.addCard = function (cardValue) {
        if (this.cardCount == this.maxCardCount) {
            console.log('tried to add card, but already had full amount ' + this.maxCardCount);
            return false;
        }
        this.cards[this.cardCount++] = cardValue;
        this.sorted = false;
        return true;
    };
    SetOfCards.prototype.addSetOfCards = function (newCards) {
        if (this.cardCount == this.maxCardCount) {
            console.log('tried to add card, but already had full amount ' + this.maxCardCount);
            return false;
        }
        i: for (var i = 0; i < newCards.cardCount; i++) {
            for (var j = 0; j < this.cardCount; j++)
                if (this.cards[j] == newCards.cards[i]) {
                    continue i;
                }
            this.addCard(newCards.cards[i]);
        }
        this.sorted = false;
        return true;
    };
    SetOfCards.prototype.addCards = function (newCards) {
        if (this.cardCount == this.maxCardCount) {
            return this;
        }
        for (var i = 0; i < newCards.length; i++) {
            this.addCard(newCards[i]);
        }
        this.sorted = false;
        return this;
    };
    /**
     * Removes the given card number from this set
     * @param cardValue card number
     * @return card number
     */
    SetOfCards.prototype.removeCard = function (cardValue) {
        for (var n = 0; n < this.cardCount; n++) {
            if (this.cards[n] != cardValue) {
            }
            else {
                if (this.sorted) {
                    for (var m = n; m < this.cardCount - 1; m++)
                        this.cards[m] = this.cards[m + 1];
                }
                else {
                    this.cards[n] = this.cards[this.cardCount - 1];
                }
                this.cards[this.cardCount - 1] = null;
                this.cardCount--;
                return cardValue;
            }
        }
    };
    SetOfCards.prototype.toString = function () {
        var tmp = "";
        if (this.cardCount == 0) {
            return "(no cards)";
        }
        for (var n = 0; n < this.cardCount; n++) {
            if (n > 0) {
                tmp += ", ";
            }
            tmp += Cards_1["default"].cardString(this.cards[n]) + " (" + this.cards[n] + ")";
        }
        return tmp;
    };
    SetOfCards.prototype.sortCards = function () {
        //      cards=
        Util_1["default"].ArraySort(this.cards, this.cardCount);
        this.sorted = true;
    };
    /**
     * Sort cards by rank, putting trump cards last
     * @param trump
     */
    SetOfCards.prototype.sortCardsByRank = function (trump) {
        var swapped;
        var n;
        var tmp;
        n = this.cardCount;
        do {
            swapped = false;
            for (var i = 0; i < n - 1; i++) {
                if ((Cards_1["default"].getSuit(this.cards[i + 1]) == trump) && (Cards_1["default"].getSuit(this.cards[i]) != trump)) {
                    // don't swap, 'cos other is trump
                }
                else if (Cards_1["default"].getSuit(this.cards[i]) == trump && Cards_1["default"].getSuit(this.cards[i + 1]) != trump) {
                    // this one is trump, other is not, so swap
                    tmp = this.cards[i];
                    this.cards[i] = this.cards[i + 1];
                    this.cards[i + 1] = tmp;
                    swapped = true;
                }
                else if (Cards_1["default"].getRank(this.cards[i]) < Cards_1["default"].getRank(this.cards[i + 1])) {
                    // neither are trump, or both are trump, so sort by rank
                    tmp = this.cards[i];
                    this.cards[i] = this.cards[i + 1];
                    this.cards[i + 1] = tmp;
                    swapped = true;
                }
            }
            n--;
        } while (swapped);
        this.sorted = true;
    };
    SetOfCards.prototype.containsCards = function (targets, meldCards) {
        var tmp = new SetOfCards(15);
        var cardsMissing = targets.length;
        for (var i = 0; i < targets.length; i++) {
            if (this.cardExists(targets[i])) {
                cardsMissing--;
                tmp.addCard(targets[i]);
            }
        }
        if (cardsMissing == 0) {
            meldCards.addSetOfCards(tmp);
            //        System.out.println("Adding " +tmp);
        }
        return cardsMissing;
    };
    SetOfCards.prototype.containsOneOfEach = function (targets, meldCards) {
        var tmp = new SetOfCards(15);
        var cardsMissing = targets.length;
        var cardsFound = false;
        for (var i = 0; i < targets.length; i++) {
            cardsFound = false;
            for (var j = 0; j < targets[i].length; j++) {
                cardsFound = cardsFound || this.cardExists(targets[i][j]);
                if (cardsFound) {
                    cardsMissing--;
                    tmp.addCard(targets[i][j]);
                    break; // card found, no need to check rest of set
                }
            }
            //        if (!cardsFound) return false; // no cards in set were found
        }
        if (cardsMissing == 0) {
            meldCards.addSetOfCards(tmp);
            //        System.out.println("Adding " +tmp);
        }
        return cardsMissing; // at least one card in each set was found
    };
    SetOfCards.prototype.cardExists = function (card) {
        if (!this.sorted) {
            this.sortCards();
        }
        for (var i = 0; i < this.cardCount; i++) {
            if (this.cards[i] == card) {
                return true;
            }
            if (this.cards[i] > card) {
                return false;
            }
        }
        return false;
    };
    SetOfCards.prototype.clear = function () {
        this.cardCount = 0;
        this.cards = [];
    };
    SetOfCards.prototype.isHigherCard = function (cardPlayed, highestCard, trump) {
        if (highestCard === null) {
            return true;
        } // this is the first card played, so it's the highest
        if (Cards_1["default"].getSuit(cardPlayed) == trump) {
            return (Cards_1["default"].getSuit(highestCard) != trump || Cards_1["default"].getRank(cardPlayed) < Cards_1["default"].getRank(highestCard));
        }
        else {
            return (Cards_1["default"].getSuit(highestCard) != trump && Cards_1["default"].getRank(cardPlayed) < Cards_1["default"].getRank(highestCard) &&
                Cards_1["default"].getSuit(cardPlayed) == Cards_1["default"].getSuit(highestCard));
        }
    };
    SetOfCards.prototype.getCardBySuit = function (suit, count) {
        //      console.log("getcardbysuit "+suit+" "+count);
        if (!this.sorted) {
            this.sortCards();
        }
        var i = 0;
        for (var n = 0; n < this.cardCount; n++) {
            if (Math.floor(this.cards[n] / 12) == suit) {
                if (i == count) {
                    //          console.log("getcardbysuit returning " +
                    //                               Cards.cardString(this.cards[n]));
                    return this.cards[n];
                }
                i++;
            }
        }
        return null;
    };
    SetOfCards.prototype.calculatePoints = function (round) {
        var sum = 0;
        for (var n = 0; n < this.cardCount; n++) {
            if (this.cards[n] % 12 < 4) {
                sum += 10;
            }
            else if (this.cards[n] % 12 < 8) {
                sum += 5;
            }
        }
        if (round == 11) {
            sum += 10;
        }
        return sum;
    };
    return SetOfCards;
}());
exports["default"] = SetOfCards;
//# sourceMappingURL=SetOfCards.js.map