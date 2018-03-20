var express = require('express');
var bodyParser = require('body-parser');
import GameOfPinochle from './server/GameOfPinochle';


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.game = new GameOfPinochle();


app.get('/api/start', function(req, res, next) {
  // start a new game, deal cards
  console.log('Starting game!');
  app.game.newGame();
  res.send(app.game.getState());
});

app.get('/api/play-card', function(req, res, next) {
  // human player plays a card
  res.send(app.game.getState());
});

app.get('/api/discard', function(req, res, next) {
  console.log('discard called');
  app.game.cpuDiscardCards();
  res.send(app.game.getState());
});

app.get('/api/play-round', function(req, res, next) {
  if (app.game.playNextRound()) {
    res.send(app.game.getState());
  } else {
    res.send(app.game.getState());
  }
});

app.get('/api/play-rounds', function(req, res, next) {
  for(let n=0;n<10000;n++) {
    app.game.newGame();
    if (app.game.state !== "cannotBid") {
      app.game.playRounds();
    }
  }
  app.game.getStats();
  res.send(app.game.getState());
});

app.get('/api/get-state', function(req, res, next) {
  // get full game status from server: all cards, points, etc
  res.send(app.game.getState());
});

app.use(express.static('public'));
app.use(express.static('bower_components'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  console.log('page not found: ' + JSON.stringify(req));
//  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  next();
});


app.listen(3000, function() {

    app.emit('started');

  console.log('Example app listening on port 3000!')
});

module.exports = app;
