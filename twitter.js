var TwitterNode = require('twitter-node').TwitterNode
var fs = require('fs');

// Synchronous, since we only do it once
var password = fs.readFileSync('password')

var client = new TwitterNode({
    user: 'pulso_electoral',
    password: password
});

client.headers['User-Agent'] = 'twitter-node';

client.addListener('error', function(error) {
    console.log("Unexpected error")
    console.log(error)
    setTimeout(function() {
        client.stream();
    },
    3000)
});

client.addListener('end', function(resp) {
    console.log("Connection closed: " + resp.statusCode)
    setTimeout(function() {
        client.stream();
    }, 30000)
})

exports.start = function(keywords, callback) {
    keywords.forEach(function(keyword){
        client.track(keyword)
    })
    client.addListener('tweet', callback);
    client.stream();
}