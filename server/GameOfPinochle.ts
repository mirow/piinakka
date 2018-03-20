'use strict';
import Cards from './Cards';
import SetOfCards from './SetOfCards';
import Deck from './Deck';
import Player from './Player';
import Player2 from "./Player2";

export default class GameOfPinochle {
  NumberOfPlayers: number = 3;
  talonSize = this.NumberOfPlayers;

  trump: number;
  CARDS_DEALT: number = this.NumberOfPlayers == 3 ? 15 : 11;
  MAX_CARDS: number = this.NumberOfPlayers == 3 ? 18 : 15;
  deck: Deck = new Deck(Cards.CARDSINDECK);
  player: Player[] = [];
  cardsOnTable: SetOfCards;
  talon: SetOfCards;
  totalPlayerPoints: number[] = [0, 0, 0, 0];
  meldPoints: number[] = [];
  trickPoints: number[] = [];
  winningCards: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  winningCardCount: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  starter: number; // player who wins the bid and starts taking tricks
  dealer: number = 0; // player who is dealing the cards
  bidWinner: number = null;
  keptBids: number = 0;
  game: number = 0;
  winningBid: number = 0;

  state: string = "notStarted";
  private round: number;
  private gamePoints: number[] = [];
  private playerKeptBids: number[] = [0, 0, 0];
  private playerBids: number[] = [0, 0, 0];

  constructor() {
//    for (let n: number = 0; n < this.NumberOfPlayers; n++) {
    this.player[0] = new Player(2 << 0, this.NumberOfPlayers, this.MAX_CARDS);
    this.player[1] = new Player(2 << 1, this.NumberOfPlayers, this.MAX_CARDS);
    this.player[2] = new Player(2 << 2, this.NumberOfPlayers, this.MAX_CARDS);
//    this.player[3] = new Player(2 << 3, this.NumberOfPlayers, this.MAX_CARDS);
    //  }
    this.player[0].playerStrategy = 1;
    this.player[1].playerStrategy = 1;
    this.player[2].playerStrategy = 1;
//    this.player[3].playerStrategy = 1;
    this.player[0].oddsLimit = 40;
    this.player[1].oddsLimit = 40;
    this.player[2].oddsLimit = 40;
//    this.player[3].oddsLimit = 50;
  }

  getState() {
    let playerData = [];
    for (let n = 0; n < this.NumberOfPlayers; n++) {
      playerData.push({
        cards: (this.state == "cannotBid" || this.state == "notStarted") ? this.player[n].myCards : this.player[n].myCards,  //SetOfCards.dummySet(this.player[n].myCards.cardCount, 15),
        meldCards: (this.state == "meldsShown") ? this.player[n].meldCards : SetOfCards.dummySet(0, 4),
        id: this.player[n].myPlayerID,
        strategy: this.player[n].playerStrategy,
        bid: Math.ceil(this.player[n].myBid / 5) * 5,
        stack: Array.from(Array(this.player[n].stack), () => Math.floor(Math.random() * 5 - 2.5)),
        meldPoints: this.meldPoints[n],
        trickPoints: this.trickPoints[n],
        gamePoints: this.gamePoints[n]
      });
    }
    return {
      players: playerData,
      dealer: this.dealer,
      bidWinner: this.bidWinner,
      game: this.game,
      winningBid: this.winningBid,
      state: this.state,
      starter: this.starter,
      trump: this.trump,
      cardsOnTable: this.cardsOnTable,
      talon: this.talon

    };
  }

