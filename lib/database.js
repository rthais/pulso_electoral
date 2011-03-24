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

mongoose.model('Score', ScoreSchema);

var Score = mongoose.model("Score");

TweetSchema.static({
    getScores: function(external_callback){
        var command = {
            mapreduce: 'tweets',
            map: calculation.map.toString(),
            reduce: calculation.reduce.toString(),
            out: 'scores'
        }
        
        var callback = function(error, result){            
            if (error != null) console.log("Error calculating scores");            
            Score.find({}, function(error, results){                 
                var result_hash = {}
                results.forEach(function(result){
                    result_hash[result.doc._id] = result.doc.value
                })                                
                external_callback(result_hash)
            })
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

exports.destroy_mocks = function(){
  Tweet.remove({ isMock: true }, function(error, tweet){
    if (!error){
      console.log("Mock tweets removed")
    }
  })
}

exports.Tweet = Tweet;