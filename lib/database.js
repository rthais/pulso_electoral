var calculation = require('calculation'),
    mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/elec")

var Schema = mongoose.Schema;

var TweetSchema = new Schema({
    key:       String,
    isMock:    { type: Boolean, default: false },
    timestamp: Date
})

var ScoreSchema = new Schema({
    _id:   String,
})


ScoreSchema.static({
    get: function(callback){
        Score.find({}, function(error, results){  
            if (error){
                console.log("Error getting results")
                console.log(error)
                return
            }                             
            Score._lastResult = Score.format(results)
            callback(Score._lastResult)
        })        
    },
    format: function(results){
        var hash = {}
        results.forEach(function(result){
            hash[result.doc._id] = result.doc.value
        })
        return hash
    },
    lastResult: function(callback){
        if (Score._lastResult){
            callback(Score._lastResult)
        }
    }
})

mongoose.model('Score', ScoreSchema);

var Score = mongoose.model("Score");

TweetSchema.static({
    getScores: function(external_callback){
        // Only query tweets that are at most 24 hours old
        // With a 6 hour half-life their value would be at most 0.06
        var command = {
            mapreduce: 'tweets',
            query: {timestamp: {$gt: new Date((new Date()).getTime() - 86400000)}},
            map: calculation.map.toString(),
            reduce: calculation.reduce.toString(),
            out: 'scores'
        }
        
        var callback = function(){            
            Score.get(external_callback)
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
            isMock: tweet.isMock,
            timestamp: Date.parse(tweet.created_at)
        })
        tweetModel.save();
    })    
}

exports.destroy_mocks = function(callback){
  Tweet.remove({ isMock: true }, callback)
}

exports.Tweet = Tweet;
exports.Score = Score;