  newGame() {
    this.game++;
    console.log("Starting game " + this.game);

    this.starter = null;
    this.trump = null;
    this.cardsOnTable = new SetOfCards(this.NumberOfPlayers);
    this.talon = new SetOfCards(this.talonSize);

    this.dealer = (this.dealer + 1) % this.NumberOfPlayers;
    this.deck.reset();

    this.talon.clear();
    this.talon.addCards(this.deck.dealCards(this.talonSize));
    this.talon.sortCards();
    this.winningBid = 0;
    this.bidWinner = null;
    this.trump = null;
    console.log("Talon cards: " + this.talon);

    // *** Deal cards and check for points for each player ****
    for (let n: number = this.dealer + 1; n < this.dealer + 1 + this.NumberOfPlayers; n++) {
      let m: number = n % this.NumberOfPlayers;
      this.player[m].newGame();
      this.player[m].addCards(this.deck.dealCards(this.CARDS_DEALT), true);
      this.player[m].myCards.sortCards();
      this.meldPoints[m] = 0;
      this.trickPoints[m] = 0;
      this.gamePoints[m] = 0;
      let myTrump: number = this.player[m].findBestTrump();
      if (myTrump !== null && (this.player[m].myBid) > this.winningBid) {
        this.trump = myTrump;
        this.winningBid = this.player[m].myBid;
        this.bidWinner = m;
      }
//      console.log("Player " + m + " cards: " + this.player[m].myCards);
      console.log("Player " + m + " bid: " + (this.player[m].myBid));
    }
    this.state = "cardsDealt";
    if (this.trump === null) { // no player can bid -> re-deal the cards
      console.log('No one can bid, re-deal');
      this.state = "cannotBid";
      return;
    }

    this.starter = this.bidWinner;
    console.log("Player " + this.starter + " wins the bid for " +
      Math.round(this.player[this.bidWinner].meldPoints) + "+" + Math.round(this.player[this.bidWinner].trickPoints) +
      "+" + Math.round(this.player[this.bidWinner].potentialPoints) + "=" + Math.round(this.winningBid));

    // ** update statistics **
    for (let i: number = 0; i < this.CARDS_DEALT; i++) {
      if (Cards.getSuit(this.player[this.starter].myCards.cards[i]) == this.trump) {
        this.winningCardCount[Cards.getRank(this.player[this.starter].myCards.cards[i])]++;
      } else {
        this.winningCardCount[Cards.getRank(this.player[this.starter].myCards.cards[i]) + 6]++;
      }
    }

    this.state = "bidWinnerSelected";
    this.pickupTalon();
//    console.log("Player " + this.starter + " cards: " + this.player[this.starter].myCards);
    this.showMelds();
    this.round = 0;
    /*

        this.cpuDiscardCards();
        this.playRounds();

        return JSON.stringify(this);
        */
  }

  pickupTalon() {
    // ** talon winner picks up talon cards **
    console.log('Player ' + this.starter + ' picks up talon');
    this.player[this.starter].addCards(this.talon.cards, false);
    this.trump = this.player[this.starter].findBestTrump(false, false);
    this.player[this.starter].checkForMeldPoints(this.trump);

  }

  userDiscardCards() {

  }

  cpuDiscardCards() {
    // ** this.talon winner discards cards **
    let discarded: SetOfCards = this.player[this.starter].discardCards(this.talonSize, this.trump);
    console.log('Discarded: ' + discarded);
    this.trickPoints[this.starter] = discarded.calculatePoints(this.round);
    console.log('Starter (' + this.starter + ') cards: ' + this.player[this.starter].myCards);
    this.player[this.starter].stack = 4;
    this.state = "readyToPlay";

  }

  showMelds() {
    // *** each player updates their card status info ***
    for (let n: number = this.dealer + 1; n < this.dealer + 1 + this.NumberOfPlayers; n++) {
      let m: number = n % this.NumberOfPlayers;
      if (m == this.starter) {
        console.log("Player " + m + ": " + Math.round(this.player[m].meldPoints) +
          " with " + this.player[m].pointCards[this.trump] + ". Trump: " + Cards.suits[this.trump] + ' Bid: ' + this.player[m].myBid);
      } else {
        let meldPoints: number = this.player[m].meldPoints;
        let trickPoints: number = this.player[m].trickPoints;
        this.player[m].checkForMeldPoints(this.trump, false);

        console.log("Player " + m + ": " + this.player[m].meldPoints +

          " with " + this.player[m].pointCards[this.trump] + ". " +
          "Bid: " + meldPoints + "+" + Math.round(this.player[m].potentialPoints) + "+" + Math.round(trickPoints) + "=" +
          Math.round(meldPoints + trickPoints + this.player[m].potentialPoints) + ' bid: ' + this.player[m].myBid);

      }
      for (let i: number = 0; i < this.NumberOfPlayers; i++)
        this.player[i].updateCardsStatus(this.player[m].meldCards, 2 << m, m == this.starter);
      this.meldPoints[m] = this.player[m].meldPoints;
    }
    this.state = "meldsShown";

  }

