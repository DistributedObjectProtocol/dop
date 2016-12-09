var test = require('tape');
var dop = require('../dist/nodejs');
var dopServer = dop.create();
var dopClient = dop.create();
var uwstransportlisten = require('dop-transports').listen.uws;
var localtransportlisten = require('dop-transports').listen.local;
var localtransportconnect = require('dop-transports').connect.local;
var socketiotransportlisten = require('dop-transports').listen.socketio;
var socketiotransportconnect = require('dop-transports').connect.socketio;

// var server = dop.listen({transport:localtransportlisten});
// var client = dopClient.connect({transport:localtransportconnect, listener:server});
// server = dop.listen({transport:socketiotransportlisten});
// client = dopClient.connect({transport:socketiotransportconnect});
var server = dopServer.listen({timeout:1.5});
var nodeClient = dopClient.connect();
dopServer.env = 'SERVER'
dopClient.env = 'CLIENT'
var nodeServer, socketServer, socketClient;
var tokenServer, tokenClient;
var order = 0;

test('RECONNECT TEST', function(t) {

    server.on('open', function(socket) {
        if (socketServer === undefined)
            socketServer = socket;
        // t.equal(dopServer.getNodeBySocket(socket).socket, socket, '❌ open');
    });
    server.on('connect', function(node) {
        nodeServer = node;
        tokenServer = node.token;
        t.equal(node.socket, socketServer, '❌ connect');
    });
    server.on('reconnect', function(node, oldSocket){
        t.equal(node===nodeServer && oldSocket===socketServer, true, '❌ reconnect');
    });


    nodeClient.on('open', function(socket) {
        socketClient = socket;
    });
    nodeClient.on('connect', function() {
        tokenClient = nodeClient.token;
        t.equal(nodeClient.socket, socketClient, '✅ connect');
    });
    nodeClient.on('reconnect', function(oldSocket) {
        t.equal(oldSocket, socketClient, '✅ reconnect');
        server.listener.close();
        t.end();
    });
});



// Disconnecting
setTimeout(function(){
    console.log( 'closing...' );
    nodeClient.socket.close();
}, 500)
// Reconnecting
setTimeout(function(){
    console.log( 'reconnecting...' );
    nodeClient.reconnect();
}, 1000);
