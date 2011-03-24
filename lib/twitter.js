var config      = require('./../config').Config,
    TwitterNode = require('twitter-node').TwitterNode,
    fs = require('fs');

// Synchronous, since we only do it once
var password = fs.readFileSync('password')

var client = new TwitterNode({
    user: 'pulso_electoral',
    password: password
});

client.headers['User-Agent'] = 'twitter-node';

client.addListener('error', function(error) {
    console.warn("Unexpected error")
    console.warn(error)
    setTimeout(function() {
        client.stream();
    },
    3000)
});

client.addListener('end', function(resp) {
    console.warn("Connection closed: " + resp.statusCode)
    setTimeout(function() {
        client.stream();
    }, 30000)
})

var stream = function(keywords, callback){
  keywords.forEach(function(keyword){
      client.track(keyword)
  })
  client.addListener('tweet', callback);
  client.stream();
}

var mock = function(keywords, callback) {
  var randomKeyword = function(){
    return keywords[Math.ceil(Math.random() * keywords.length) - 1];
  }
  //choose a random keyword to weigh more favorably  
  var favoredKeyword = randomKeyword();
  setInterval(function(){
    var keyword;
    // the tweet consists of just the keyword
    if (Math.random() <= config.mock.weight){
      keyword = favoredKeyword;
    } else {
      keyword = randomKeyword();
    }
    callback({ text: keyword, isMock  : true, created_at: new Date() });
  }, config.mock.interval)
}

exports.start = function(keywords, callback) {
  handler = config.mock.enabled ? mock : stream;
  handler(keywords, callback)
}