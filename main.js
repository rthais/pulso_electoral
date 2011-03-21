var twitter   = require('./twitter.js');
var filters   = require('./filters.js');
var processor = require('./processor.js')
var database  = require('./database.js')
var server    = require('./server.js')

// Call only once
twitter.start(filters.KEYWORDS, function(tweet){
    var tally = processor.process(filters.MAP, tweet.text)
    database.persist(tweet, tally)
    server.broadcast(tally)
});

server.start()