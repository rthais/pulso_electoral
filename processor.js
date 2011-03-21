exports.process = function(map, tweet){
    var tally = [];
    for (key in map){
        var len = map[key].length
        for(var i=0; i < len; i++){
            if (tweet.toLowerCase().indexOf(map[key][i]) != -1){
                tally.push(key);
                break;
            }   
        }
    }
    return tally
}