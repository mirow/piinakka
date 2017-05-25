'use strict';
import Cards from './Cards';
import Util from './Util';

export default class SetOfCards extends Cards {

  cardCount: number;
  maxCardCount: number;
  cards: number[];
  sorted: boolean = false;
  subset: SetOfCards;

  constructor(maxCards: number) {
    super();
    this.cardCount = 0;
    this.maxCardCount = maxCards;
    this.cards = [];
    for (let n = 0; n < this.maxCardCount; n++) this.cards[n] = null;
  }

  SetOfCards(newCards, cCount) {
    this.maxCardCount = newCards.length;

    this.cardCount = cCount;
    this.cards = newCards;

    for (let n = cCount; n < this.maxCardCount; n++)
      this.cards[n] = null;
  }

  addCard(cardValue) {
    if (this.cardCount == this.maxCardCount) {
      return false;
    }
    this.cards[this.cardCount] = cardValue;
    this.cardCount++;
    this.sorted = false;
    return true;
  }

  addSetOfCards(newCards: SetOfCards): boolean {
    if (this.cardCount == this.maxCardCount) {
      return false;
    }
    i: for (let i = 0; i < newCards.cardCount; i++) {
      for (let j = 0; j < this.cardCount; j++)
        if (this.cards[j] == newCards.cards[i]) {
          continue i;
        }
      this.addCard(newCards.cards[i]);
    }
    this.sorted = false;
    return true;
  }

  addCards(newCards: number[]): SetOfCards {
    if (this.cardCount == this.maxCardCount) {
      return this;
    }
    for (let i = 0; i < newCards.length; i++) {
      this.addCard(newCards[i]);
    }
    this.sorted = false;
    return this;
  }

  /**
   * Removes the given card number from this set
   * @param cardValue card number
   * @return card number
   */
  removeCard(cardValue) {
    for (let n = 0; n < this.cardCount; n++) {
      if (this.cards[n] != cardValue) {
      } else {
        if (this.sorted) { // if the cards are sorted, keep them that way
          for (let m = n; m < this.cardCount - 1; m++)
            this.cards[m] = this.cards[m + 1];
        } else {
          this.cards[n] = this.cards[this.cardCount - 1];
        }
        this.cards[this.cardCount - 1] = null;
        this.cardCount--;
        return cardValue;
      }
    }

  }

  toString(): String {
    let tmp: String = "";
    if (this.cardCount == 0) {
      return "(no cards)";
    }
    for (let n = 0; n < this.cardCount; n++) {
      if (n > 0) {
        tmp += ", ";
      }
      tmp += Cards.cardString(this.cards[n]) + " (" + this.cards[n] + ")";
    }
    return tmp;
  }

  sortCards() {
//      cards=
    Util.ArraySort(this.cards, this.cardCount);
    this.sorted = true;
  }

  /**
   * Sort cards by rank, putting trump cards last
   * @param trump
   */
  sortCardsByRank(trump) {
    let swapped: boolean;
    let n;
    let tmp;
    n = this.cardCount;
    do {
      swapped = false;
      for (let i = 0; i < n - 1; i++) {
        if ((Cards.getSuit(this.cards[i + 1]) == trump) && (Cards.getSuit(this.cards[i]) != trump)) {
          // don't swap, 'cos other is trump
        } else if (Cards.getSuit(this.cards[i]) == trump && Cards.getSuit(this.cards[i + 1]) != trump) {
          // this one is trump, other is not, so swap
          tmp = this.cards[i];
          this.cards[i] = this.cards[i + 1];
          this.cards[i + 1] = tmp;
          swapped = true;
        } else if (Cards.getRank(this.cards[i]) < Cards.getRank(this.cards[i + 1])) {
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
  }

  containsCards(targets: number[]) {
    let tmp = new SetOfCards(15);

    let cardsMissing = targets.length;
    for (let i = 0; i < targets.length; i++) {
      if (this.cardExists(targets[i])) {
        cardsMissing--;
        tmp.addCard(targets[i]);
      }
    }
    if (cardsMissing == 0) {
      this.subset.addSetOfCards(tmp);
//        System.out.println("Adding " +tmp);
    }

    return cardsMissing;
  }

  containsOneOfEach(targets: number[][]) {
    let tmp = new SetOfCards(15);

    let cardsMissing = targets.length;
    let cardsFound: boolean = false;
    for (let i = 0; i < targets.length; i++) { // check each set of cards
      cardsFound = false;
      for (let j = 0; j < targets[i].length; j++) { // check each card in set
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
      this.subset.addSetOfCards(tmp);
//        System.out.println("Adding " +tmp);
    }
    return cardsMissing; // at least one card in each set was found
  }

  cardExists(card): boolean {
    if (!this.sorted) {
      this.sortCards();
    }
    for (let i = 0; i < this.cardCount; i++) {
      if (this.cards[i] == card) {
        return true;
      }
      if (this.cards[i] > card) {
        return false;
      }
    }
    return false;
  }

  clear() {
    this.cardCount = 0;
    for (let n = 0; n < this.maxCardCount; n++) this.cards[n] = null;
  }

  isHigherCard(cardPlayed, highestCard, trump): boolean {
    if (highestCard === null) {
      return true;
    } // this is the first card played, so it's the highest
    if (Cards.getSuit(cardPlayed) == trump) { // this card is trump
      return !!(Cards.getSuit(highestCard) != trump || Cards.getRank(cardPlayed) < Cards.getRank(highestCard));
    } else { // this card is not trump
      return !!(Cards.getSuit(highestCard) != trump && Cards.getRank(cardPlayed) < Cards.getRank(highestCard) &&
      Cards.getSuit(cardPlayed) == Cards.getSuit(highestCard));
    }
  }

  getCardBySuit(suit, count) {
//      console.log("getcardbysuit "+suit+" "+count);
    if (!this.sorted) {
      this.sortCards();
    }
    let i = 0;
    for (let n = 0; n < this.cardCount; n++) {
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
  }


  calculatePoints(round: number) {
    let sum: number = 0;
    for (let n: number = 0; n < this.cardCount; n++) {
      if (this.cards[n] % 12 < 4) {
        sum += 10;
      } else if (this.cards[n] % 12 < 8) {
        sum += 5;
      }
    }
    if (round == 11) {
      sum += 10;
    }
    return sum;
  }

}

