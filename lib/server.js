var server = require('express').createServer();
var io = require('socket.io'); 

server.set('view engine', 'jade');


server.get('/', function(req, res){
    res.render('index');
});

var socket = io.listen(server); 
socket.on('connection', function(client){ 
    client.send("connected!");  
})

exports.start = function(){
    server.listen(3000);
}

exports.broadcast = function(data){
    socket.broadcast(data)
}