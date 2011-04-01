var express     = require('express'),
    server      = express.createServer(),
    io          = require('socket.io'),
    filters     = require('./filters.js');

server.set('view engine', 'jade');
server.set('views', __dirname + '/../views')

server.use(express.static(__dirname + '/../public'));

server.get('/', function(req, res){
    res.render('index', { keys: filters.NAMES });
});

server.get('/info', function(req, res){
    res.render('info', { layout: false })
});

server.get('/tecnica', function(req, res){
    res.render('tecnica', { layout: false })
});

var socket = io.listen(server); 

exports.start = function(callback){
    server.listen(3000);
    callback()
}

exports.broadcast = function(data){
    socket.broadcast(data)
}

exports.socket = socket