var calculation = require('calculation')

var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/elec")

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TweetSchema = new Schema({
    key:  String,
    timestamp: Date
})

mongoose.model('Score', new Schema);

var Score = mongoose.model("Score");

TweetSchema.static({
    getScores: function(success_callback){
        var command = {
            mapreduce: 'tweets',
            map: calculation.map.toString(),
            reduce: calculation.reduce.toString(),
            out: 'scores'
        }
        
        var callback = function(error, result){
            if (error == null){
                Score.find({}, function(error, result){ 
                    success_callback(result)
                })
            } else {
                console.log("Error calculating scores")
            }
        }
        
        mongoose.connection.db.executeDbCommand(command, callback)
    }
})

mongoose.model('Tweet', TweetSchema);

var Tweet = mongoose.model("Tweet");

exports.persist = function(tweet, tally){
    tally.forEach(function(key){
        var tweetModel = new Tweet({
            key: key,
            timestamp: Date.parse(tweet.created_at)
        })
        tweetModel.save();
    })    
}

exports.Tweet = Tweet;