  playRound() {
    console.log('Round ' + this.round);
    this.cardsOnTable.clear();

    for (let i: number = 0; i < this.NumberOfPlayers; i++) {
      this.player[i].myCards.sortCards();
//          console.log("Player " + i + " cards: " + this.player[i].myCards);
    }
    let highestCard: number = null;
    let playersRemaining: number = Math.pow(2, this.NumberOfPlayers + 1) - 2; // 2 + 4 + 8 + 16;
    let winningPlayer: number = this.starter;

    // *** each this.player plays a card ***
    for (let n: number = this.starter; n < this.starter + this.NumberOfPlayers; n++) {
      let current = n % this.NumberOfPlayers;
      playersRemaining &= ~(2 << current);
      let cardPlayed: number = this.player[current].playCard(this.cardsOnTable, this.trump, highestCard, playersRemaining);
      this.player[current].myCards.sortCards();
      this.cardsOnTable.addCard(cardPlayed);

      console.log('After player ' + current + ", cards on table: " + this.cardsOnTable);

      // ** notify other players that card has been played **
      for (let i: number = 0; i < this.NumberOfPlayers; i++)
        this.player[i].cardStatusNotification(cardPlayed, 2 << current,
          highestCard, Cards.getSuit(this.cardsOnTable.cards[0]), this.trump);

      if (this.cardsOnTable.isHigherCard(cardPlayed, highestCard, this.trump)) {
        highestCard = cardPlayed;
        winningPlayer = current;
      }

    }
//        console.log(round+" Cards on table: " + this.cardsOnTable);

    // ** calculate points for winner ***
    let pts: number = this.cardsOnTable.calculatePoints(this.round);
    this.player[winningPlayer].stack += this.NumberOfPlayers;

    // last trick gives 10 points
    this.trickPoints[winningPlayer] += pts + (this.round == this.CARDS_DEALT ? 10 : 0);

    console.log("Player " + winningPlayer + " wins round " +
      this.round + " for " + pts + " points, with " + Cards.cardString(highestCard));
    this.starter = winningPlayer;

    // ** calculate stats for this.bidWinner **
    if (winningPlayer == this.bidWinner) {
      if (Cards.getSuit(highestCard) == this.trump) {
        this.winningCards[Cards.getRank(highestCard)] += pts;
      } else {
        this.winningCards[Cards.getRank(highestCard) + 6] += pts;
      }
    }

    if (this.round == this.CARDS_DEALT) {
      this.state = 'gameOver';
      console.log('game over');
      this.gameOver();
    }
  }

  playNextRound() {
    this.round++;
    if (this.round <= this.CARDS_DEALT) {
      this.playRound();
      return true;
    } else {
      return false;
    }
  }

  gameOver() {
    for (let n: number = 0; n < this.NumberOfPlayers; n++) {
      console.log("Player " + n + " totalPlayerPoints: " + this.meldPoints[n]);
      if (n == this.bidWinner) {
        this.playerBids[n]++;
        if (this.meldPoints[n] + this.trickPoints[n] >= this.winningBid) {
          this.keptBids++;
          this.playerKeptBids[n]++;
          this.gamePoints[n] = this.meldPoints[n] + this.trickPoints[n];
        } else {
          this.gamePoints[n] = -this.winningBid;
        }
      } else {
        this.gamePoints[n] = this.meldPoints[n] + this.trickPoints[n];
      }
      //if (this.meldPoints[n] > this.player[n].meldPoints) {
      this.totalPlayerPoints[n] += this.gamePoints[n];
      //}
    }
  }

  playRounds() {
    this.cpuDiscardCards();

    // ** play rounds **
    console.log('Starting game ');
    for (let round: number = 1; round <= this.CARDS_DEALT; round++) {
      this.round = round;
      this.playRound();
    }

  }

  getStats() {
    for (let n: number = 0; n < this.NumberOfPlayers; n++) {
      console.log("Player " + n + " totalPlayerPoints: " + this.totalPlayerPoints[n]);
      console.log("Bids: " + this.playerKeptBids[n] + '/' + this.playerBids[n]);
    }
    console.log(JSON.stringify(this.winningCards));
    console.log(JSON.stringify(this.winningCardCount));
    for (let n: number = 0; n < 12; n++) {
      if (this.winningCardCount[n] > 0) {
        console.log(" " + Cards.getRankStr((n * 2) % 12) +
          " avg. totalPlayerPoints: " + this.winningCards[n] / this.winningCardCount[n]);
      }
    }
    console.log("Kept playerBids: " + this.keptBids);

  }

}
