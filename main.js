require.paths.unshift(__dirname + '/lib');

var twitter   = require('twitter'),
    filters   = require('filters'),
    processor = require('processor'),
    database  = require('database'),
    server    = require('server')

// Call only once
twitter.start(filters.KEYWORDS, function(tweet){
    var tally = processor.process(filters.MAP, tweet.text);
    database.persist(tweet, tally);
    server.broadcast(tally);
});

server.start();

setInterval(function(){
    database.Tweet.getScores(function(result){
        server.broadcast(result)
    })
}, 500)