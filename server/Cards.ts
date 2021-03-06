'use strict';

export default class Cards {

  static suits: String[] = ["♠", "♥", "♣", "♦"];
  static ranks: String[] = ["A", "10", "K", "Q", "J", "9"];
  static SUITS = 4;
  static PACKS = 2;
  static RANKS = 6;
  static CARDSINDECK = Cards.SUITS * Cards.RANKS * Cards.PACKS;
  static CARDSINSUIT = Cards.RANKS * Cards.PACKS;

  constructor() {
  }

  static getSuit(card) {
    if (card >= 0 && card < Cards.CARDSINDECK) {
      return Math.floor(card / Cards.CARDSINSUIT);
    } else {
      return null;
    }
  }

  static getRank(card) {
    if (card >= 0 && card < Cards.CARDSINDECK) {
      return Math.floor((card % Cards.CARDSINSUIT) / Cards.PACKS);
    } else {
      return Cards.RANKS;
    } // lowest ranking card
  }

  static getPoints(card) {
    if (card >= 0 && card < Cards.CARDSINDECK) {
      return 10  - Math.floor((card % Cards.CARDSINSUIT) / Cards.PACKS / 2) * 5;
    } else {
      return 0;
    }
  }

  static isLowerCard(card) {
    return this.getRankStr(card) == '10' || this.getRankStr(card) == 'Q' || this.getRankStr(card) == '9';
  }
  static getSuitStr(card): String {
    if (card >= 0 && card < Cards.CARDSINDECK) {
      return Cards.suits[Math.floor(card / Cards.CARDSINSUIT)];
    } else {
      return "(no card)";
    }
  }

  static getRankStr(card): String {
    if (card >= 0 && card < Cards.CARDSINDECK) {
      return Cards.ranks[Math.floor((card % Cards.CARDSINSUIT) / Cards.PACKS)];
    } else {
      return "(no card)";
    }
  }

  static cardString(card: number): String {
    if (card === null) {
      throw 'Card is null';
//      return "(no card)";
    }
    return Cards.getRankStr(card) + "" + Cards.getSuitStr(card);
  }

}
