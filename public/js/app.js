var piinakka;
(function (piinakka) {
    var app = angular.module('piinakka', [
        'ui.router',
        'ngSanitize',
        'ngPlayingCards',
        'ngAnimate'
    ]);
    /*  app.config(($urlRouterProvider) => {
        $urlRouterProvider.otherwise('/');
      });
    */
    app.config(function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    });
    app.config(function ($stateProvider, $httpProvider) {
        $stateProvider
            .state('main', {
            url: '/',
            templateUrl: 'main.html',
            controller: 'MainController as vm',
            title: 'Piinakka'
        });
    });
    var MainController = /** @class */ (function () {
        function MainController($http, $timeout) {
            var _this = this;
            this.$http = $http;
            this.$timeout = $timeout;
            this.suits = ["spade", "heart", "club", "diamond"];
            this.ranks = ["ace", "ace", "ten", "ten", "king", "king", "queen", "queen", "jack", "jack", "nine", "nine"];
            this.$http.get('/api/get-state').then(function (result) {
                _this.game = _this.processResult(result.data);
                switch (_this.game.state) {
                    case "notStarted":
                        _this.onStateChange("START");
                        break;
                    case "meldsShown":
                        _this.newState = _this.game;
                        _this.onStateChange("SHOW BIDS");
                        break;
                    case "cannotBid":
                        _this.onStateChange("CANNOT BID");
                        break;
                    case "readyToPlay":
                        _this.newState = _this.game;
                        _this.onStateChange("READY");
                        break;
                    case "gameOver":
                        _this.onStateChange("GAME OVER");
                        break;
                }
            });
        }
        MainController.prototype.onStateChange = function (newState) {
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
                    this.game = this.newState;
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
        };
        MainController.prototype.processResult = function (data) {
            var _this = this;
            if (data.cardsOnTable) {
                data.cardsOnTable.cards.forEach(function (card, i) {
                    data.cardsOnTable.cards[i] = {
                        rank: _this.ranks[card % 12],
                        suit: _this.suits[Math.floor(card / 12)]
                    };
                });
            }
            this.playerCount = data.players.length;
            data.players.forEach(function (player, p) {
                if (player.cards.cards) {
                    player.cards.cards = player.cards.cards.slice(0, player.cards.cardCount);
                    player.cards.cards.forEach(function (card, i) {
                        player.cards.cards[i] = {
                            rank: _this.ranks[card % 12],
                            suit: _this.suits[Math.floor(card / 12)],
                            meld: player.meldCards && player.meldCards.cards.indexOf(card) != -1,
                            id: card
                        };
                    });
                    player.cards.cards.sort(function (a, b) { return (b.meld - a.meld) || (a.id - b.id); });
                }
            });
            data.talon && data.talon.cards.forEach(function (card, i) {
                data.talon.cards[i] = {
                    rank: _this.ranks[card % 12],
                    suit: _this.suits[Math.floor(card / 12)],
                    meld: false
                };
            });
            return data;
        };
        MainController.prototype.deal = function () {
            var _this = this;
            this.cardsOnTable = [];
            this.$http.get('/api/start').then(function (result) {
                _this.newState = _this.processResult(result.data);
                _this.onStateChange('SHOW BIDS');
            });
        };
        MainController.prototype.playRound = function () {
            var _this = this;
            this.$http.get('/api/play-round').then(function (result) {
                _this.starter = _this.game.starter;
                _this.newState = _this.processResult(result.data);
                _this.onStateChange("ANIMATE ROUND");
            });
        };
        MainController.prototype.discard = function () {
            var _this = this;
            this.$http.get('/api/discard').then(function (result) {
                _this.newState = _this.processResult(result.data);
                _this.starter = _this.game.starter;
                _this.onStateChange('READY');
            });
        };
        MainController.prototype.animateCards = function (n) {
            var _this = this;
            if (!n) {
                this.cardsOnTable = [];
                this.newState.cardsOnTable.cards.forEach(function (card) { return card.stack = 'playerStack' + _this.game.starter; });
                this.game.cardsOnTable = this.newState.cardsOnTable;
            }
            if (n < this.playerCount) {
                this.$timeout(function () {
                    _this.game.cardsOnTable.cards[n].player = 'playerCard' + (_this.starter + n) % _this.playerCount;
                    _this.game.players[(_this.starter + n) % _this.playerCount].cards = _this.newState.players[(_this.starter + n) % _this.playerCount].cards;
                    _this.cardsOnTable.push(_this.game.cardsOnTable.cards[n]);
                    _this.animateCards(n + 1);
                }, 1000);
            }
            else {
                this.$timeout(function () {
                    _this.cardsOnTable = [];
                    _this.onStateChange('READY');
                }, 3000);
            }
        };
        return MainController;
    }());
    app.controller('MainController', MainController);
})(piinakka || (piinakka = {}));
//# sourceMappingURL=app.js.map