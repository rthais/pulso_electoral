var config  = require('./../config').Config.discriminator,
    net     = require('net'),
    filters = require('filters');
        
var discriminator = net.createConnection(config.port, config.host);

discriminator.setKeepAlive(true)

var discriminate = function(text, accept_language, callback){
    discriminator.write(text);
    discriminate.language = accept_language;
    discriminate.callback = callback;
    discriminate.text     = text;
}

var discriminateCallback = function(actual_language){
    if (typeof actual_language == 'object'){
        actual_language = actual_language.toString('utf8')
    }
    if (actual_language == discriminate.language){
        discriminate.callback()
    } else {
        console.log("Tweet discarded: " + discriminate.text)
        console.log("Language was: "+ actual_language)
    }
}

discriminator.addListener('data', discriminateCallback)

exports.process = function(tweet, callback){
    var tally = [];
    var keywords = [];
    
    for (key in filters.MAP){
        var len = filters.MAP[key].length
        for(var i=0; i < len; i++){
            var keyword = filters.MAP[key][i]
            if (tweet.toLowerCase().indexOf(keyword) != -1){
                keywords.push(keyword);
                tally.push(key);
                break;
            }   
        }
    }
    
    //only discriminate if all keywords are ambiguous
    var doDiscriminate = true;
    for (i = 0, l = keywords.length; i < l; i ++){
        var keyword = keywords[i]
        if (!filters.DISCRIMINATE[keyword]){
            doDiscriminate = false;
            break;
        }
    }
    
    if (doDiscriminate){
        //discriminate for first keyword
        discriminate(tweet, filters.DISCRIMINATE[keywords[0]], function(){
            callback(tally);
        })
    } else {
        callback(tally);   
    }
}