'use strict';
exports.__esModule = true;
var Cards_1 = require("./Cards");
var SetOfCards_1 = require("./SetOfCards");
var Util_1 = require("./Util");
var Player = /** @class */ (function () {
    /*
     status of cards:
     0 - card already played
     1 - may be tossed
     2 - player1
     4 - player2 may have it
     8 - player3 may have it
     16 - player4 may have it
     etc.
  
     */
    function Player(playerId, numberOfPlayers, maxCards) {
        this.oddsLimit = 50;
        this.playerStrategy = 0;
        this.DEBUG = false;
        this.DEBUG2 = false;
        this.LOGIC_DEBUG = false;
        this.pointCards = [];
        this.posCards = [];
        /*
        // 4 player game
        trickValues: number[] = [20, 4, 2, 1, 0, 0];
        trumpTrickValues: number[] = [24, 34, 18, 13, 9, 8];
        */
        // 3 player game
        this.trickValues = [15, 6, 1, 0, 0, 0];
        this.trumpTrickValues = [26, 25, 13, 15, 9, 14];
        this.potentialPts = [[0.108, 0.009], [0.207, 0.034]];
        this.meldPoints = 0;
        this.potentialPoints = 0;
        this.trickPoints = 0;
        this.tmpTrump = null;
        this.myBid = 0;
        this.stack = 0;
        this.spaderdubbel = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.spaderdh = [
            [
                0, 1
            ],
            [
                2, 3
            ],
            [
                4
            ],
            [
                5
            ],
            [
                6
            ],
            [
                7
            ],
            [
                8, 9
            ]
        ];
        this.spaderpiinakka = [
            [
                0, 1
            ],
            [
                2, 3
            ],
            [
                4, 5
            ],
            [
                6, 7
            ],
            [
                8, 9
            ]
        ];
        this.hjarterdubbel = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
        this.hjarterdh = [
            [
                12, 13
            ],
            [
                14, 15
            ],
            [
                16
            ],
            [
                17
            ],
            [
                18
            ],
            [
                19
            ],
            [
                20, 21
            ]
        ];
        this.hjarterpiinakka = [
            [
                12, 13
            ],
            [
                14, 15
            ],
            [
                16, 17
            ],
            [
                18, 19
            ],
            [
                20, 21
            ]
        ];
        this.kloverdubbel = [24, 25, 26, 27, 28, 29, 30, 31, 32, 33];
        this.kloverdh = [
            [
                24, 25
            ],
            [
                26, 27
            ],
            [
                28
            ],
            [
                29
            ],
            [
                30
            ],
            [
                31
            ],
            [
                32, 33
            ]
        ];
        this.kloverpiinakka = [
            [
                24, 25
            ],
            [
                26, 27
            ],
            [
                28, 29
            ],
            [
                30, 31
            ],
            [
                32, 33
            ]
        ];
        this.ruterdubbel = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
        this.ruterdh = [
            [
                36, 37
            ],
            [
                38, 39
            ],
            [
                40
            ],
            [
                41
            ],
            [
                42
            ],
            [
                43
            ],
            [
                44, 45
            ]
        ];
        this.ruterpiinakka = [
            [
                36, 37
            ],
            [
                38, 39
            ],
            [
                40, 41
            ],
            [
                42, 43
            ],
            [
                44, 45
            ]
        ];
        this.spader2x = [4, 5, 6, 7];
        this.spader = [
            [
                4, 5
            ],
            [
                6, 7
            ]
        ];
        this.hjarter2x = [16, 17, 18, 19];
        this.hjarter = [
            [
                16, 17
            ],
            [
                18, 19
            ]
        ];
        this.klover2x = [28, 29, 30, 31];
        this.klover = [
            [
                28, 29
            ],
            [
                30, 31
            ]
        ];
        this.ruter2x = [40, 41, 42, 43];
        this.ruter = [
            [
                40, 41
            ],
            [
                42, 43
            ]
        ];
        this.a8 = [0, 1, 12, 13, 24, 25, 36, 37];
        this.a4 = [
            [
                0, 1
            ],
            [
                12, 13
            ],
            [
                24, 25
            ],
            [
                36, 37
            ]
        ];
        this.k8 = [4, 5, 16, 17, 28, 29, 40, 41];
        this.k4 = [
            [
                4, 5
            ],
            [
                16, 17
            ],
            [
                28, 29
            ],
            [
                40, 41
            ]
        ];
        this.q8 = [6, 7, 18, 19, 30, 31, 42, 43];
        this.q4 = [
            [
                6, 7
            ],
            [
                18, 19
            ],
            [
                30, 31
            ],
            [
                42, 43
            ]
        ];
        this.j8 = [8, 9, 20, 21, 32, 33, 44, 45];
        this.j4 = [
            [
                8, 9
            ],
            [
                20, 21
            ],
            [
                32, 33
            ],
            [
                44, 45
            ]
        ];
        this.dkdk = [6, 7, 44, 45];
        this.dk = [
            [
                6, 7
            ],
            [
                44, 45
            ]
        ];
        this.NumberOfPlayers = numberOfPlayers;
        this.allPlayersBITMASK = Math.pow(2, numberOfPlayers + 1) - 2;
        this.otherPlayersBITMASK = this.allPlayersBITMASK & (~playerId);
        //console.log('bitmasks: ' + this.allPlayersBITMASK + " " + this.otherPlayersBITMASK);
        this.myCards = new SetOfCards_1["default"](maxCards);
        this.cardStatus = new Array(Cards_1["default"].CARDSINDECK);
        this.newGame();
        this.myPlayerID = playerId;
        this.meldCards = new SetOfCards_1["default"](maxCards);
    }
    Player.prototype.addMeldPoints = function (pts, message, statID) {
        this.meldPoints += pts;
        if (this.pointCards[this.tmpTrump] != "") {
            this.pointCards[this.tmpTrump] += ", ";
        }
        this.pointCards[this.tmpTrump] = this.pointCards[this.tmpTrump].concat(message);
        //console.log(message);
        /*    if ((!hela || statID!=5) && (!dubbelhela || statID!=3))
         stats[statID]++;
         */
    };
    Player.prototype.addPotentialMeldPoints = function (pts, Stringmessage, tmpCardsMissing, possibilities) {
        if (tmpCardsMissing > 2) {
            return;
        }
        this.potentialPoints += pts * this.potentialPts[possibilities - 1][tmpCardsMissing - 1];
        /*    if (posCards[tmpTrump]!="") posCards[tmpTrump]+=", ";
         posCards[tmpTrump]+=message+ " ("+tmpCardsMissing+"/"+tmpCardsMissing*possibilities+"): " + (pts * potentialPts[possibilities-1][tmpCardsMissing-1] / 1000);
         */
        //    console.log(message + " ("+tmpCardsMissing+"): " + (pts * potentialPts[possibilities-1][tmpCardsMissing-1] / 1000));
        /*    if ((!hela || statID!=5) && (!dubbelhela || statID!=3))
         stats[statID]++;
         */
    };
    /**
     * This function decides which suit is the best trump for this player.
     * The player's bid is stored in CardPlayer.points.
     * @return trump integer The best suit.
     */
    Player.prototype.findBestTrump = function (storePoints, potential) {
        if (storePoints === void 0) { storePoints = true; }
        if (potential === void 0) { potential = true; }
        var canBeTrump = false;
        var maxBid = 0;
        var maxTrick = 0;
        var maxPot = 0;
        var bestTrump = null;
        // ** calculate which suit as trump gives the most points
        for (var suit = 0; suit < 4; suit++) {
            canBeTrump = this.checkForMeldPoints(suit);
            this.trickPoints = this.calculatePotentialTrickPoints(suit);
            //      console.log('Suit ' + suit + ': (' + canBeTrump + ')' + this.meldPoints + ' +' + this.trickPoints + ' +' +
            //        (potential ? this.potentialPoints : 0) + '=' + (this.meldPoints + this.trickPoints + (potential ? this.potentialPoints : 0)) + ' points');
            if (canBeTrump && (this.meldPoints + this.trickPoints + (potential ? this.potentialPoints : 0) > maxBid)) {
                bestTrump = suit;
                maxBid = this.meldPoints + this.trickPoints + (potential ? this.potentialPoints : 0);
                maxTrick = this.trickPoints;
                maxPot = (potential ? this.potentialPoints : 0);
            }
        }
        this.meldPoints = maxBid - maxTrick - maxPot;
        this.potentialPoints = maxPot;
        if (storePoints) {
            if (bestTrump !== null) {
                this.myBid = Math.floor((this.meldPoints + this.trickPoints + this.potentialPoints) / 5) * 5;
            }
            else {
                this.myBid = 0;
            }
            //      console.log('Setting player bid to ' + this.myBid);
        }
        return bestTrump;
    };
    Player.prototype.calculatePotentialTrickPoints = function (trump) {
        var trickPoints = 0;
        for (var i = 0; i < this.myCards.cardCount; i++) {
            if (Cards_1["default"].getSuit(this.myCards.cards[i]) == trump) {
                trickPoints += this.trumpTrickValues[Cards_1["default"].getRank(this.myCards.cards[i])];
            }
            else {
                trickPoints += this.trickValues[Cards_1["default"].getRank(this.myCards.cards[i])];
            }
        }
        return trickPoints * 0.7;
    };
    /**
     * Calculate how many meld points the player has
     * @param trump
     * @param updatePotential Also update potential points
     * @return {boolean}
     */
    Player.prototype.checkForMeldPoints = function (trump, updatePotential) {
        if (updatePotential === void 0) { updatePotential = true; }
        this.meldCards.clear();
        this.tmpTrump = trump;
        this.pointCards[this.tmpTrump] = "";
        this.meldPoints = 0;
        updatePotential ? this.potentialPoints = 0 : null;
        var canBeTrump = false;
        var dubbelHela = false;
        var spaderDubbelHela = false;
        var ruterDubbelHela = false;
        var hjärterDubbelHela = false;
        var klöverDubbelHela = false;
        var piinakka = null;
        var tmpCardsMissing = 0;
        var SPADER = 0;
        var HJÄRTER = 1;
        var KLÖVER = 2;
        var RUTER = 3;
        if (trump == SPADER) {
            tmpCardsMissing = this.myCards.containsCards(this.spaderdubbel, this.meldCards);
            if (tmpCardsMissing == 0) {
                this.addMeldPoints(1000, "dubbel spaderpiinakka!", 1);
                piinakka = SPADER;
                canBeTrump = true;
            }
            else {
                this.addPotentialMeldPoints(1000, "dubbel spaderpiinakka!", tmpCardsMissing, 1);
                tmpCardsMissing = this.myCards.containsOneOfEach(this.spaderdh, this.meldCards); // spaderpiinakka med dubbel hela
                if (tmpCardsMissing == 0) {
                    this.addMeldPoints(250, "spaderpiinakka med dubbel hela", 2);
                    canBeTrump = true;
                    piinakka = SPADER;
                }
                else {
                    this.addPotentialMeldPoints(250, "spaderpiinakka med dubbel hela!", tmpCardsMissing, 1);
                    tmpCardsMissing = this.myCards.containsOneOfEach(this.spaderpiinakka, this.meldCards); // spaderpiinakka
                    if (tmpCardsMissing == 0) {
                        this.addMeldPoints(150, "spaderpiinakka", 16);
                        canBeTrump = true;
                        piinakka = SPADER;
                    }
                    else {
                        this.addPotentialMeldPoints(150, "spaderpiinakka", tmpCardsMissing, 2);
                    }
                }
            }
        }
        else if (trump == HJÄRTER) {
            tmpCardsMissing = this.myCards.containsCards(this.hjarterdubbel, this.meldCards);
            if (tmpCardsMissing == 0) {
                this.addMeldPoints(1000, "dubbel hjärterpiinakka!", 1);
                piinakka = HJÄRTER;
                canBeTrump = true;
            }
            else {
                updatePotential ? this.addPotentialMeldPoints(1000, "dubbel hj�rterpiinakka!", tmpCardsMissing, 1) : null;
                tmpCardsMissing = this.myCards.containsOneOfEach(this.hjarterdh, this.meldCards); // spaderpiinakka med dubbel hela
                if (tmpCardsMissing == 0) {
                    this.addMeldPoints(250, "hjärterpiinakka med dubbel hela", 2);
                    canBeTrump = true;
                    piinakka = HJÄRTER;
                }
                else {
                    updatePotential ? this.addPotentialMeldPoints(250, "hj�rterpiinakka med dubbel hela", tmpCardsMissing, 1) : null;
                    tmpCardsMissing = this.myCards.containsOneOfEach(this.hjarterpiinakka, this.meldCards); // spaderpiinakka
                    if (tmpCardsMissing == 0) {
                        this.addMeldPoints(150, "hjärterpiinakka", 16);
                        canBeTrump = true;
                        piinakka = HJÄRTER;
                    }
                    else {
                        updatePotential ? this.addPotentialMeldPoints(150, "hjärterpiinakka", tmpCardsMissing, 2) : null;
                    }
                }
            }
        }
        else if (trump == KLÖVER) {
            tmpCardsMissing = this.myCards.containsCards(this.kloverdubbel, this.meldCards);
            if (tmpCardsMissing == 0) {
                this.addMeldPoints(1000, "dubbel klöverpiinakka!", 1);
                piinakka = KLÖVER;
                canBeTrump = true;
            }
            else {
                updatePotential ? this.addPotentialMeldPoints(1000, "dubbel klöverpiinakka", tmpCardsMissing, 1) : null;
                tmpCardsMissing = this.myCards.containsOneOfEach(this.kloverdh, this.meldCards); // spaderpiinakka med dubbel hela
                if (tmpCardsMissing == 0) {
                    this.addMeldPoints(250, "klöverpiinakka med dubbel hela", 2);
                    canBeTrump = true;
                    piinakka = KLÖVER;
                }
                else {
                    updatePotential ? this.addPotentialMeldPoints(250, "klöverpiinakka med dubbel hela", tmpCardsMissing, 1) : null;
                    tmpCardsMissing = this.myCards.containsOneOfEach(this.kloverpiinakka, this.meldCards); // spaderpiinakka
                    if (tmpCardsMissing == 0) {
                        this.addMeldPoints(150, "klöverpiinakka", 16);
                        canBeTrump = true;
                        piinakka = KLÖVER;
                    }
                    else {
                        updatePotential ? this.addPotentialMeldPoints(150, "klöverpiinakka ", tmpCardsMissing, 2) : null;
                    }
                }
            }
        }
        else if (trump == RUTER) {
            tmpCardsMissing = this.myCards.containsCards(this.ruterdubbel, this.meldCards);
            if (tmpCardsMissing == 0) {
                this.addMeldPoints(1000, "dubbel ruterpiinakka!", 1);
                piinakka = RUTER;
                canBeTrump = true;
            }
            else {
                updatePotential ? this.addPotentialMeldPoints(1000, "dubbel ruterpiinakka ", tmpCardsMissing, 1) : null;
                tmpCardsMissing = this.myCards.containsOneOfEach(this.ruterdh, this.meldCards); // spaderpiinakka med dubbel hela
                if (tmpCardsMissing == 0) {
                    this.addMeldPoints(250, "ruterpiinakka med dubbel hela", 2);
                    canBeTrump = true;
                    piinakka = RUTER;
                }
                else {
                    updatePotential ? this.addPotentialMeldPoints(250, "ruterpiinakka med dubbel hela", tmpCardsMissing, 1) : null;
                    tmpCardsMissing = this.myCards.containsOneOfEach(this.ruterpiinakka, this.meldCards); // spaderpiinakka
                    if (tmpCardsMissing == 0) {
                        this.addMeldPoints(150, "ruterpiinakka", 16);
                        canBeTrump = true;
                        piinakka = RUTER;
                    }
                    else {
                        updatePotential ? this.addPotentialMeldPoints(150, "ruterpiinakka ", tmpCardsMissing, 2) : null;
                    }
                }
            }
        }
        tmpCardsMissing = this.myCards.containsCards(this.spader2x, this.meldCards);
        if (piinakka != SPADER) {
            if (trump == SPADER) {
                if (tmpCardsMissing == 0) {
                    this.addMeldPoints(100, "spader dubbel hela", 3);
                    canBeTrump = true;
                    dubbelHela = true;
                    spaderDubbelHela = true;
                }
                else {
                    updatePotential ? this.addPotentialMeldPoints(100, "spader dubbel hela ", tmpCardsMissing, 1) : null;
                }
            }
            else {
                if (tmpCardsMissing == 0) {
                    this.addMeldPoints(40, "spader dubbel hela", 3);
                    spaderDubbelHela = true;
                }
                else {
                    updatePotential ? this.addPotentialMeldPoints(40, "spader dubbel hela ", tmpCardsMissing, 1) : null;
                }
            }
        }
        tmpCardsMissing = this.myCards.containsOneOfEach(this.spader, this.meldCards);
        if (piinakka != SPADER && !spaderDubbelHela) {
            if (trump == SPADER) {
                if (tmpCardsMissing == 0) {
                    this.addMeldPoints(40, "spaderhela", 5);
                    canBeTrump = true;
                }
                else {
                    updatePotential ? this.addPotentialMeldPoints(40, "spader hela ", tmpCardsMissing, 2) : null;
                }
            }
            else if (tmpCardsMissing == 0) {
                this.addMeldPoints(20, "spaderhela", 5);
            }
            else {
                updatePotential ? this.addPotentialMeldPoints(20, "spader hela ", tmpCardsMissing, 2) : null;
            }
        }
        dubbelHela = false;
        tmpCardsMissing = this.myCards.containsCards(this.hjarter2x, this.meldCards);
        if (piinakka != HJÄRTER) {
            if (trump == HJÄRTER) {
                if (tmpCardsMissing == 0) {
                    this.addMeldPoints(100, "hjärter dubbelhela", 3);
                    canBeTrump = true;
                    dubbelHela = true;
                    hjärterDubbelHela = true;
                }
                else {
                    updatePotential ? this.addPotentialMeldPoints(100, "hjärter dubbel hela ", tmpCardsMissing, 1) : null;
                }
            }
            else {
                if (tmpCardsMissing == 0) {
                    this.addMeldPoints(40, "hjärter dubbelhela", 3);
                    hjärterDubbelHela = true;
                }
                else {
                    updatePotential ? this.addPotentialMeldPoints(40, "hjärter dubbel hela ", tmpCardsMissing, 1) : null;
                }
            }
        }
        tmpCardsMissing = this.myCards.containsOneOfEach(this.hjarter, this.meldCards);
        if (piinakka != HJÄRTER && !hjärterDubbelHela) {
            if (trump == HJÄRTER) {
                if (tmpCardsMissing == 0) {
                    this.addMeldPoints(40, "hjärterhela", 5);
                    canBeTrump = true;
                }
                else {
                    updatePotential ? this.addPotentialMeldPoints(40, "hjärter hela ", tmpCardsMissing, 2) : null;
                }
            }
            else if (tmpCardsMissing == 0) {
                this.addMeldPoints(20, "hjärterhela", 5);
            }
            else {
                updatePotential ? this.addPotentialMeldPoints(20, "hjärter hela ", tmpCardsMissing, 2) : null;
            }
        }
        dubbelHela = false;
        tmpCardsMissing = this.myCards.containsCards(this.klover2x, this.meldCards);
        if (piinakka != KLÖVER) {
            if (trump == KLÖVER) {
                if (tmpCardsMissing == 0) {
                    this.addMeldPoints(100, "klöver dubbelhela", 3);
                    canBeTrump = true;
                    dubbelHela = true;
                    klöverDubbelHela = true;
                }
                else {
                    updatePotential ? this.addPotentialMeldPoints(100, "klöver dubbelhela ", tmpCardsMissing, 1) : null;
                }
            }
            else {
                if (tmpCardsMissing == 0) {
                    this.addMeldPoints(40, "klöver dubbelhela", 3);
                    klöverDubbelHela = true;
                }
                else {
                    updatePotential ? this.addPotentialMeldPoints(40, "klöver dubbelhela ", tmpCardsMissing, 1) : null;
                }
            }
        }
        tmpCardsMissing = this.myCards.containsOneOfEach(this.klover, this.meldCards);
        if (piinakka != KLÖVER && !klöverDubbelHela) {
            if (trump == KLÖVER) {
                if (tmpCardsMissing == 0) {
                    this.addMeldPoints(40, "klöverhela", 5);
                    canBeTrump = true;
                }
                else {
                    updatePotential ? this.addPotentialMeldPoints(40, "klöver hela ", tmpCardsMissing, 2) : null;
                }
            }
            else if (tmpCardsMissing == 0) {
                this.addMeldPoints(20, "klöverhela", 5);
            }
            else {
                updatePotential ? this.addPotentialMeldPoints(20, "klöver hela ", tmpCardsMissing, 2) : null;
            }
        }
        //dubbelHela = false;
        tmpCardsMissing = this.myCards.containsCards(this.ruter2x, this.meldCards);
        if (piinakka != RUTER) {
            if (trump == RUTER) {
                if (tmpCardsMissing == 0) {
                    this.addMeldPoints(100, "ruter dubbelhela", 3);
                    canBeTrump = true;
                    dubbelHela = true;
                    ruterDubbelHela = true;
                }
                else {
                    updatePotential ? this.addPotentialMeldPoints(100, "ruter dubbelhela ", tmpCardsMissing, 1) : null;
                }
            }
            else {
                if (tmpCardsMissing == 0) {
                    this.addMeldPoints(40, "ruter dubbelhela", 3);
                    ruterDubbelHela = true;
                }
                else {
                    updatePotential ? this.addPotentialMeldPoints(40, "ruter dubbelhela ", tmpCardsMissing, 1) : null;
                }
            }
        }
        tmpCardsMissing = this.myCards.containsOneOfEach(this.ruter, this.meldCards);
        if (piinakka != RUTER && !ruterDubbelHela) {
            if (trump == RUTER) {
                if (tmpCardsMissing == 0) {
                    this.addMeldPoints(40, "ruterhela", 5);
                    canBeTrump = true;
                }
                else {
                    updatePotential ? this.addPotentialMeldPoints(40, "ruter hela ", tmpCardsMissing, 2) : null;
                }
            }
            else if (tmpCardsMissing == 0) {
                this.addMeldPoints(20, "ruterhela", 5);
            }
            else {
                updatePotential ? this.addPotentialMeldPoints(40, "ruter hela ", tmpCardsMissing, 2) : null;
            }
        }
        if (this.myCards.containsOneOfEach([[trump * 12 + 10], [trump * 12 + 11]], this.meldCards) == 0) {
            this.addMeldPoints(20, "två trumf 9", 4);
        }
        else if (this.myCards.containsOneOfEach([[trump * 12 + 10, trump * 12 + 11]], this.meldCards) == 0) {
            this.addMeldPoints(10, "trumf 9", 4);
        }
        tmpCardsMissing = this.myCards.containsCards(this.a8, this.meldCards);
        if (tmpCardsMissing == 0) {
            this.addMeldPoints(800, "8 äss!", 6);
        }
        else {
            updatePotential ? this.addPotentialMeldPoints(800, "8äss ", tmpCardsMissing, 1) : null;
            tmpCardsMissing = this.myCards.containsOneOfEach(this.a4, this.meldCards);
            if (tmpCardsMissing == 0) {
                this.addMeldPoints(100, "4 äss", 7);
            }
            else {
                updatePotential ? this.addPotentialMeldPoints(100, "4äss ", tmpCardsMissing, 2) : null;
            }
        }
        tmpCardsMissing = this.myCards.containsCards(this.k8, this.meldCards);
        if (tmpCardsMissing == 0) {
            this.addMeldPoints(600, "8 kungar!", 8);
        }
        else {
            updatePotential ? this.addPotentialMeldPoints(600, "8 K ", tmpCardsMissing, 1) : null;
            tmpCardsMissing = this.myCards.containsOneOfEach(this.k4, this.meldCards);
            if (tmpCardsMissing == 0) {
                this.addMeldPoints(80, "4 kungar", 9);
            }
            else if (tmpCardsMissing <= 2) {
                updatePotential ? this.addPotentialMeldPoints(80, "4 K ", tmpCardsMissing, 2) : null;
            }
        }
        tmpCardsMissing = this.myCards.containsCards(this.q8, this.meldCards);
        if (tmpCardsMissing == 0) {
            this.addMeldPoints(400, "8 damer!", 10);
        }
        else {
            updatePotential ? this.addPotentialMeldPoints(400, "8 Q ", tmpCardsMissing, 1) : null;
            tmpCardsMissing = this.myCards.containsOneOfEach(this.q4, this.meldCards);
            if (tmpCardsMissing == 0) {
                this.addMeldPoints(60, "4 damer", 11);
            }
            else {
                updatePotential ? this.addPotentialMeldPoints(60, "4 Q ", tmpCardsMissing, 2) : null;
            }
        }
        tmpCardsMissing = this.myCards.containsCards(this.j8, this.meldCards);
        if (tmpCardsMissing == 0) {
            this.addMeldPoints(200, "8 knäktar!", 10);
        }
        else {
            updatePotential ? this.addPotentialMeldPoints(200, "8 J ", tmpCardsMissing, 1) : null;
            tmpCardsMissing = this.myCards.containsOneOfEach(this.j4, this.meldCards);
            if (tmpCardsMissing == 0) {
                this.addMeldPoints(40, "4 knäktar", 11);
            }
            else {
                updatePotential ? this.addPotentialMeldPoints(40, "4 J ", tmpCardsMissing, 2) : null;
            }
        }
        tmpCardsMissing = this.myCards.containsCards(this.dkdk, this.meldCards);
        if (tmpCardsMissing == 0) {
            this.addMeldPoints(200, "spader dam, ruter knäkt dubbelt!", 14);
        }
        else {
            updatePotential ? this.addPotentialMeldPoints(200, "spader dam, ruter knäkt dubbelt!", tmpCardsMissing, 1) : null;
            if (this.myCards.containsOneOfEach(this.dk, this.meldCards) == 0) {
                this.addMeldPoints(40, "spader dam, ruter knäkt", 15);
            }
        }
        return canBeTrump;
    };
    /**
     * Check if player has a higher card
     *
     * @param suit
     * @param card
     * @return {boolean}
     */
    Player.prototype.haveHigher = function (suit, card) {
        var n = 0;
        if (!this.myCards.sorted) {
            this.myCards.sortCards();
        }
        if (suit === null) {
            return true;
        } // any suit -> any card will do
        while (n < this.myCards.cardCount) {
            if ((Cards_1["default"].getRank(card) > Cards_1["default"].getRank(this.myCards.cards[n]) &&
                Cards_1["default"].getSuit(this.myCards.cards[n]) == suit)) {
                break;
            }
            n++;
        }
        if (n < this.myCards.cardCount) {
            return Cards_1["default"].getSuit(this.myCards.cards[n]) == suit;
        }
        else {
            return false;
        }
    };
    /**
     * Get set of all cards that are higher than the given card
     * @param suit
     * @param card
     * @return {SetOfCards}
     */
    Player.prototype.getHigher = function (suit, card) {
        if (suit == null) {
            return this.myCards;
        } // any suit -> any card will do
        var higherCards = new SetOfCards_1["default"](this.myCards.maxCardCount);
        var n = 0;
        if (!this.myCards.sorted) {
            this.myCards.sortCards();
        }
        while (n < this.myCards.cardCount) {
            if (Cards_1["default"].getRank(card) > Cards_1["default"].getRank(this.myCards.cards[n]) &&
                Cards_1["default"].getSuit(this.myCards.cards[n]) == suit) {
                break;
            }
            n++;
        }
        var i = 0;
        while (n < this.myCards.cardCount) {
            if (Cards_1["default"].getRank(card) > Cards_1["default"].getRank(this.myCards.cards[n]) &&
                (Cards_1["default"].getSuit(this.myCards.cards[n]) == suit)) {
                higherCards.addCard(this.myCards.cards[n]);
                i++;
            }
            n++;
        }
        return higherCards;
    };
    /**
     * Select a card to play. Player is trying to take the trick
     *
     * @param cardsOnTable
     * @param trump
     * @param highestCard
     * @param remainingPlayers which players will play after me
     * @return {any}
     */
    Player.prototype.playCard = function (cardsOnTable, trump, highestCard, remainingPlayers) {
        // TODO: don't leave trump ace alone?
        var haveHigherCard = true;
        var playableCards;
        var originalSuit = Cards_1["default"].getSuit(cardsOnTable.cards[0]);
        if (cardsOnTable.cardCount == 0) {
            if (this.LOGIC_DEBUG) {
                console.log("play any");
            }
            playableCards = this.getHigher(null, Cards_1["default"].CARDSINDECK);
        }
        else {
            //      console.log("suit: "+originalSuit);
            if (Cards_1["default"].getSuit(highestCard) == trump && originalSuit == trump) {
                if (this.haveHigher(trump, highestCard)) {
                    if (this.LOGIC_DEBUG) {
                        console.log("trump: have higher trump");
                    }
                    playableCards = this.getHigher(trump, highestCard);
                }
                else if (this.haveHigher(trump, Cards_1["default"].CARDSINDECK)) {
                    if (this.LOGIC_DEBUG) {
                        console.log("trump: have lower trump ");
                    }
                    haveHigherCard = false;
                    playableCards = this.getHigher(trump, Cards_1["default"].CARDSINDECK);
                }
                else {
                    if (this.LOGIC_DEBUG) {
                        console.log("trump: play any");
                    }
                    haveHigherCard = false;
                    playableCards = this.getHigher(null, Cards_1["default"].CARDSINDECK);
                }
            }
            else if (Cards_1["default"].getSuit(highestCard) == trump) {
                if (this.haveHigher(originalSuit, Cards_1["default"].CARDSINDECK)) {
                    if (this.LOGIC_DEBUG) {
                        console.log("suit+trump: have suit " + trump);
                    }
                    haveHigherCard = false;
                    playableCards = this.getHigher(originalSuit, Cards_1["default"].CARDSINDECK);
                }
                else if (this.haveHigher(trump, highestCard)) {
                    if (this.LOGIC_DEBUG) {
                        console.log("suit+trump: have higher trump " + trump);
                    }
                    playableCards = this.getHigher(trump, highestCard);
                }
                else if (this.haveHigher(trump, Cards_1["default"].CARDSINDECK)) {
                    if (this.LOGIC_DEBUG) {
                        console.log("suit+trump: have lower trump " + trump);
                    }
                    haveHigherCard = false;
                    playableCards = this.getHigher(trump, Cards_1["default"].CARDSINDECK);
                }
                else {
                    if (this.LOGIC_DEBUG) {
                        console.log("suit+trump: play any " + trump);
                    }
                    haveHigherCard = false;
                    playableCards = this.getHigher(null, Cards_1["default"].CARDSINDECK);
                }
            }
            else {
                if (this.haveHigher(originalSuit, highestCard)) {
                    if (this.LOGIC_DEBUG) {
                        console.log("have higher");
                    }
                    playableCards = this.getHigher(originalSuit, highestCard);
                }
                else if (this.haveHigher(originalSuit, Cards_1["default"].CARDSINDECK)) {
                    if (this.LOGIC_DEBUG) {
                        console.log("have lower");
                    }
                    haveHigherCard = false;
                    playableCards = this.getHigher(originalSuit, Cards_1["default"].CARDSINDECK);
                }
                else if (this.haveHigher(trump, Cards_1["default"].CARDSINDECK)) {
                    if (this.LOGIC_DEBUG) {
                        console.log("have trump");
                    }
                    playableCards = this.getHigher(trump, Cards_1["default"].CARDSINDECK);
                }
                else {
                    if (this.LOGIC_DEBUG) {
                        console.log("have any");
                    }
                    haveHigherCard = false;
                    playableCards = this.getHigher(null, Cards_1["default"].CARDSINDECK);
                }
            }
        }
        var cardToPlay;
        if (haveHigherCard) {
            // try to take the trick
            if (playableCards.cardCount == 1) {
                // play the only possible card
                console.log('try to take the trick, play the only possible card');
                if (this.LOGIC_DEBUG) {
                    console.log("Playable cards 1: " + playableCards);
                }
                cardToPlay = playableCards.cards[0];
                this.myCards.removeCard(cardToPlay);
            }
            else if (playableCards.cardCount == 2 &&
                Math.floor(playableCards.cards[0] / 2) == Math.floor(playableCards.cards[1] / 2)) {
                // have two identical cards
                if (this.LOGIC_DEBUG) {
                    console.log("Playable cards 2: " + playableCards);
                }
                cardToPlay = playableCards.cards[0];
                console.log('try to take the trick, two identical cards');
                this.myCards.removeCard(cardToPlay);
            }
            else {
                // play the best card
                if (this.LOGIC_DEBUG) {
                    console.log("Playable cards: " + playableCards);
                }
                cardToPlay = this.findBestCard(playableCards, trump, remainingPlayers, originalSuit);
                this.myCards.removeCard(cardToPlay);
            }
        }
        else {
            // throw the lowest card you have
            playableCards.sortCardsByRank(trump);
            if (this.LOGIC_DEBUG) {
                console.log("Playable low cards sorted: " + playableCards);
            }
            cardToPlay = playableCards.cards[0];
            console.log('throw the lowest card you have');
            this.myCards.removeCard(cardToPlay); // play the lowest card
        }
        if (this.LOGIC_DEBUG) {
            console.log(this.myPlayerID + " Card Played: " + Cards_1["default"].cardString(cardToPlay));
        }
        return cardToPlay;
    };
    Player.prototype.newGame = function () {
        this.myCards.clear();
        this.stack = 0;
        for (var n = 0; n < this.cardStatus.length; n++) {
            this.cardStatus[n] = this.otherPlayersBITMASK; // anyone else may have card
        }
    };
    Player.prototype.addCards = function (newcards, reset) {
        if (reset) {
            this.myCards.clear();
        }
        for (var n = 0; n < newcards.length; n++) {
            this.myCards.addCard(newcards[n]);
            this.cardStatus[newcards[n]] = this.myPlayerID;
        }
    };
    /**
     * Find the best card to play, when player must go higher. Might be possible to take the trick.
     *
     * @param playableCards SetOfCards set of legal cards to play
     * @param trump
     * @param remainingPlayers
     * @param originalSuit
     * @return {number}
     */
    Player.prototype.findBestCard = function (playableCards, trump, remainingPlayers, originalSuit) {
        var cardOdds = [];
        //    let tmp;
        if (remainingPlayers == 0) {
            playableCards.sortCardsByRank(trump);
            var odds = this.getOdds(playableCards.cards[0], trump, remainingPlayers, originalSuit);
            if (odds < 0.1) {
                console.log('I\'m the last player, won\'t get trick, play lowest possible card');
                this.cardStatus[playableCards.cards[0]] = 0;
                return playableCards.cards[0];
            }
            else {
                console.log('I\'m the last player, will get trick, play low card with high points');
                var cardPoints_1 = Cards_1["default"].getPoints(playableCards.cards[0]);
                var betterCard = playableCards.cards.findIndex(function (card) {
                    return card !== null &&
                        Cards_1["default"].getPoints(card) - cardPoints_1 == 5 &&
                        Cards_1["default"].getRankStr(card) != 'A';
                });
                if (betterCard == -1) {
                    betterCard = 0;
                }
                this.cardStatus[playableCards.cards[betterCard]] = 0;
                return playableCards.cards[betterCard];
            }
        }
        else {
            playableCards.sortCardsByRank(trump);
            // play lowest card with best odds
            for (var n = 0; n < playableCards.cardCount; n++) {
                cardOdds[n] = this.getOdds(playableCards.cards[n], trump, remainingPlayers, originalSuit);
            }
            // sort cards by odds (lowest first)
            Util_1["default"].SortCardsByOdds(cardOdds, playableCards.cards);
            for (var n = 0; n < playableCards.cardCount; n++) {
                console.log(Cards_1["default"].cardString(playableCards.cards[n]) + " - " + cardOdds[n] + "%");
            }
            // if all non-trump cards are 0%, play card in smallest suit, that is not an ace
            var allZeros = true;
            for (var n = cardOdds.length - 1; n > 0; n--) {
                if (Cards_1["default"].getSuit(playableCards.cards[n]) != trump && cardOdds[n] > 0) {
                    // found >0% card that is not trump
                    allZeros = false;
                    break;
                }
            }
            if (allZeros) {
                //console.log('All non trumps are zero');
                // play card in smallest suit (not trump), that is not an ace
                var suitCounts = this.getSmallestSuits(this.myCards);
                //console.log(JSON.stringify(suitCounts));
                var suitCount = suitCounts.suitCount;
                var suits = suitCounts.suits;
                for (var i = 0; i < 4; i++) {
                    //console.log('Checking suit ' + Cards.suits[suits[i]]);
                    if (suits[i] == trump || suitCount[i] == 0) {
                        //console.log('skipping this suit');
                        continue;
                    }
                    for (var j = 0; j < playableCards.cardCount; j++) {
                        if (Cards_1["default"].getSuit(playableCards.cards[j]) == suits[i] && Cards_1["default"].getRank(playableCards.cards[j]) != 0) {
                            console.log('play card in smallest suit (not trump), that is not an ace');
                            return playableCards.cards[j];
                        }
                    }
                }
            }
            if (cardOdds[cardOdds.length - 1] >= this.oddsLimit) {
                if (this.playerStrategy == 1) {
                    //          for (let i = 0; i < cardOdds.length; i++) {
                    var firstMatch = null;
                    for (var i = cardOdds.length - 1; i > 0; i--) {
                        if (cardOdds[i] >= this.oddsLimit && Cards_1["default"].getSuit(playableCards.cards[i]) !== trump) {
                            if (firstMatch === null) {
                                firstMatch = i;
                            }
                            // if two cards in the same suit have the same odds, play the lower one
                            if (i > 0 && cardOdds[firstMatch] - cardOdds[i - 1] < 10 &&
                                Cards_1["default"].getSuit(playableCards.cards[i - 1]) !== trump &&
                                Cards_1["default"].getSuit(playableCards.cards[i - 1]) == Cards_1["default"].getSuit(playableCards.cards[i])) {
                                continue;
                            }
                            console.log('playing best non-trump card with odds over ' + this.oddsLimit + '%');
                            return playableCards.cards[i];
                        }
                    }
                    var _loop_1 = function (i) {
                        if (cardOdds[i] >= this_1.oddsLimit) {
                            var betterCard = playableCards.cards.findIndex(function (card, index) {
                                return cardOdds[index] - cardOdds[i] < 10 &&
                                    Cards_1["default"].getPoints(playableCards.cards[index]) - Cards_1["default"].getPoints(playableCards.cards[i]) == 5;
                            });
                            console.log('playing (almost) worst trump card with odds over ' + this_1.oddsLimit + '%');
                            if (betterCard == -1) {
                                betterCard = i;
                            }
                            return { value: playableCards.cards[betterCard] };
                        }
                    };
                    var this_1 = this;
                    // TODO: try to take last trick
                    for (var i = 0; i < cardOdds.length; i++) {
                        var state_1 = _loop_1(i);
                        if (typeof state_1 === "object")
                            return state_1.value;
                    }
                    console.log('playing worst card');
                    return playableCards.cards[0];
                }
                else {
                    console.log('playing last card');
                    return playableCards.cards[cardOdds.length - 1];
                }
            }
            else {
                var card = playableCards.cards.findIndex(function (card) { return card !== null && Cards_1["default"].getSuit(card) !== trump; });
                if (card !== -1) {
                    // TODO: try to take out opponent trumps?
                    console.log('playing worst non-trump card, none over ' + this.oddsLimit + '%');
                    console.log('card is ' + card + '=' + playableCards.cards[card]);
                    console.log(JSON.stringify(playableCards.cards));
                    return playableCards.cards[card];
                }
                else {
                    console.log('playing worst (trump) card, none over ' + this.oddsLimit + '%');
                    return playableCards.cards[0]; // return card with worst odds
                }
            }
        }
    };
    /**
     * Calculate the odds that this card will win the round.
     * @param thisCard
     * @param trump
     * @param remainingPlayers
     * @param originalSuit
     * @return {number}
     */
    Player.prototype.getOdds = function (thisCard, trump, remainingPlayers, originalSuit) {
        var thisCardSuit = Cards_1["default"].getSuit(thisCard);
        var highestCard;
        var lowestCard;
        var notHigher;
        var notLower = [];
        var notTrump = [];
        var totalSum;
        var possibleOwners;
        var ownersLeft;
        var thisOwner;
        if (this.DEBUG) {
            console.log("card to compare: " + Cards_1["default"].cardString(thisCard));
        }
        //    console.log("originalSuit: " +originalSuit);
        totalSum = 100;
        notHigher = 100;
        if (thisCardSuit == originalSuit || originalSuit === null) {
            // I have original suit, or can play any suit
            highestCard = thisCardSuit * Cards_1["default"].CARDSINSUIT; // highest card in suit (ace)
            lowestCard = (Math.floor(thisCard / 2)) * 2;
            if (this.DEBUG) {
                console.log("highestCard-lowestCard: " + highestCard + " - " + lowestCard);
            }
            // check all cards that are higher than mine in this suit
            for (var n = highestCard; n < lowestCard; n++) {
                if (this.DEBUG2) {
                    console.log("H comparing: " + Cards_1["default"].cardString(n) + ' status: ' + this.cardStatus[n]);
                }
                // calculate chance of remaining players NOT having card
                possibleOwners = this.bitCount(this.cardStatus[n] & (this.otherPlayersBITMASK));
                ownersLeft = this.bitCount(this.cardStatus[n] & remainingPlayers);
                if (possibleOwners != 0) {
                    //            notHigher[player] *= 1000 -
                    //                this.bitCount(this.cardStatus[n] & (2 << player)) * 1000 / possibleOwners;
                    notHigher *= 100 - ownersLeft * 100 / possibleOwners;
                    notHigher /= 100;
                }
                // console.log("possible: "+possibleOwners);
                //        console.log("sum: " + notHigher[player]);
            }
            if (this.DEBUG) {
                console.log("Chance of other players not having a higher card in suit: " + notHigher.toFixed(2) + '%');
            }
            totalSum *= notHigher;
            totalSum /= 100;
            if (thisCardSuit != trump) {
                // suit is not trump, so check all trump cards also
                for (var player = 0; player < this.NumberOfPlayers; player++) {
                    notLower[player] = 100;
                    notTrump[player] = 100;
                    thisOwner = 2 << player;
                    if ((thisOwner & remainingPlayers) == 0) {
                        continue;
                    }
                    if (this.DEBUG) {
                        console.log("Checking trump for player " + player);
                    }
                    var lstart = (Math.floor(thisCard / 2)) * 2; // check for lower cards in suit
                    var lend = thisCardSuit * Cards_1["default"].CARDSINSUIT + Cards_1["default"].CARDSINSUIT;
                    //      if (this.DEBUG) console.log("lstart-lend: " + lstart + " - " +lend);
                    for (var n = lstart; n < lend; n++) {
                        if (this.DEBUG) {
                            console.log("L comparing: " + Cards_1["default"].cardString(n));
                        }
                        // calculate chance of this player NOT having card
                        possibleOwners = this.bitCount(this.cardStatus[n] & this.otherPlayersBITMASK);
                        ownersLeft = this.bitCount(this.cardStatus[n] & thisOwner);
                        if (possibleOwners != 0) {
                            notLower[player] *= 100 - ownersLeft * 100 / possibleOwners;
                            notLower[player] /= 100;
                        }
                        //console.log("possible: "+possibleOwners);
                        //console.log("sum: " + notLower[player]);
                    }
                    var tstart = trump * Cards_1["default"].CARDSINSUIT; // lowest trump
                    var tend = trump * Cards_1["default"].CARDSINSUIT + Cards_1["default"].CARDSINSUIT; // highest trump
                    //        if (this.DEBUG) console.log("lstart-lend: " + tstart + " - " +tend);
                    for (var n = tstart; n < tend; n++) {
                        if (this.DEBUG2) {
                            console.log("T comparing: " + Cards_1["default"].cardString(n));
                        }
                        // calculate chance of player NOT having card
                        possibleOwners = this.bitCount(this.cardStatus[n] & this.otherPlayersBITMASK);
                        ownersLeft = this.bitCount(this.cardStatus[n] & thisOwner);
                        if (possibleOwners != 0) {
                            notTrump[player] *= 100 - ownersLeft * 100 / possibleOwners;
                            notTrump[player] /= 100;
                        }
                        //          console.log("possible: "+possibleOwners);
                        //        console.log("nottrump sum: " + notTrump[player]);;
                    }
                    if (this.DEBUG) {
                        console.log("Chance of player not having lower card in suit: " + notLower[player]);
                    }
                    if (this.DEBUG) {
                        console.log("Chance of player not having any trump: " + notTrump[player]);
                    }
                    totalSum *= 100 - notLower[player] * (100 - notTrump[player]) / 100;
                    totalSum /= 100;
                }
                /*        totalSum *= 1000 -
                 (1000 - (notHigher[player] * (1000 - notLower[player])) / 1000) *
                 (1000 - (notHigher[player] * notLower[player] * notTrump[player] / 1000 / 1000)) / 1000;
                 totalSum /= 1000; */
                //      console.log("total: "+totalSum);
            }
        }
        else {
            highestCard = originalSuit * Cards_1["default"].CARDSINSUIT; // highest card in original suit
            lowestCard = highestCard + Cards_1["default"].CARDSINSUIT; // lowest
            if (this.DEBUG) {
                console.log("highestCard-lowestCard: " + highestCard + " - " + lowestCard);
            }
            for (var player = 0; player < this.NumberOfPlayers; player++) {
                notLower[player] = 100;
                notTrump[player] = 100;
                thisOwner = 2 << player;
                if ((thisOwner & remainingPlayers) == 0) {
                    continue;
                }
                for (var n = highestCard; n < lowestCard; n++) {
                    if (this.DEBUG2) {
                        console.log("S comparing: " + Cards_1["default"].cardString(n));
                    }
                    // calculate chance of player NOT having card
                    possibleOwners = this.bitCount(this.cardStatus[n] & this.otherPlayersBITMASK);
                    ownersLeft = this.bitCount(this.cardStatus[n] & thisOwner);
                    if (possibleOwners != 0) {
                        notLower[player] *= 100 - ownersLeft * 100 / possibleOwners;
                        notLower[player] /= 100;
                    }
                    //        console.log("possible: "+possibleOwners);
                    //        console.log("sum: " + sum);
                }
                var tstart = thisCardSuit * Cards_1["default"].CARDSINSUIT; // highest trump
                var tend = (Math.floor(thisCard / 2)) * 2; // lowest trump higher than mine
                //      if (this.DEBUG) console.log("lstart-lend: " + tstart + " - " +tend);
                for (var n = tstart; n < tend; n++) {
                    if (this.DEBUG2) {
                        console.log("TT comparing: " + Cards_1["default"].cardString(n));
                    }
                    // calculate chance of player NOT having trump
                    possibleOwners = this.bitCount(this.cardStatus[n] & this.otherPlayersBITMASK);
                    ownersLeft = this.bitCount(this.cardStatus[n] & thisOwner);
                    if (possibleOwners != 0) {
                        notTrump[player] *= 100 - ownersLeft * 100 / possibleOwners;
                        notTrump[player] /= 100;
                    }
                    //          console.log("possible: "+possibleOwners);
                    //          console.log("sum: " + notTrump);
                }
                if (this.DEBUG) {
                    console.log("notOriginal: " + notLower[player]);
                }
                if (this.DEBUG) {
                    console.log("notTrump: " + notTrump[player]);
                }
                // !(!original & högretrumf)
                totalSum *= 100 - (notLower[player] * (100 - notTrump[player])) / 100;
                totalSum /= 100;
                //      console.log("total: "+totalSum);
            }
        }
        if (this.DEBUG) {
            console.log("odds for " + Cards_1["default"].cardString(thisCard) + ": " + totalSum / 10 + "%");
        }
        return totalSum;
    };
    Player.prototype.bitCount = function (value) {
        var res = 0;
        for (var n = 0; n < 8; n++)
            if ((value >> n & 1) == 1) {
                res++;
            }
        //console.log("value: " +value+ ", bitcount: "+res);
        return res;
    };
    Player.prototype.printstatus = function () {
        for (var i = 0; i < 12; i++) {
            console.log(this.cardStatus[i] + " ");
        }
        console.log();
        for (var i = 12; i < 24; i++) {
            console.log(this.cardStatus[i] + " ");
        }
        console.log();
        for (var i = 24; i < 36; i++) {
            console.log(this.cardStatus[i] + " ");
        }
        console.log();
        for (var i = 36; i < 48; i++) {
            console.log(this.cardStatus[i] + " ");
        }
        console.log();
    };
    Player.prototype.updateCardStatus = function (card, player, canBeTossed) {
        if (canBeTossed) {
            this.cardStatus[card] = player | 1;
        }
        else {
            this.cardStatus[card] = player;
        }
    };
    Player.prototype.updateCardsStatus = function (cards, player, canBeTossed) {
        for (var i = 0; i < cards.cardCount; i++)
            this.updateCardStatus(cards.cards[i], player, canBeTossed);
    };
    Player.prototype.cardStatusNotification = function (cardPlayed, player, previousHighCard, originalSuit, trump) {
        this.cardStatus[cardPlayed] = 0; // mark card as already played
        if (Cards_1["default"].getSuit(cardPlayed) != originalSuit) {
            for (var n = originalSuit * 12; n < originalSuit * 12 + 12; n++) {
                this.cardStatus[n] &= ~player;
            }
            if (Cards_1["default"].getSuit(cardPlayed) != trump && originalSuit != trump) {
                for (var n = trump * 12; n < trump * 12 + 12; n++) {
                    this.cardStatus[n] &= ~player;
                }
            }
        }
        else {
            if (Cards_1["default"].getRank(cardPlayed) >= Cards_1["default"].getRank(previousHighCard) &&
                Cards_1["default"].getSuit(cardPlayed) == Cards_1["default"].getSuit(previousHighCard)) {
                // player doesn't have higher card than previousHighCard in same suit
                for (var n = Cards_1["default"].getSuit(cardPlayed) * 12; n < 2 * Math.floor(previousHighCard / 2); n++) {
                    this.cardStatus[n] &= ~player;
                }
            }
        }
    };
    /**
     * Removes count cards from the player's set.
     * @param count
     * @param trump
     * @return SetOfCards the removed cards
     */
    Player.prototype.discardCards = function (count, trump) {
        var discardedCards = [];
        this.myCards.sortCardsByRank(trump);
        var disposableCards = new SetOfCards_1["default"](15);
        for (var n = 0; n < this.myCards.cardCount; n++) {
            // check that card is not trump or ace
            if (Cards_1["default"].getSuit(this.myCards.cards[n]) != trump && Cards_1["default"].getRank(this.myCards.cards[n]) > 0) {
                disposableCards.addCard(this.myCards.cards[n]);
            }
        }
        disposableCards.sortCards();
        console.log("disposable: " + disposableCards);
        if (disposableCards.cardCount <= count) {
            for (var n = 0; n < disposableCards.cardCount; n++) {
                if (disposableCards.cards[n] % 12 < 4) {
                    this.meldPoints += 10;
                }
                else if (disposableCards.cards[n] % 12 < 8) {
                    this.meldPoints += 5;
                }
                this.myCards.removeCard(disposableCards.cards[n]);
                //console.log("1Discarding card "+Cards.cardString(disposableCards.cards[n]));
            }
            if (disposableCards.cardCount < count) {
                this.myCards.sortCardsByRank(trump);
                for (var n = disposableCards.cardCount; n < count; n++) {
                    if (disposableCards.cards[0] % 12 < 4) {
                        this.meldPoints += 10;
                    }
                    else if (disposableCards.cards[0] % 12 < 8) {
                        this.meldPoints += 5;
                    }
                    discardedCards.push(this.myCards.removeCard(disposableCards.cards[0]));
                    //console.log("2Discarding card "+Cards.cardString(disposableCards.cards[0]));
                }
            }
        }
        else {
            disposableCards.sortCards();
            //      let suitCounts = this.getSmallestSuits(disposableCards);
            var suitCounts = this.getSmallestSuits(this.myCards);
            var suitCount = suitCounts.suitCount;
            var suits = suitCounts.suits;
            console.log('suits: count: ' + JSON.stringify(suitCount) + '  suits: ' + JSON.stringify(suits));
            // remove cards from smallest suit(s)
            var i = count;
            var j = 0;
            var k = 0;
            while (i > 0) {
                var card = disposableCards.getCardBySuit(suits[j], k);
                if (card === null) {
                    j++;
                    k = 0;
                }
                else {
                    if (card % 12 < 4) {
                        this.meldPoints += 10;
                    }
                    else if (card % 12 < 8) {
                        this.meldPoints += 5;
                    }
                    discardedCards.push(this.myCards.removeCard(card));
                    //console.log("3Discarding card "+Cards.cardString(card));
                    k++;
                    i--;
                }
            }
        }
        for (var n = 0; n < this.cardStatus.length; n++) {
            if ((this.cardStatus[n] & 1) == 1 && (this.cardStatus[n] > 1)) {
                this.cardStatus[n] &= ~1;
            }
        }
        this.myCards.sortCards();
        var discardedSet = (new SetOfCards_1["default"](4)).addCards(discardedCards);
        this.updateCardsStatus(discardedSet, 0, true);
        return discardedSet;
    };
    Player.prototype.getSmallestSuits = function (cards) {
        var suitCount = [0, 0, 0, 0];
        var suits = [0, 1, 2, 3];
        // check how many cards in each suit
        for (var n = 0; n < cards.cardCount; n++) {
            suitCount[Math.floor(cards.cards[n] / 12)]++;
        }
        // see which suits are the smallest
        Util_1["default"].SortCardsByOdds(suitCount, suits);
        return { suitCount: suitCount, suits: suits };
    };
    return Player;
}());
exports["default"] = Player;
//# sourceMappingURL=Player.js.map