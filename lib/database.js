var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/elec")

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TweetSchema = new Schema({
    key:  String,
    timestamp: Date
})

mongoose.model('Tweet', TweetSchema)

var Tweet = mongoose.model("Tweet")

exports.persist = function(tweet, tally){
    tally.forEach(function(key){
        var tweetModel = new Tweet({
            key: key,
            timestamp: Date.parse(tweet.created_at)
        })
        tweetModel.save()
    })    
}

exports.Tweet = Tweet