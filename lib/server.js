var express     = require('express')
var server      = express.createServer();
var io          = require('socket.io'); 
var filters     = require('./filters.js');

server.set('view engine', 'jade');

server.use(express.static(__dirname + '/../public'));

server.get('/', function(req, res){
    res.render('index', { keys: filters.NAMES });
});

var socket = io.listen(server); 

exports.start = function(){
    server.listen(3000);
}

exports.broadcast = function(data){
    socket.broadcast(data)
}