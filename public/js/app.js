var piinakka;
(function (piinakka) {
    const app = angular.module('piinakka', [
        'ui.router',
        'ngSanitize',
        'ngPlayingCards',
        'ngAnimate'
    ]);
    /*  app.config(($urlRouterProvider) => {
        $urlRouterProvider.otherwise('/');
      });
    */
    app.config(($urlRouterProvider) => {
        $urlRouterProvider.otherwise('/');
    });
    app.config(($stateProvider, $httpProvider) => {
        $stateProvider
            .state('main', {
            url: '/',
            templateUrl: 'main.html',
            controller: 'MainController as vm',
            title: 'Piinakka'
        });
    });
    class MainController {
        constructor($http, $timeout) {
            this.$http = $http;
            this.$timeout = $timeout;
            this.suits = ["spade", "heart", "club", "diamond"];
            this.ranks = ["ace", "ace", "ten", "ten", "king", "king", "queen", "queen", "jack", "jack", "nine", "nine"];
            this.$http.get('/api/get-state').then((result) => {
                this.newState = this.processResult(result.data);
                switch (this.newState.state) {
                    case "notStarted":
                        this.onStateChange("START");
                        break;
                    case "meldsShown":
                        this.onStateChange("SHOW BIDS");
                        break;
                    case "cannotBid":
                        this.onStateChange("CANNOT BID");
                        break;
                    case "readyToPlay":
                        this.game = this.newState;
                        this.onStateChange("READY");
                        break;
                    case "gameOver":
                        this.onStateChange("GAME OVER");
                        break;
                }
            });
        }
        onStateChange(newState) {
            this.state = newState;
            switch (newState) {
                case "START":
                    break;
                case "DEAL":
                    this.deal();
                    break;
                case "CANNOT BID":
                    break;
                case "SHOW BIDS":
                    this.showBids();
                    break;
                case "SHOW TALON":
                    this.showTalon();
                    break;
                case "SHOW MELDS":
                    this.showMelds();
                    break;
                case "DISCARD":
                    this.discard();
                    break;
                case "READY":
                    this.game = this.newState;
                    break;
                case "PLAY ROUND":
                    this.playRound();
                    break;
                case "ANIMATE ROUND":
                    this.animateCards(0);
                    break;
                case "GAME OVER":
                    break;
                default:
            }
        }
        processResult(data) {
            if (data.cardsOnTable) {
                data.cardsOnTable.cards.forEach((card, i) => {
                    data.cardsOnTable.cards[i] = {
                        rank: this.ranks[card % 12],
                        suit: this.suits[Math.floor(card / 12)],
                    };
                });
            }
            this.playerCount = data.players.length;
            data.players.forEach((player, p) => {
                if (player.cards.cards) {
                    player.cards.cards = player.cards.cards.slice(0, player.cards.cardCount);
                    player.cards.cards.forEach((card, i) => {
                        player.cards.cards[i] = {
                            rank: this.ranks[card % 12],
                            suit: this.suits[Math.floor(card / 12)],
                            meld: player.meldCards && player.meldCards.cards.indexOf(card) != -1,
                            id: card
                        };
                    });
                    player.cards.cards.sort((a, b) => (b.meld - a.meld) || (a.id - b.id));
                }
            });
            data.talon && data.talon.cards.forEach((card, i) => {
                data.talon.cards[i] = {
                    rank: this.ranks[card % 12],
                    suit: this.suits[Math.floor(card / 12)],
                    meld: false
                };
            });
            return data;
        }
        deal() {
            this.cardsOnTable = [];
            this.$http.get('/api/start').then((result) => {
                this.newState = this.processResult(result.data);
                this.onStateChange('SHOW BIDS');
            });
        }
        playRound() {
            this.$http.get('/api/play-round').then((result) => {
                this.starter = this.game.starter;
                this.newState = this.processResult(result.data);
                this.onStateChange("ANIMATE ROUND");
            });
        }
        discard() {
            this.$http.get('/api/discard').then((result) => {
                this.newState = this.processResult(result.data);
                this.starter = this.game.starter;
                this.onStateChange('READY');
            });
        }
        animateCards(n) {
            if (!n) {
                this.cardsOnTable = [];
                this.newState.cardsOnTable.cards.forEach((card) => card.stack = 'playerStack' + this.game.starter);
                this.game.cardsOnTable = this.newState.cardsOnTable;
            }
            if (n < this.playerCount) {
                this.$timeout(() => {
                    this.game.cardsOnTable.cards[n].player = 'playerCard' + (this.starter + n) % this.playerCount;
                    this.game.players[(this.starter + n) % this.playerCount].cards = this.newState.players[(this.starter + n) % this.playerCount].cards;
                    this.cardsOnTable.push(this.game.cardsOnTable.cards[n]);
                    this.animateCards(n + 1);
                }, 1000);
            }
            else {
                this.$timeout(() => {
                    this.cardsOnTable = [];
                    this.onStateChange('READY');
                    if (!this.newState.players[0].cards.cards.length) {
                        this.$timeout(() => this.onStateChange('GAME OVER'), 1000);
                    }
                }, 2000);
            }
        }
        showTalon() {
            this.game.talon = this.newState.talon;
        }
        showMelds() {
            this.game = this.newState;
        }
        showBids() {
            this.game = {
                players: Array(this.playerCount).fill({}),
                scores: this.newState.scores
            };
            this.game.players.forEach((player, idx) => {
                player.cards = {
                    cards: Array(15).fill({ rank: 'back', suit: 0, key: Math.random() * 10000 })
                };
                player.key = idx;
            });
        }
    }
    app.controller('MainController', MainController);
})(piinakka || (piinakka = {}));
//# sourceMappingURL=app.js.map