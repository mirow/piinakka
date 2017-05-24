'use strict';
import Cards from './Cards';
import SetOfCards from './SetOfCards';
import Deck from './Deck';
import Player from './Player';
import Util from './Util';

export default class GameOfPinochle {
  cardType: Cards = new Cards();
  NumberOfPlayers: number = 4;

  stats: number[] = [];
  hela: boolean = false;
  dubbelhela: boolean = false;

  constructor() {
    let trump: number;
    let CARDS_DEALT: number = 11;
    let MAX_CARDS: number = 15;
    let deck: Deck = new Deck(this.cardType, this.cardType.CARDSINDECK);
    let player: Player[] = [];
    let cardsOnTable: SetOfCards = new SetOfCards(this.cardType, this.NumberOfPlayers);
    let talon: SetOfCards = new SetOfCards(this.cardType, this.NumberOfPlayers);
    let points: number[] = [0, 0, 0, 0];
    let gamepoints: number[] = [];
    let winningCards: number[] = [0,0,0,0,0,0,0,0,0,0,0,0];
    let wCardCount: number[] = [0,0,0,0,0,0,0,0,0,0,0,0];

    let starter: number; // player who wins the bid and starts taking tricks
    let current: number; // current player (who is playing a card)
    let dealer: number = null; // player who is dealing the cards
    let bidwinner: number = null;
    let keptbids: number = 0;

    for (let n: number = 0; n < this.NumberOfPlayers; n++) {
      player[n] = new Player(2 << n, this.NumberOfPlayers, MAX_CARDS);
    }
    player[0].playerStrategy = 1;
    player[1].playerStrategy = 1;
    player[2].playerStrategy = 1;
    player[3].playerStrategy = 1;

    for (let games: number = 0; games < 1; games++) {
      dealer = (dealer + 1) % this.NumberOfPlayers;
      deck.reset();
      console.log("Starting game " + games);

      starter = null;
      trump = null;
      let highestScore: number = 0;
      for (let n: number = dealer + 1; n < dealer + 1 + this.NumberOfPlayers; n++) {
        let m: number = n % this.NumberOfPlayers;player[m].newGame(2 << m);
        player[m].addCards(deck.dealCards(11), true);
        player[m].myCards.sortCards();
        gamepoints[m] = 0;
        let mytrump: number = player[m].bidForTrump();
        if (mytrump !== null && (player[m].points + player[m].trickPoints * 8 / 10 + player[m].potpoints) > highestScore) {
          trump = mytrump;
          highestScore = player[m].points + (player[m].trickPoints * 8 / 10) + player[m].potpoints;
          bidwinner = m;
        }
//        mytrump: boolean = player[n].checkForPoints(m);
     //   console.log("Player "+m+" "+Cards.getSuitStr(mytrump)+": "+player[m].points);
          console.log("Player "+m+" cards: "+player[m].myCards);
      }
      if (trump === null) { // no player can bid -> re-deal the cards
        console.log('No one can bid, redeal');
        continue;
      }
      talon.clear();
      talon.addCards(deck.dealCards(4));
      talon.sortCards();
      console.log("Talon cards: " + talon);
//      console.log("Talon cards: "+talon);
      starter = bidwinner;
      console.log("Player " + starter + " wins the bid for " +
        Math.round(player[bidwinner].points) + "+" + Math.round(7 * player[bidwinner].trickPoints / 10) +
        "+" + Math.round(player[bidwinner].potpoints) + "=" + Math.round(highestScore));
      for (let i: number = 0; i < CARDS_DEALT; i++) {
        if (Math.floor(player[starter].myCards.cards[i] / 12) == trump) {
          wCardCount[this.cardType.getRank(player[starter].myCards.cards[i])]++;
        } else {
          wCardCount[this.cardType.getRank(player[starter].myCards.cards[i]) + 6]++;
        }
      }
      player[starter].addCards(talon.cards, false);
      trump = player[starter].bidForTrump();
      player[starter].checkForPoints(trump);
      for (let n: number = dealer + 1; n < dealer + 1 + this.NumberOfPlayers; n++) {
        let m: number = n % this.NumberOfPlayers;
        if (m == starter) {

          console.log("Player " + m + ": " + Math.round(player[m].points) +
            " with " + player[m].pointCards[trump] +
            ". Trump: " +
            this.cardType.suits[trump]);

          /*          console.log("Player " + starter + " wins the bid for " +
           player[m].points + "+" + player[m].trickPoints
           + "+" +player[m].potpoints +"=" + (bid) + " with " +
           player[m].pointCards[trump] +" ("+ player[m].posCards[trump]  + "). Trump: " +
           this.cardType.suits[trump]);
           */
//          console.log("Shown cards: "+player[m].myCards.subset);
          for (let i: number = 0; i < this.NumberOfPlayers; i++)
            player[i].cardOwnerNotification(player[m].myCards.subset, 2 << m, true);
        } else {
          let bestoffer: number = player[m].points;
          let tpoints: number = player[m].trickPoints;
          player[m].checkForPoints(trump);
          console.log("Player " + m + ": " + player[m].points +
            (player[m].points > 0 ?
            " with " + player[m].pointCards[trump] + ". " +
            (bestoffer > 0 ?
            "Bid: " + Math.round(bestoffer) + "+" + Math.round(player[m].potpoints) + "+" + Math.round(tpoints) + "=" +
            Math.round(bestoffer + tpoints + player[m].potpoints) : "") : ""));
//          console.log("Shown cards: "+player[m].myCards.subset);
          for (let i: number = 0; i < this.NumberOfPlayers; i++)
            player[i].cardOwnerNotification(player[m].myCards.subset, 2 << m, false);
        }
        gamepoints[m] = player[m].points;
      }
      let discarded = player[starter].discardCards(4, trump);
      console.log('Discarded: ' + discarded);
      player[starter].myCards.sortCards();
      console.log('Starter (' + starter + ') cards: ' + player[starter].myCards);

      console.log('Starting game ');
      for (let round: number = 1; round <= CARDS_DEALT; round++) {
        console.log('Round ' + round);
        cardsOnTable.clear();

        for (let i: number = 0; i < this.NumberOfPlayers; i++) {
          player[i].myCards.sortCards();
//          console.log("Player " + i + " cards: " + player[i].myCards);
        }
        let highestCard: number = null;
        let playersRemaining: number = Util.power(2, this.NumberOfPlayers + 1) - 2; // 2 + 4 + 8 + 16;
        for (let n: number = starter; n < starter + this.NumberOfPlayers; n++) {
          current = n % this.NumberOfPlayers;
          playersRemaining &= ~(2 << current);
          let cardPlayed: number = player[current].playCard(cardsOnTable, trump,
            highestCard,
            playersRemaining);
          cardsOnTable.addCard(cardPlayed);
          console.log(current+" Cards on table: " + cardsOnTable);
          for (let i: number = 0; i < this.NumberOfPlayers; i++)
            player[i].cardStatusNotification(cardPlayed, 2 << current,
              highestCard,
              this.cardType.getSuit(cardsOnTable.
                cards[0]), trump,
              i);
          if (cardsOnTable.isHigherCard(cardPlayed, highestCard, trump)) {
            highestCard = cardPlayed;
          }

        }
//        console.log(round+" Cards on table: " + cardsOnTable);

        for (let n: number = 0; n < this.NumberOfPlayers; n++) {
          if (highestCard == cardsOnTable.cards[n]) {
            let winningPlayer: number = (n + starter) % this.NumberOfPlayers;
            let pts: number = this.calculatePoints(cardsOnTable, round);
            gamepoints[winningPlayer] += pts;
            console.log("Player " + winningPlayer + " wins round " +
                               round + " for " + pts + " points, with "+this.cardType.cardString(highestCard));
            starter = winningPlayer;
            if (winningPlayer == bidwinner) {
              if (this.cardType.getSuit(highestCard) == trump) {
                winningCards[this.cardType.getRank(highestCard)] += pts;
                //wCardCount[this.cardType.getRank(highestCard)]++;
              }
              else {
                winningCards[this.cardType.getRank(highestCard) + 6] += pts;
                //wCardCount[this.cardType.getRank(highestCard)+6]++;
              }
            }
            break;
          }
        }
//      player[0].printstatus();

      }
      for (let n: number = 0; n < this.NumberOfPlayers; n++) {
        console.log("Player " + n + " points: " + gamepoints[n]);
        if (n == bidwinner) {
          if (gamepoints[n] >= highestScore) {
            keptbids++;
          }
        }
        if (gamepoints[n] > player[n].points) // player took a trick
        {
          points[n] += gamepoints[n];
        }
      }
    }
    for (let n: number = 0; n < this.NumberOfPlayers; n++) {
      console.log("Player " + n + " total points: " + points[n]);
    }
    console.log(JSON.stringify(winningCards));
    console.log(JSON.stringify(wCardCount));
    for (let n: number = 0; n < 12; n++) {
      if (wCardCount[n] > 0) {
        console.log(" " + this.cardType.getRankStr((n * 2) % 12) +
          " avg. points: " + winningCards[n] / wCardCount[n]);
      }
    }
    console.log("Kept bids: " + keptbids);

  }

  calculatePoints(cardsOnTable: SetOfCards, round: number) {
    let sum: number = 0;
    for (let n: number = 0; n < this.NumberOfPlayers; n++) {
      if (cardsOnTable.cards[n] % 12 < 4) {
        sum += 10;
      } else if (cardsOnTable.cards[n] % 12 < 8) {
        sum += 5;
      }
    }
    if (round == 12) {
      sum += 10;
    }
    return sum;
  }


}
