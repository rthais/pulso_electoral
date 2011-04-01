var database = require('database')

// Emits the score for an individual tweet
// The score is calculated using the exponential decay function

// N(t) = N(0)e^(-t/tau)

exports.map = function(){
    // The following values of N0 and TAU give a half-life of
    // about 21 600 seconds or about 6 hours
    // thalf = TAU * ln 2
    
    // The maximum resolution of data is 0.1 seconds
    
    var TAU = 31162,
        N0  = 1,
        RESOLUTION = 100;
    
    var t = Math.round((new Date().getTime() - this.timestamp.getTime()) / RESOLUTION),
        n = N0 * Math.pow(Math.E, -(t/TAU))
        
    emit(this.key, { score: n, count: 1 })
}

exports.reduce = function(key, values){
    var score = 0,
        count = 0;
        
    values.forEach(function(obj) {
      score += obj.score;
      count += obj.count;
    });
    
    return { score: score, count: count };    
}

var calculate = function(callback){
    database.Tweet.getScores(function(results){
        callback(results)
    })
}

exports.start = function(callback, interval){
    var recursive_callback = function(results){
        callback(results)
        setTimeout(function(){
            calculate(recursive_callback)
        }, interval)
    }    
    calculate(recursive_callback)
}

exports.last = function(callback){
    database.Score.get(function(results){
        callback(results)
    })
}