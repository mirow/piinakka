'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const SetOfCards_1 = require("./SetOfCards");
const Util_1 = require("./Util");
class Deck extends SetOfCards_1.default {
    constructor(maxCards) {
        super(maxCards);
        this.reset();
    }
    shuffle() {
        let m;
        let tmp;
        for (let n = 0; n < this.cardCount; n++) {
            m = Math.floor(Util_1.default.random() * this.cardCount);
            tmp = this.cards[n];
            this.cards[n] = this.cards[m];
            this.cards[m] = tmp;
            //System.out.println("this.cards[m]: " + this.cards[m]);
        }
    }
    getCard() {
        if (this.cardCount == 0) {
            return null;
        }
        this.cardCount--;
        //  System.out.println("cc: " + this.cardCount);
        return this.cards[this.cardCount];
    }
    dealCards(cardCount) {
        let deltCards = [];
        for (let n = 0; n < cardCount; n++)
            deltCards[n] = this.getCard();
        //       this.cards.addCard(getCard());
        return deltCards;
    }
    reset() {
        this.cardCount = this.maxCardCount;
        for (let n = 0; n < this.cardCount; n++)
            this.cards[n] = n;
        this.shuffle();
    }
}
Deck.seed = 1;
exports.default = Deck;
//# sourceMappingURL=Deck.js.map