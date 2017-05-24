'use strict';
var Cards_1 = require('./Cards');
var SetOfCards_1 = require('./SetOfCards');
var Util_1 = require('./Util');
var Player = (function () {
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
        this.playerStrategy = 0;
        this.DEBUG = false;
        this.DEBUG2 = false;
        this.LOGICDEBUG = false;
        this.pointCards = [];
        this.posCards = [];
        //  int[] trickValues = { 16, 20, 14, 10, 5, 2, 14, 7, 2, 1, 0, 0 };
        //   int[] trickValues = { 16, 18, 15, 11, 4, 3, 13, 7, 0, 1, 0, 0 };
        //   int[] trickValues = { 23, 33, 18, 12, 9, 8, 20, 4, 2, 1, 0, 0 };
        // Kept bids: 711
        this.trickValues = [24, 34, 18, 13, 9, 8, 20, 4, 2, 1, 0, 0];
        // Kept bids: 567
        this.potentialPts = [[108, 9], [207, 34]];
        this.points = 0;
        this.potpoints = 0;
        this.trickPoints = 0;
        this.tmpTrump = null;
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
        this.allPlayersBITMASK = Util_1["default"].power(2, numberOfPlayers + 1) - 2;
        this.otherplayersBITMASK = this.allPlayersBITMASK & (~playerId);
        //console.log('bitmasks: ' + this.allPlayersBITMASK + " " + this.otherplayersBITMASK);
        this.cardType = new Cards_1["default"]();
        this.myCards = new SetOfCards_1["default"](this.cardType, maxCards);
        this.cardStatus = new Array(this.cardType.CARDSINDECK);
        this.newGame(playerId);
        this.myPlayerID = playerId;
        this.myCards.subset = new SetOfCards_1["default"](this.cardType, maxCards);
    }
    Player.prototype.addpoints = function (pts, message, statID) {
        this.points += pts;
        if (this.pointCards[this.tmpTrump] != "") {
            this.pointCards[this.tmpTrump] += ", ";
        }
        this.pointCards[this.tmpTrump] = this.pointCards[this.tmpTrump].concat(message);
        //console.log(message);
        /*    if ((!hela || statID!=5) && (!dubbelhela || statID!=3))
         stats[statID]++;
         */
    };
    Player.prototype.addPotentialpoints = function (pts, Stringmessage, tmpCardsMissing, possibilities) {
        if (tmpCardsMissing > 2) {
            return;
        }
        this.potpoints += pts * this.potentialPts[possibilities - 1][tmpCardsMissing - 1] / 1000;
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
     * @return The best suit.
     */
    Player.prototype.bidForTrump = function () {
        var canbetrump = false;
        var maxpoints = 0;
        var maxtrick = 0;
        var maxpot = 0;
        var mytrump = null;
        for (var m = 0; m < 4; m++) {
            canbetrump = this.checkForPoints(m);
            this.checkTrickPoints(m);
            if (canbetrump && (this.points + this.trickPoints + this.potpoints > maxpoints)) {
                mytrump = m;
                maxpoints = this.points + this.trickPoints + this.potpoints;
                maxtrick = this.trickPoints;
                maxpot = this.potpoints;
            }
        }
        this.points = maxpoints - maxtrick - maxpot;
        this.potpoints = maxpot;
        return mytrump;
    };
    Player.prototype.checkTrickPoints = function (trump) {
        this.trickPoints = 0;
        for (var i = 0; i < this.myCards.cardCount; i++) {
            if (this.cardType.getSuit(this.myCards.cards[i]) == trump) {
                this.trickPoints += this.trickValues[this.cardType.getRank(this.myCards.cards[i])];
            }
            else {
                this.trickPoints += this.trickValues[this.cardType.getRank(this.myCards.cards[i]) + 6];
            }
        }
    };
    Player.prototype.checkForPoints = function (trump) {
        this.myCards.subset.clear();
        this.tmpTrump = trump;
        this.pointCards[this.tmpTrump] = "";
        this.points = 0;
        this.potpoints = 0;
        var canBeTrump = false;
        var dubbelHela = false;
        var piinakka = null;
        var tmpCardsMissing = 0;
        if (trump == 0) {
            tmpCardsMissing = this.myCards.containsCards(this.spaderdubbel);
            if (tmpCardsMissing == 0) {
                this.addpoints(1000, "dubbel spaderpiinakka!", 1);
                piinakka = 0;
                canBeTrump = true;
            }
            else {
                this.addPotentialpoints(1000, "dubbel spaderpiinakka!", tmpCardsMissing, 1);
                tmpCardsMissing = this.myCards.containsOneOfEach(this.spaderdh); // spaderpiinakka med dubbel hela
                if (tmpCardsMissing == 0) {
                    this.addpoints(250, "spaderpiinakka med dubbel hela", 2);
                    canBeTrump = true;
                    piinakka = 0;
                }
                else {
                    this.addPotentialpoints(250, "spaderpiinakka med dubbel hela!", tmpCardsMissing, 1);
                    tmpCardsMissing = this.myCards.containsOneOfEach(this.spaderpiinakka); // spaderpiinakka
                    if (tmpCardsMissing == 0) {
                        this.addpoints(150, "spaderpiinakka", 16);
                        canBeTrump = true;
                        piinakka = 0;
                    }
                    else {
                        this.addPotentialpoints(150, "spaderpiinakka", tmpCardsMissing, 2);
                    }
                }
            }
        }
        else if (trump == 1) {
            tmpCardsMissing = this.myCards.containsCards(this.hjarterdubbel);
            if (tmpCardsMissing == 0) {
                this.addpoints(1000, "dubbel hjärterpiinakka!", 1);
                piinakka = 1;
                canBeTrump = true;
            }
            else {
                this.addPotentialpoints(1000, "dubbel hj�rterpiinakka!", tmpCardsMissing, 1);
                tmpCardsMissing = this.myCards.containsOneOfEach(this.hjarterdh); // spaderpiinakka med dubbel hela
                if (tmpCardsMissing == 0) {
                    this.addpoints(250, "hjärterpiinakka med dubbel hela", 2);
                    canBeTrump = true;
                    piinakka = 1;
                }
                else {
                    this.addPotentialpoints(250, "hj�rterpiinakka med dubbel hela", tmpCardsMissing, 1);
                    tmpCardsMissing = this.myCards.containsOneOfEach(this.hjarterpiinakka); // spaderpiinakka
                    if (tmpCardsMissing == 0) {
                        this.addpoints(150, "hjärterpiinakka", 16);
                        canBeTrump = true;
                        piinakka = 1;
                    }
                    else {
                        this.addPotentialpoints(150, "hjärterpiinakka", tmpCardsMissing, 2);
                    }
                }
            }
        }
        else if (trump == 2) {
            tmpCardsMissing = this.myCards.containsCards(this.kloverdubbel);
            if (tmpCardsMissing == 0) {
                this.addpoints(1000, "dubbel klöverpiinakka!", 1);
                piinakka = 2;
                canBeTrump = true;
            }
            else {
                this.addPotentialpoints(1000, "dubbel klöverpiinakka", tmpCardsMissing, 1);
                tmpCardsMissing = this.myCards.containsOneOfEach(this.kloverdh); // spaderpiinakka med dubbel hela
                if (tmpCardsMissing == 0) {
                    this.addpoints(250, "klöverpiinakka med dubbel hela", 2);
                    canBeTrump = true;
                    piinakka = 2;
                }
                else {
                    this.addPotentialpoints(250, "klöverpiinakka med dubbel hela", tmpCardsMissing, 1);
                    tmpCardsMissing = this.myCards.containsOneOfEach(this.kloverpiinakka); // spaderpiinakka
                    if (tmpCardsMissing == 0) {
                        this.addpoints(150, "klöverpiinakka", 16);
                        canBeTrump = true;
                        piinakka = 2;
                    }
                    else {
                        this.addPotentialpoints(150, "klöverpiinakka ", tmpCardsMissing, 2);
                    }
                }
            }
        }
        else if (trump == 3) {
            tmpCardsMissing = this.myCards.containsCards(this.ruterdubbel);
            if (tmpCardsMissing == 0) {
                this.addpoints(1000, "dubbel ruterpiinakka!", 1);
                piinakka = 3;
                canBeTrump = true;
            }
            else {
                this.addPotentialpoints(1000, "dubbel ruterpiinakka ", tmpCardsMissing, 1);
                tmpCardsMissing = this.myCards.containsOneOfEach(this.ruterdh); // spaderpiinakka med dubbel hela
                if (tmpCardsMissing == 0) {
                    this.addpoints(250, "ruterpiinakka med dubbel hela", 2);
                    canBeTrump = true;
                    piinakka = 3;
                }
                else {
                    this.addPotentialpoints(250, "ruterpiinakka med dubbel hela", tmpCardsMissing, 1);
                    tmpCardsMissing = this.myCards.containsOneOfEach(this.ruterpiinakka); // spaderpiinakka
                    if (tmpCardsMissing == 0) {
                        this.addpoints(150, "ruterpiinakka", 16);
                        canBeTrump = true;
                        piinakka = 3;
                    }
                    else {
                        this.addPotentialpoints(150, "ruterpiinakka ", tmpCardsMissing, 2);
                    }
                }
            }
        }
        tmpCardsMissing = this.myCards.containsCards(this.spader2x);
        if (piinakka != 0) {
            if (trump == 0) {
                if (tmpCardsMissing == 0) {
                    this.addpoints(100, "spader dubbel hela", 3);
                    canBeTrump = true;
                    dubbelHela = true;
                }
                else {
                    this.addPotentialpoints(100, "spader dubbel hela ", tmpCardsMissing, 1);
                }
            }
            else {
                if (tmpCardsMissing == 0) {
                    this.addpoints(40, "spader dubbel hela", 3);
                }
                else {
                    this.addPotentialpoints(40, "spader dubbel hela ", tmpCardsMissing, 1);
                }
            }
        }
        tmpCardsMissing = this.myCards.containsOneOfEach(this.spader);
        if (piinakka != 0 && !dubbelHela) {
            if (trump == 0) {
                if (tmpCardsMissing == 0) {
                    this.addpoints(40, "spaderhela", 5);
                    canBeTrump = true;
                }
                else {
                    this.addPotentialpoints(40, "spader hela ", tmpCardsMissing, 2);
                }
            }
            else if (tmpCardsMissing == 0) {
                this.addpoints(20, "spaderhela", 5);
            }
            else {
                this.addPotentialpoints(20, "spader hela ", tmpCardsMissing, 2);
            }
        }
        dubbelHela = false;
        tmpCardsMissing = this.myCards.containsCards(this.hjarter2x);
        if (piinakka != 1) {
            if (trump == 1) {
                if (tmpCardsMissing == 0) {
                    this.addpoints(100, "hjärter dubbelhela", 3);
                    canBeTrump = true;
                    dubbelHela = true;
                }
                else {
                    this.addPotentialpoints(100, "hjärter dubbel hela ", tmpCardsMissing, 1);
                }
            }
            else {
                if (tmpCardsMissing == 0) {
                    this.addpoints(40, "hjärter dubbelhela", 3);
                }
                else {
                    this.addPotentialpoints(40, "hjärter dubbel hela ", tmpCardsMissing, 1);
                }
            }
        }
        tmpCardsMissing = this.myCards.containsOneOfEach(this.hjarter);
        if (piinakka != 1 && !dubbelHela) {
            if (trump == 1) {
                if (tmpCardsMissing == 0) {
                    this.addpoints(40, "hjärterhela", 5);
                    canBeTrump = true;
                }
                else {
                    this.addPotentialpoints(40, "hjärter hela ", tmpCardsMissing, 2);
                }
            }
            else if (tmpCardsMissing == 0) {
                this.addpoints(20, "hjärterhela", 5);
            }
            else {
                this.addPotentialpoints(20, "hjärter hela ", tmpCardsMissing, 2);
            }
        }
        dubbelHela = false;
        tmpCardsMissing = this.myCards.containsCards(this.klover2x);
        if (piinakka != 2) {
            if (trump == 2) {
                if (tmpCardsMissing == 0) {
                    this.addpoints(100, "klöver dubbelhela", 3);
                    canBeTrump = true;
                    dubbelHela = true;
                }
                else {
                    this.addPotentialpoints(100, "klöver dubbelhela ", tmpCardsMissing, 1);
                }
            }
            else {
                if (tmpCardsMissing == 0) {
                    this.addpoints(40, "klöver dubbelhela", 3);
                }
                else {
                    this.addPotentialpoints(40, "klöver dubbelhela ", tmpCardsMissing, 1);
                }
            }
        }
        tmpCardsMissing = this.myCards.containsOneOfEach(this.klover);
        if (piinakka != 2 && !dubbelHela) {
            if (trump == 2) {
                if (tmpCardsMissing == 0) {
                    this.addpoints(40, "klöverhela", 5);
                    canBeTrump = true;
                }
                else {
                    this.addPotentialpoints(40, "klöver hela ", tmpCardsMissing, 2);
                }
            }
            else if (tmpCardsMissing == 0) {
                this.addpoints(20, "klöverhela", 5);
            }
            else {
                this.addPotentialpoints(20, "klöver hela ", tmpCardsMissing, 2);
            }
        }
        dubbelHela = false;
        tmpCardsMissing = this.myCards.containsCards(this.ruter2x);
        if (piinakka != 3) {
            if (trump == 3) {
                if (tmpCardsMissing == 0) {
                    this.addpoints(100, "ruter dubbelhela", 3);
                    canBeTrump = true;
                    dubbelHela = true;
                }
                else {
                    this.addPotentialpoints(100, "ruter dubbelhela ", tmpCardsMissing, 1);
                }
            }
            else {
                if (tmpCardsMissing == 0) {
                    this.addpoints(40, "ruter dubbelhela", 3);
                }
                else {
                    this.addPotentialpoints(40, "ruter dubbelhela ", tmpCardsMissing, 1);
                }
            }
        }
        tmpCardsMissing = this.myCards.containsOneOfEach(this.ruter);
        if (piinakka != 3) {
            if (trump == 3) {
                if (tmpCardsMissing == 0) {
                    this.addpoints(40, "ruterhela", 5);
                    canBeTrump = true;
                }
                else {
                    this.addPotentialpoints(40, "ruter hela ", tmpCardsMissing, 2);
                }
            }
            else if (tmpCardsMissing == 0) {
                this.addpoints(20, "ruterhela", 5);
            }
            else {
                this.addPotentialpoints(40, "ruter hela ", tmpCardsMissing, 2);
            }
        }
        if (this.myCards.containsOneOfEach([[trump * 12 + 10], [trump * 12 + 11]]) == 0) {
            this.addpoints(20, "två trumf 9", 4);
        }
        else if (this.myCards.containsOneOfEach([[trump * 12 + 10, trump * 12 + 11]]) == 0) {
            this.addpoints(10, "trumf 9", 4);
        }
        tmpCardsMissing = this.myCards.containsCards(this.a8);
        if (tmpCardsMissing == 0) {
            this.addpoints(800, "8 äss!", 6);
        }
        else {
            this.addPotentialpoints(800, "8äss ", tmpCardsMissing, 1);
            tmpCardsMissing = this.myCards.containsOneOfEach(this.a4);
            if (tmpCardsMissing == 0) {
                this.addpoints(100, "4 äss", 7);
            }
            else {
                this.addPotentialpoints(100, "4äss ", tmpCardsMissing, 2);
            }
        }
        tmpCardsMissing = this.myCards.containsCards(this.k8);
        if (tmpCardsMissing == 0) {
            this.addpoints(600, "8 kungar!", 8);
        }
        else {
            this.addPotentialpoints(600, "8 K ", tmpCardsMissing, 1);
            tmpCardsMissing = this.myCards.containsOneOfEach(this.k4);
            if (tmpCardsMissing == 0) {
                this.addpoints(80, "4 kungar", 9);
            }
            else if (tmpCardsMissing <= 2) {
                this.addPotentialpoints(80, "4 K ", tmpCardsMissing, 2);
            }
        }
        tmpCardsMissing = this.myCards.containsCards(this.q8);
        if (tmpCardsMissing == 0) {
            this.addpoints(400, "8 damer!", 10);
        }
        else {
            this.addPotentialpoints(400, "8 Q ", tmpCardsMissing, 1);
            tmpCardsMissing = this.myCards.containsOneOfEach(this.q4);
            if (tmpCardsMissing == 0) {
                this.addpoints(60, "4 damer", 11);
            }
            else {
                this.addPotentialpoints(60, "4 Q ", tmpCardsMissing, 2);
            }
        }
        tmpCardsMissing = this.myCards.containsCards(this.j8);
        if (tmpCardsMissing == 0) {
            this.addpoints(200, "8 knäktar!", 10);
        }
        else {
            this.addPotentialpoints(200, "8 J ", tmpCardsMissing, 1);
            tmpCardsMissing = this.myCards.containsOneOfEach(this.j4);
            if (tmpCardsMissing == 0) {
                this.addpoints(40, "4 knäktar", 11);
            }
            else {
                this.addPotentialpoints(40, "4 J ", tmpCardsMissing, 2);
            }
        }
        tmpCardsMissing = this.myCards.containsCards(this.dkdk);
        if (tmpCardsMissing == 0) {
            this.addpoints(200, "spader dam, ruter knäkt dubbelt!", 14);
        }
        else {
            this.addPotentialpoints(200, "spader dam, ruter knäkt dubbelt!", tmpCardsMissing, 1);
            if (this.myCards.containsOneOfEach(this.dk) == 0) {
                this.addpoints(40, "spader dam, ruter knäkt", 15);
            }
        }
        return canBeTrump;
    };
    Player.prototype.haveHigher = function (suit, card) {
        var n = 0;
        if (!this.myCards.sorted) {
            this.myCards.sortCards();
        }
        //    console.log("have higher n:"+n);
        if (suit === null) {
            return true;
        } // any suit -> any card will do
        //    console.log("orig suit: "+suit);
        //    console.log("orig rank: "+Cards.getRank(card));
        while (n < this.myCards.cardCount) {
            //      console.log("while suit: "+Cards.getSuit(this.myCards.cards[n]));
            //      console.log("while rank: "+Cards.getRank(this.myCards.cards[n]));
            if ((this.cardType.getRank(card) > this.cardType.getRank(this.myCards.cards[n]) && this.cardType.getSuit(this.myCards.cards[n]) == suit)) {
                break;
            }
            n++;
        }
        //   console.log("after while n:"+n);
        if (n < this.myCards.cardCount) {
            if (this.cardType.getSuit(this.myCards.cards[n]) == suit) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    Player.prototype.getHigher = function (suit, card) {
        if (suit == null) {
            return this.myCards;
        } // any suit -> any card will do
        var higherCards = new SetOfCards_1["default"](this.cardType, this.myCards.maxCardCount);
        var n = 0;
        if (!this.myCards.sorted) {
            this.myCards.sortCards();
        }
        while (n < this.myCards.cardCount) {
            //      console.log("card/2: "+ card/2+ ", my/2: "+this.myCards.cards[n]/2+", mysuit: "+this.myCards.cards[n] / 12 +", suit: "+suit);
            if (this.cardType.getRank(card) > this.cardType.getRank(this.myCards.cards[n]) && this.cardType.getSuit(this.myCards.cards[n]) == suit) {
                break;
            }
            n++;
        }
        //    console.log("get higher n:"+n);
        //let retcards = [];
        var i = 0;
        while (n < this.myCards.cardCount) {
            if (this.cardType.getRank(card) > this.cardType.getRank(this.myCards.cards[n]) && (this.cardType.getSuit(this.myCards.cards[n]) == suit)) {
                //        retcards[i] = this.myCards.cards[n];
                higherCards.addCard(this.myCards.cards[n]);
                i++;
            }
            n++;
        }
        // console.log("get higher i:"+i);
        //    return new SetOfCards(retcards, i);
        return higherCards;
    };
    Player.prototype.playCard = function (cardsOnTable, trump, highestCard, remainingPlayers) {
        var takeTrick = true;
        var playableCards;
        var originalSuit = this.cardType.getSuit(cardsOnTable.cards[0]);
        if (cardsOnTable.cardCount == 0) {
            if (this.LOGICDEBUG) {
                console.log("play any");
            }
            playableCards = this.getHigher(null, this.cardType.CARDSINDECK);
        }
        else {
            //      console.log("suit: "+originalSuit);
            if (this.cardType.getSuit(highestCard) == trump && originalSuit == trump) {
                if (this.haveHigher(trump, highestCard)) {
                    if (this.LOGICDEBUG) {
                        console.log("trump: have higher trump");
                    }
                    playableCards = this.getHigher(trump, highestCard);
                }
                else if (this.haveHigher(trump, this.cardType.CARDSINDECK)) {
                    if (this.LOGICDEBUG) {
                        console.log("trump: have lower trump ");
                    }
                    takeTrick = false;
                    playableCards = this.getHigher(trump, this.cardType.CARDSINDECK);
                }
                else {
                    if (this.LOGICDEBUG) {
                        console.log("trump: play any");
                    }
                    takeTrick = false;
                    playableCards = this.getHigher(null, this.cardType.CARDSINDECK);
                }
            }
            else if (this.cardType.getSuit(highestCard) == trump) {
                if (this.haveHigher(originalSuit, this.cardType.CARDSINDECK)) {
                    if (this.LOGICDEBUG) {
                        console.log("suit+trump: have suit " + trump);
                    }
                    takeTrick = false;
                    playableCards = this.getHigher(originalSuit, this.cardType.CARDSINDECK);
                }
                else if (this.haveHigher(trump, highestCard)) {
                    if (this.LOGICDEBUG) {
                        console.log("suit+trump: have higher trump " + trump);
                    }
                    playableCards = this.getHigher(trump, highestCard);
                }
                else if (this.haveHigher(trump, this.cardType.CARDSINDECK)) {
                    if (this.LOGICDEBUG) {
                        console.log("suit+trump: have lower trump " + trump);
                    }
                    takeTrick = false;
                    playableCards = this.getHigher(trump, this.cardType.CARDSINDECK);
                }
                else {
                    if (this.LOGICDEBUG) {
                        console.log("suit+trump: play any " + trump);
                    }
                    takeTrick = false;
                    playableCards = this.getHigher(null, this.cardType.CARDSINDECK);
                }
            }
            else {
                if (this.haveHigher(originalSuit, highestCard)) {
                    if (this.LOGICDEBUG) {
                        console.log("have higher");
                    }
                    playableCards = this.getHigher(originalSuit, highestCard);
                }
                else if (this.haveHigher(originalSuit, this.cardType.CARDSINDECK)) {
                    if (this.LOGICDEBUG) {
                        console.log("have lower");
                    }
                    takeTrick = false;
                    playableCards = this.getHigher(originalSuit, this.cardType.CARDSINDECK);
                }
                else if (this.haveHigher(trump, this.cardType.CARDSINDECK)) {
                    if (this.LOGICDEBUG) {
                        console.log("have trump");
                    }
                    playableCards = this.getHigher(trump, this.cardType.CARDSINDECK);
                }
                else {
                    if (this.LOGICDEBUG) {
                        console.log("have any");
                    }
                    takeTrick = false;
                    playableCards = this.getHigher(null, this.cardType.CARDSINDECK);
                }
            }
        }
        var cardToPlay;
        if (takeTrick) {
            // try to take the trick
            if (playableCards.cardCount == 1) {
                if (this.LOGICDEBUG) {
                    console.log("Playable cards 1: " + playableCards);
                }
                cardToPlay = playableCards.cards[0];
                this.myCards.removeCard(cardToPlay); // play the only possible card
            }
            else if (playableCards.cardCount == 2 && Math.floor(playableCards.cards[0] / 2) == Math.floor(playableCards.cards[1] / 2)) {
                if (this.LOGICDEBUG) {
                    console.log("Playable cards 2: " + playableCards);
                }
                cardToPlay = playableCards.cards[0];
                this.myCards.removeCard(cardToPlay); // both cards are the same
            }
            else {
                if (this.LOGICDEBUG) {
                    console.log("Playable cards: " + playableCards);
                }
                cardToPlay = this.findBestCard(playableCards, trump, remainingPlayers, cardsOnTable.cards[0]);
                this.myCards.removeCard(cardToPlay); // play the best card
            }
        }
        else {
            // throw the lowest card you have
            playableCards.sortCardsByRank(trump);
            if (this.LOGICDEBUG) {
                console.log("Playable low cards sorted: " + playableCards);
            }
            cardToPlay = playableCards.cards[0];
            this.myCards.removeCard(cardToPlay); // play the lowest card
        }
        if (this.LOGICDEBUG) {
            console.log(this.myPlayerID + " Card Played: " + this.cardType.cardString(cardToPlay));
        }
        return cardToPlay;
    };
    Player.prototype.newGame = function (playerID) {
        this.myCards.clear();
        for (var n = 0; n < this.cardStatus.length; n++) {
            this.cardStatus[n] = this.otherplayersBITMASK; // anyone else may have card
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
    Player.prototype.findBestCard = function (playableCards, trump, remainingPlayers, originalCard) {
        var cardOdds = [];
        //    let tmp;
        if (remainingPlayers == 0) {
            playableCards.sortCardsByRank(trump);
            this.cardStatus[playableCards.cards[0]] = 0;
            return playableCards.cards[0];
        }
        else {
            playableCards.sortCardsByRank(trump);
            // play lowest card with best odds
            for (var n = 0; n < playableCards.cardCount; n++) {
                cardOdds[n] = this.getOdds(playableCards.cards[n], trump, remainingPlayers, originalCard);
                if (this.LOGICDEBUG) {
                    console.log(this.cardType.cardString(playableCards.cards[n]) + " - " + cardOdds[n] + "%");
                }
            }
            //      tmp =
            Util_1["default"].ArraySort2(cardOdds, playableCards.cards);
            //      cardOdds=tmp[0];
            //      for (n=0;n<playableCards.cardCount;n++) {
            //        if (myPlayerID == 2) console.log(this.cardType.cardString(
            //            playableCards.cards[n]) + " - " + cardOdds[n] + "%");
            //      }
            if (cardOdds[cardOdds.length - 1] >= 500) {
                if (this.playerStrategy == 1) {
                    for (var i = cardOdds.length - 2; i > 0; i--)
                        if (cardOdds[i] < cardOdds[cardOdds.length - 1]) {
                            return playableCards.cards[i + 1]; // return lowest card with best odds (over 50%)
                        }
                    return playableCards.cards[0];
                }
                else {
                    return playableCards.cards[cardOdds.length - 1];
                }
            }
            else {
                return playableCards.cards[0]; // return card with worst odds
            }
        }
    };
    Player.prototype.getOdds = function (myCard, trump, remainingPlayers, originalCard) {
        var mySuit = this.cardType.getSuit(myCard);
        var start = mySuit * this.cardType.CARDSINSUIT; // highest card in suit
        var end = (Math.floor(myCard / 2)) * 2; //
        var notHigher;
        var notLower = [];
        var notTrump = [];
        var totsum;
        var possibleOwners;
        var ownersLeft;
        var thisOwner;
        if (this.DEBUG) {
            console.log("card to compare: " + this.cardType.cardString(myCard));
        }
        //    console.log("originalcard: " +originalCard);
        totsum = 1000;
        notHigher = 1000;
        if (mySuit == this.cardType.getSuit(originalCard) || originalCard === null) {
            start = mySuit * 12; // highest card in suit
            end = (Math.floor(myCard / 2)) * 2; //
            if (this.DEBUG)
                console.log("start-end: " + start + " - " + end);
            for (var n = start; n < end; n++) {
                if (this.DEBUG) {
                    console.log("H comparing: " + this.cardType.cardString(n) + ' status: ' + this.cardStatus[n]);
                }
                // calculate chance of this player NOT having card
                possibleOwners = this.bitCount(this.cardStatus[n] & (this.otherplayersBITMASK));
                ownersLeft = this.bitCount(this.cardStatus[n] & remainingPlayers);
                if (possibleOwners != 0) {
                    //            notHigher[player] *= 1000 -
                    //                this.bitCount(this.cardStatus[n] & (2 << player)) * 1000 / possibleOwners;
                    notHigher *= 1000 - ownersLeft * 1000 / possibleOwners;
                    notHigher /= 1000;
                }
            }
            if (this.DEBUG) {
                console.log("notHigher: " + notHigher);
            }
            totsum *= notHigher;
            totsum /= 1000;
            if (mySuit != trump) {
                for (var player = 0; player < this.NumberOfPlayers; player++) {
                    notLower[player] = 1000;
                    notTrump[player] = 1000;
                    thisOwner = 2 << player;
                    if ((thisOwner & remainingPlayers) == 0) {
                        continue;
                    }
                    if (this.DEBUG) {
                        console.log("player " + player);
                    }
                    var lstart = (Math.floor(myCard / 2)) * 2; // check for lower cards in suit
                    var lend = mySuit * 12 + 12;
                    //      if (this.DEBUG) console.log("lstart-lend: " + lstart + " - " +lend);
                    for (var n = lstart; n < lend; n++) {
                        if (this.DEBUG) {
                            console.log("L comparing: " + this.cardType.cardString(n));
                        }
                        // calculate chance of this player NOT having card
                        possibleOwners = this.bitCount(this.cardStatus[n] & this.otherplayersBITMASK);
                        ownersLeft = this.bitCount(this.cardStatus[n] & thisOwner);
                        if (possibleOwners != 0) {
                            notLower[player] *= 1000 - ownersLeft * 1000 / possibleOwners;
                            notLower[player] /= 1000;
                        }
                    }
                    var tstart = trump * 12; // lowest trump
                    var tend = trump * 12 + 12; // highest trump
                    //        if (this.DEBUG) console.log("lstart-lend: " + tstart + " - " +tend);
                    for (var n = tstart; n < tend; n++) {
                        if (this.DEBUG) {
                            console.log("T comparing: " + this.cardType.cardString(n));
                        }
                        // calculate chance of player NOT having card
                        possibleOwners = this.bitCount(this.cardStatus[n] & this.otherplayersBITMASK);
                        ownersLeft = this.bitCount(this.cardStatus[n] & thisOwner);
                        if (possibleOwners != 0) {
                            notTrump[player] *= 1000 -
                                ownersLeft * 1000 /
                                    possibleOwners;
                            notTrump[player] /= 1000;
                        }
                    }
                    if (this.DEBUG) {
                        console.log("notLower: " + notLower[player]);
                    }
                    if (this.DEBUG) {
                        console.log("notTrump: " + notTrump[player]);
                    }
                    totsum *= 1000 - notLower[player] * (1000 - notTrump[player]) / 1000;
                    totsum /= 1000;
                }
            }
        }
        else {
            start = Math.floor(originalCard / 12) * 12; // highest card in original suit
            end = start + 12; // lowest
            if (this.DEBUG) {
                console.log("start-end: " + start + " - " + end);
            }
            for (var player = 0; player < this.NumberOfPlayers; player++) {
                notLower[player] = 1000;
                notTrump[player] = 1000;
                thisOwner = 2 << player;
                if ((thisOwner & remainingPlayers) == 0) {
                    continue;
                }
                for (var n = start; n < end; n++) {
                    if (this.DEBUG) {
                        console.log("S comparing: " + this.cardType.cardString(n));
                    }
                    // calculate chance of player NOT having card
                    possibleOwners = this.bitCount(this.cardStatus[n] & this.otherplayersBITMASK);
                    ownersLeft = this.bitCount(this.cardStatus[n] & thisOwner);
                    if (possibleOwners != 0) {
                        notLower[player] *= 1000 -
                            ownersLeft * 1000 / possibleOwners;
                        notLower[player] /= 1000;
                    }
                }
                var tstart = mySuit * 12; // highest trump
                var tend = (Math.floor(myCard / 2)) * 2; // lowest trump higher than mine
                //      if (this.DEBUG) console.log("lstart-lend: " + tstart + " - " +tend);
                for (var n = tstart; n < tend; n++) {
                    if (this.DEBUG) {
                        console.log("TT comparing: " + this.cardType.cardString(n));
                    }
                    // calculate chance of player NOT having trump
                    possibleOwners = this.bitCount(this.cardStatus[n] & this.otherplayersBITMASK);
                    ownersLeft = this.bitCount(this.cardStatus[n] & thisOwner);
                    if (possibleOwners != 0) {
                        notTrump[player] *= 1000 -
                            ownersLeft * 1000 /
                                possibleOwners;
                        notTrump[player] /= 1000;
                    }
                }
                if (this.DEBUG) {
                    console.log("notOriginal: " + notLower[player]);
                }
                if (this.DEBUG) {
                    console.log("notTrump: " + notTrump[player]);
                }
                // !(!original & högretrumf)
                totsum *= 1000 - (notLower[player] * (1000 - notTrump[player])) / 1000;
                totsum /= 1000;
            }
        }
        if (this.DEBUG) {
            console.log("odds for " + this.cardType.cardString(myCard) + ": " + totsum / 10 + "%");
        }
        return totsum;
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
    Player.prototype.singleCardOwnerNotification = function (card, player, canBeTossed) {
        if (canBeTossed) {
            this.cardStatus[card] = player | 1;
        }
        else {
            this.cardStatus[card] = player | 1;
        }
    };
    Player.prototype.cardOwnerNotification = function (cards, player, canBeTossed) {
        for (var i = 0; i < cards.cardCount; i++)
            this.singleCardOwnerNotification(cards.cards[i], player, canBeTossed);
    };
    Player.prototype.cardStatusNotification = function (cardPlayed, player, previousHighCard, originalSuit, trump, i) {
        this.cardStatus[cardPlayed] = 0; // mark card as already played
        //    if (i==0) console.log(player+" card "+cardPlayed+" status: "+this.cardStatus[cardPlayed]);
        if (this.cardType.getSuit(cardPlayed) != originalSuit) {
            //      if (i==0) console.log("Player "+player+" doesn't have "+SetOfCards.suits[originalSuit]);
            for (var n = originalSuit * 12; n < originalSuit * 12 + 12; n++) {
                this.cardStatus[n] &= ~player;
            }
            if (this.cardType.getSuit(cardPlayed) != trump && originalSuit != trump) {
                //        if (i==0) console.log("Player "+player+" doesn't have trump");
                for (var n = trump * 12; n < trump * 12 + 12; n++) {
                    this.cardStatus[n] &= ~player;
                }
            }
        }
        else {
            if (this.cardType.getRank(cardPlayed) >= this.cardType.getRank(previousHighCard) && this.cardType.getSuit(cardPlayed) == this.cardType.getSuit(previousHighCard)) {
                // player doesn't have higher card than previousHighCard in same suit
                for (var n = this.cardType.getSuit(cardPlayed) * 12; n < 2 * Math.floor(previousHighCard / 2); n++) {
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
        var tmp = new SetOfCards_1["default"](this.cardType, 15);
        for (var n = 0; n < this.myCards.cardCount; n++) {
            // check that card is not trump or ace
            if (this.cardType.getSuit(this.myCards.cards[n]) != trump && this.cardType.getRank(this.myCards.cards[n]) > 0) 
            // add card to list of disposable cards.
            {
                tmp.addCard(this.myCards.cards[n]);
            }
        }
        //console.log("disposable: "+tmp);
        if (tmp.cardCount <= count) {
            for (var n = 0; n < tmp.cardCount; n++) {
                if (tmp.cards[n] % 12 < 4) {
                    this.points += 10;
                }
                else if (tmp.cards[n] % 12 < 8) {
                    this.points += 5;
                }
                this.myCards.removeCard(tmp.cards[n]);
                //console.log("1Discarding card "+this.cardType.cardString(tmp.cards[n]));
                this.singleCardOwnerNotification(tmp.cards[n], 0, true);
            }
            if (tmp.cardCount < 4) {
                this.myCards.sortCardsByRank(trump);
                for (var n = tmp.cardCount; n < count; n++) {
                    if (tmp.cards[0] % 12 < 4) {
                        this.points += 10;
                    }
                    else if (tmp.cards[0] % 12 < 8) {
                        this.points += 5;
                    }
                    discardedCards.push(this.myCards.removeCard(tmp.cards[0]));
                    //console.log("2Discarding card "+this.cardType.cardString(tmp.cards[0]));
                    this.singleCardOwnerNotification(tmp.cards[0], 0, true);
                }
            }
        }
        else {
            tmp.sortCards();
            var suitcount = [];
            var suits = [0, 1, 2, 3];
            // check how many cards in each suit
            for (var n = 0; n < tmp.cardCount; n++) {
                suitcount[Math.floor(tmp.cards[n] / 12)]++;
            }
            // see which suits are the smallest
            Util_1["default"].ArraySort2(suitcount, suits);
            //console.log(JSON.stringify(suits));
            // remove cards from smallest suit(s)
            var i = count;
            var j = 0;
            var k = 0;
            while (i > 0) {
                var card = tmp.getCardBySuit(suits[j], k);
                if (card === null) {
                    j++;
                    k = 0;
                }
                else {
                    if (card % 12 < 4) {
                        this.points += 10;
                    }
                    else if (card % 12 < 8) {
                        this.points += 5;
                    }
                    discardedCards.push(this.myCards.removeCard(card));
                    //console.log("3Discarding card "+this.cardType.cardString(card));
                    this.singleCardOwnerNotification(card, 0, true);
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
        return (new SetOfCards_1["default"](new Cards_1["default"](), 4)).addCards(discardedCards);
    };
    return Player;
}());
exports.__esModule = true;
exports["default"] = Player;
//# sourceMappingURL=Player.js.map