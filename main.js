require.paths.unshift(__dirname + '/lib')

var twitter   = require('twitter');
var filters   = require('filters');
var processor = require('processor')
var database  = require('database')
var server    = require('server')

// Call only once
twitter.start(filters.KEYWORDS, function(tweet){
    var tally = processor.process(filters.MAP, tweet.text)
    database.persist(tweet, tally)
    server.broadcast(tally)
});

server.start()