'use strict';
import Cards from './Cards';
import SetOfCards from './SetOfCards';
import Deck from './Deck';
import Player from './Player';
import Util from './Util';

export default class GameOfPinochle {
  NumberOfPlayers: number = 4;

  stats: number[] = [];
  hela: boolean = false;
  dubbelhela: boolean = false;

  constructor() {
    let trump: number;
    let CARDS_DEALT: number = 11;
    let MAX_CARDS: number = 15;
    let deck: Deck = new Deck(Cards.CARDSINDECK);
    let player: Player[] = [];
    let cardsOnTable: SetOfCards = new SetOfCards(this.NumberOfPlayers);
    let talon: SetOfCards = new SetOfCards(this.NumberOfPlayers);
    let totalPlayerPoints: number[] = [0, 0, 0, 0];
    let gamePlayerPoints: number[] = [];
    let winningCards: number[] = [0,0,0,0,0,0,0,0,0,0,0,0];
    let winningCardCount: number[] = [0,0,0,0,0,0,0,0,0,0,0,0];

    let starter: number; // player who wins the bid and starts taking tricks
    let current: number; // current player (who is playing a card)
    let dealer: number = null; // player who is dealing the cards
    let bidWinner: number = null;
    let keptBids: number = 0;

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

      // *** Deal cards and check for totalPlayerPoints for each player ****
      for (let n: number = dealer + 1; n < dealer + 1 + this.NumberOfPlayers; n++) {
        let m: number = n % this.NumberOfPlayers;
        player[m].newGame();
        player[m].addCards(deck.dealCards(11), true);
        player[m].myCards.sortCards();
        gamePlayerPoints[m] = 0;
        let myTrump: number = player[m].bidForTrump();
        if (myTrump !== null && (player[m].points + player[m].trickPoints + player[m].potpoints) > highestScore) {
          trump = myTrump;
          highestScore = player[m].points + player[m].trickPoints + player[m].potpoints;
          bidWinner = m;
        }
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

      // **
      starter = bidWinner;
      console.log("Player " + starter + " wins the bid for " +
        Math.round(player[bidWinner].points) + "+" + Math.round(7 * player[bidWinner].trickPoints / 10) +
        "+" + Math.round(player[bidWinner].potpoints) + "=" + Math.round(highestScore));
      for (let i: number = 0; i < CARDS_DEALT; i++) {
        if (Cards.getSuit(player[starter].myCards.cards[i]) == trump) {
          winningCardCount[Cards.getRank(player[starter].myCards.cards[i])]++;
        } else {
          winningCardCount[Cards.getRank(player[starter].myCards.cards[i]) + 6]++;
        }
      }

      // ** talon winner picks up talon **
      player[starter].addCards(talon.cards, false);
      trump = player[starter].bidForTrump();
      player[starter].checkForPoints(trump);

      // *** each player updates their card status info ***
      for (let n: number = dealer + 1; n < dealer + 1 + this.NumberOfPlayers; n++) {
        let m: number = n % this.NumberOfPlayers;
        if (m == starter) {
          console.log("Player " + m + ": " + Math.round(player[m].points) +
            " with " + player[m].pointCards[trump] + ". Trump: " + Cards.suits[trump]);
        } else {
          let bestOffer: number = player[m].points;
          let trickPoints: number = player[m].trickPoints;
          player[m].checkForPoints(trump);

          console.log("Player " + m + ": " + player[m].points +
            (player[m].points > 0 ?
            " with " + player[m].pointCards[trump] + ". " +
            (bestOffer > 0 ?
            "Bid: " + Math.round(bestOffer) + "+" + Math.round(player[m].potpoints) + "+" + Math.round(trickPoints) + "=" +
            Math.round(bestOffer + trickPoints + player[m].potpoints) : "") : ""));

        }
        for (let i: number = 0; i < this.NumberOfPlayers; i++)
          player[i].updateCardsStatus(player[m].myCards.subset, 2 << m, m == starter);
        gamePlayerPoints[m] = player[m].points;
      }

      // ** talon winner discards cards **
      let discarded = player[starter].discardCards(4, trump);
      console.log('Discarded: ' + discarded);
      console.log('Starter (' + starter + ') cards: ' + player[starter].myCards);

      // ** play rounds **
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
        let winningPlayer: number = starter;

        // *** each player plays a card ***
        for (let n: number = starter; n < starter + this.NumberOfPlayers; n++) {
          current = n % this.NumberOfPlayers;
          playersRemaining &= ~(2 << current);
          let cardPlayed: number = player[current].playCard(cardsOnTable, trump, highestCard, playersRemaining);
          cardsOnTable.addCard(cardPlayed);

          console.log(current+" Cards on table: " + cardsOnTable);

          // ** notify other players that card has been played **
          for (let i: number = 0; i < this.NumberOfPlayers; i++)
            player[i].cardStatusNotification(cardPlayed, 2 << current,
              highestCard, Cards.getSuit(cardsOnTable.cards[0]), trump);


          if (cardsOnTable.isHigherCard(cardPlayed, highestCard, trump)) {
            highestCard = cardPlayed;
            winningPlayer = current;
          }

        }
//        console.log(round+" Cards on table: " + cardsOnTable);

        // ** calculate totalPlayerPoints for winner ***
        let pts: number = cardsOnTable.calculatePoints(round);
        gamePlayerPoints[winningPlayer] += pts;
        console.log("Player " + winningPlayer + " wins round " +
          round + " for " + pts + " totalPlayerPoints, with " + Cards.cardString(highestCard));
        starter = winningPlayer;

        // ** calculate stats for bidWinner **
        if (winningPlayer == bidWinner) {
          if (Cards.getSuit(highestCard) == trump) {
            winningCards[Cards.getRank(highestCard)] += pts;
          } else {
            winningCards[Cards.getRank(highestCard) + 6] += pts;
          }
        }
      }
      // ** game over **
      for (let n: number = 0; n < this.NumberOfPlayers; n++) {
        console.log("Player " + n + " totalPlayerPoints: " + gamePlayerPoints[n]);
        if (n == bidWinner) {
          if (gamePlayerPoints[n] >= highestScore) {
            keptBids++;
          }
        }
        if (gamePlayerPoints[n] > player[n].points) // player took a trick
        {
          totalPlayerPoints[n] += gamePlayerPoints[n];
        }
      }
    }
    for (let n: number = 0; n < this.NumberOfPlayers; n++) {
      console.log("Player " + n + " total totalPlayerPoints: " + totalPlayerPoints[n]);
    }
    console.log(JSON.stringify(winningCards));
    console.log(JSON.stringify(winningCardCount));
    for (let n: number = 0; n < 12; n++) {
      if (winningCardCount[n] > 0) {
        console.log(" " + Cards.getRankStr((n * 2) % 12) +
          " avg. totalPlayerPoints: " + winningCards[n] / winningCardCount[n]);
      }
    }
    console.log("Kept bids: " + keptBids);

  }


}
