// Emits the score for an individual tweet
// The score is calculated using an exponential decay function

// N(t) = N(0)e^(-t/tau)

exports.map = function(){
    var TAU = 80000,
        N0  = 1
    
    var t = Math.round((new Date().getTime() - this.timestamp.getTime()) / 500),
        n = N0 * Math.pow(Math.E, -(t/TAU))
        
    emit(this.key, n)
}

exports.reduce = function(key, values){
    var sum = 0;
    values.forEach(function(obj) {
      sum += obj;
    });
    return sum;    
}