require.paths.unshift(__dirname + '/lib');

var twitter     = require('twitter'),
    filters     = require('filters'),
    processor   = require('processor'),
    database    = require('database'),
    server      = require('server')
    calculation = require('calculation')
    
    config      = require('./config').Config


twitter.start(filters.KEYWORDS, function(tweet){
    var tally = processor.process(filters.MAP, tweet.text);
    database.persist(tweet, tally);
    server.broadcast({
      tally: tally,
      tweet: tweet.text,
      user:  tweet.user.screen_name
    });
});

// Calculate and broadcast updates 
// Wait +calculationInterval+ milliseconds between calculations
calculation.start(server.broadcast, config.calculationInterval)

server.start(function(){
    server.socket.on('connection', function(client){
        calculation.last(function(result){
            client.send(result)
        })
    })
});
