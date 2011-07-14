require.paths.unshift(__dirname + '/lib');

var twitter     = require('twitter'),
    processor   = require('processor'),
    database    = require('database'),
    filters = require('filters');
    server      = require('server')
    calculation = require('calculation')
    
    config      = require('./config').Config


twitter.start(filters.KEYWORDS, function(tweet){
    var tally = processor.process(tweet.text, function(tally){
        database.persist(tweet, tally);
        server.broadcast({
          tally: tally,
          tweet: tweet.text,
          user:  tweet.user.screen_name
        });
    });
});

// Calculate and broadcast updates 
// Wait +calculationInterval+ milliseconds between calculations
calculation.start(server.broadcast, config.calculationInterval)

// Catch uncaught exceptions
process.addListener("uncaughtException", function (err) {
    console.error("Uncaught Exception: " + err);
    console.error(err.stack);
});


server.start(function(){
    server.socket.on('connection', function(client){
        calculation.last(function(result){
            client.send(result)
        })
    })
});
