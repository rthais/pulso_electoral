var express     = require('express'),
    server      = express.createServer(),
    io          = require('socket.io'),
    filters     = require('./filters.js');

server.set('view engine', 'jade');

server.use(express.static(__dirname + '/../public'));

server.get('/', function(req, res){
    res.render('index', { keys: filters.NAMES });
});

server.get('/info', function(req, res){
    res.render('info', { layout: false })
});

var socket = io.listen(server); 

exports.start = function(){
    server.listen(3000);
}

exports.broadcast = function(data){
    socket.broadcast(data)
}