'use strict';
import Cards from './Cards';
import SetOfCards from "./SetOfCards";

export default class Deck extends SetOfCards {

  static seed = 1;

  constructor(maxCards: number) {
    super(maxCards);
    this.reset();
  }

  static random() {
    var x = Math.sin(Deck.seed++) * 10000;
    return x - Math.floor(x);
  }

  shuffle() {
    let m: number;
    let tmp: number;

    for (let n = 0; n < this.cardCount; n++) {
      m = Math.floor(Deck.random() * this.cardCount);
      tmp = this.cards[n];
      this.cards[n] = this.cards[m];
      this.cards[m] = tmp;
      //System.out.println("this.cards[m]: " + this.cards[m]);
    }
  }

  getCard(): number {
    if (this.cardCount == 0) {
      return null;
    }
    this.cardCount--;
    //  System.out.println("cc: " + this.cardCount);
    return this.cards[this.cardCount];
  }

  dealCards(cardCount): number[] {
    let deltCards = [];
    for (let n = 0; n < cardCount; n++)
      deltCards[n] = this.getCard();
//       this.cards.addCard(getCard());
    return deltCards;
  }

  reset() {
    this.cardCount = this.maxCardCount;
    for (let n = 0; n < this.cardCount; n++) this.cards[n] = n;
    this.shuffle();
  }
}
