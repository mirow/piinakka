'use strict';

export default class Cards {

  suits: String[] = ["♠", "♥", "♣", "♦"];
  ranks: String[] = ["A", "10", "K", "Q", "J", "9"];
  SUITS = 4;
  PACKS = 2;
  RANKS = 6;
  CARDSINDECK = this.SUITS * this.RANKS * this.PACKS;
  CARDSINSUIT = this.RANKS * this.PACKS;

  constructor() {
  }

  getSuit(card) {
    if (card >= 0 && card < this.CARDSINDECK) {
      return Math.floor(card / this.CARDSINSUIT);
    } else {
      return null;
    }
  }

  getRank(card) {
    if (card >= 0 && card < this.CARDSINDECK) {
      return Math.floor((card % this.CARDSINSUIT) / this.PACKS);
    } else {
      return this.RANKS;
    } // lowest ranking card
  }

  getSuitStr(card): String {
    if (card >= 0 && card < this.CARDSINDECK) {
      return this.suits[Math.floor(card / this.CARDSINSUIT)];
    } else {
      return "(no card)";
    }
  }

  getRankStr(card): String {
    if (card >= 0 && card < this.CARDSINDECK) {
      return this.ranks[Math.floor((card % this.CARDSINSUIT) / this.PACKS)];
    } else {
      return "(no card)";
    }
  }

  cardString(card: number): String {
    if (card === null) {
      return "(no card)";
    }
    return this.getRankStr(card) + "" + this.getSuitStr(card);
  }

}
