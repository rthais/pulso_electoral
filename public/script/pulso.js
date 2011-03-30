jQuery.extend(jQuery.easing, {
    jump: function(x, t, b, c, d) {
        return (t == d) ? b + c: c * ( - Math.pow(2, -10 * t / d) + 1) + b;
    }
})

$(document).ready(function() {
    
    var field = $("#field"),
        tweets = $("#tweets"),
        labels = $("#labels");
        
    var fieldHeight = field.height(),
        fieldWidth = field.width(),
        fieldScales = [ 2/5, 1/2, 3/4, 1 ]
        fieldThreshold = 0.9
        fieldScalesLength = fieldScales.length
        barContainerHeight = fieldHeight / Pulso.keys.length;
        
    var reconnectInterval = null
        
    var bars = {},
        keys_length = Pulso.keys.length;    

    for (i = 0; i < keys_length; i++) {
        var bar = bars[Pulso.keys[i]] = $("<div/>")
            .addClass("bar")
            .append($("<div/>").addClass('needle'));

        $("<div/>")
            .addClass('bar_container')
            .height(barContainerHeight)
            .appendTo(field)
            .append(bar);
        
        $("<div/>")
            .css({
                "background-image": "url(/images/"+Pulso.keys[i]+".png)",
                "background-repeat": "no-repeat"})
            .addClass("avatar")
            .appendTo(labels)
            .height(barContainerHeight)
    }

    $(".bar_container:not(:first-child) > .bar, .avatar:not(:first-child)").css({
        'margin-top': ((barContainerHeight * 0.3) / 3) + "px"
    });

    var needleWidth = $(".needle").width(),
        tweetQueue = [];

    var handleTweet = function(data) {
        var tally_length = data.tally.length;

        for (i = 0; i < tally_length; i++) {
            var bar = bars[data.tally[0]],
                needle = bar.find(".needle");
                
            needle.stop();
            
            var jumpSize = Math.min(100, bar.width() - (needle.position().left + needleWidth));
            
            needle.animate({left: "+=" + jumpSize + "px"}, 400, 'jump', function() {
                needle.animate({left: "0px"}, 8000);
            })
        }

        var tweet = $("<div/>")
            .addClass("tweet")
            .append($("<a/>").text(data.user).attr("href", "http://twitter.com/"+data.user).attr("target", "_blank"))
            .append($("<span/>").text(": " + data.tweet))

        tweets.prepend(tweet);
        tweet.animate({opacity: 'toggle', height: 'toggle'}, 'slow');

        tweetQueue.unshift(tweet);

        if (tweetQueue.length > 20) tweetQueue.pop().remove()
    }

    var handleStats = function(data) {
        var scoreTotal = 0,
            normalizedScores = {},   
            maxNormalizedScore = 0,     
            scaleMultiplier       
            
        for (key in data)  scoreTotal += data[key].score;
        
        for (key in data) {
            normalizedScores[key] = (data[key].score / scoreTotal) * fieldWidth
            if (normalizedScores[key] >= maxNormalizedScore) {
                maxNormalizedScore = normalizedScores[key]
            }
        }   
        
        for (i = 0; i < fieldScalesLength; i++){
            scaleMultiplier = 1 / fieldScales[i]
            if (!(maxNormalizedScore > (fieldScales[i] * fieldWidth * fieldThreshold))) break;
        }
                
        for (key in normalizedScores) {
            bars[key].animate({width: (normalizedScores[key] * scaleMultiplier) + "px"}) 
        }
    }
    
    var socketConnect = function(){
      var socket = new io.Socket();
      socket.connect();
      
      socket.on('connect', function(){
          if (reconnectInterval) clearInterval(reconnectInterval);
      })

      socket.on('message', function(data) {
          if (data.tweet) {
              handleTweet(data)
          } else {
              handleStats(data)
          }
      })

      //not needed after socket.io v 0.7
      socket.on('disconnect', function(){
          reconnectInterval = setInterval(function(){
              socketConnect()
          }, 5000)
      })      
    }
    
    socketConnect();
})