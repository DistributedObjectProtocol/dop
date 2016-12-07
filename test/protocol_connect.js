var test = require('tape');
var dop = require('../dist/nodejs');
var dopServer = dop.create();
var dopClient = dop.create();
var localtransportlisten = require('dop-transports').listen.local;
var localtransportconnect = require('dop-transports').connect.local;
var localtransportlistensocketio = require('dop-transports').listen.socketio;
var localtransportconnectsocketio = require('dop-transports').connect.socketio;

// var server = dop.listen({transport:localtransportlisten});
// var client = dopClient.connect({transport:localtransportconnect, listener:server});
// server = dop.listen({transport:localtransportlistensocketio});
// client = dopClient.connect({transport:localtransportconnectsocketio});
var timeoutDisconnect = 2, timeoutCheck; // seconds
var server = dopServer.listen({timeout:timeoutDisconnect});
var nodeClient = dopClient.connect();
dopServer.env = 'SERVER'
dopClient.env = 'CLIENT'
var nodeServer, socketServer, socketClient;
var tokenServer, tokenClient;
var order = 0;

test('CONNECT TEST', function(t) {

    server.on('open', function(socket) {
        socketServer = socket;
        t.equal(dopServer.getNodeBySocket(socket).socket, socket, '❌ open');
    });
    server.on('connect', function(node) {
        nodeServer = node;
        tokenServer = node.token;
        t.equal(node.socket, socketServer, '❌ connect');
    });
    server.on('message', function(node, message){
        t.equal(message, '[-1,0]', '❌ message `'+message+'`');
    });
    server.on('close', function(socket){
        timeoutCheck = new Date().getTime();
        t.equal(socket, socketServer, '❌ close');
    });
    server.on('disconnect', function(node){
        var timeoutCheckEnd = Math.round( (new Date().getTime()-timeoutCheck)/1000 );
        t.equal(timeoutCheckEnd, timeoutDisconnect, '❌ disconnect');
        t.end();
        try {server.listener.close()} catch(e) {}
    });




    nodeClient.on('open', function(socket) {
        socketClient = socket;
        t.equal(dopClient.getNodeBySocket(socket).socket, socket, '✅ open');
    });
    nodeClient.on('connect', function() {
        tokenClient = nodeClient.token;
        t.equal(nodeClient.socket, socketClient, '✅ connect');
    });
    nodeClient.on('message', function(message){
        t.equal(message.slice(0,5), '[1,0,', '✅ message `'+message+'`');
    });
    nodeClient.on('close', function(socket){
        t.equal(socket, socketClient, '✅ close');
    });


});

setTimeout(function(){
    nodeClient.disconnect();
}, 1000)