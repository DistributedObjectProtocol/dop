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
var server = dopServer.listen({timeout:2});
var nodeClient = dopClient.connect();
dopServer.env = 'SERVER'
dopClient.env = 'CLIENT'
var nodeServer, socketServer, socketClient;
var tokenServer, tokenClient;
var order = 0;

test('RECONNECT TEST', function(t) {

    server.on('open', function(socket) {
        if (socketServer === undefined) {
            socketServer = socket;
        }
        t.equal(dopServer.getNodeBySocket(socket).socket, socket, '❌ open');
    });
    server.on('connect', function(node) {
        nodeServer = node;
        tokenServer = node.token;
        t.equal(node.socket, socketServer, '❌ connect');
    });
    server.on('close', function(socket){
        t.equal(socket, socketServer, '❌ close');
    });
    server.on('reconnect', function(node, oldSocket){
        t.equal(node===nodeServer && oldSocket===socketServer, true, '❌ reconnect');
    });



    nodeClient.on('open', function(socket) {
        socketClient = socket;
        t.equal(dopClient.getNodeBySocket(socket).socket, socket, '✅ open');
    });
    nodeClient.on('connect', function() {
        tokenClient = nodeClient.token;
        t.equal(nodeClient.socket, socketClient, '✅ connect');
    });
    nodeClient.on('close', function(socket){
        setTimeout(function(){
            console.log( 'reconnecting...' );
            nodeClient.reconnect();
            t.equal(socket, socketClient, '✅ close');
        },500);
    });
    nodeClient.on('reconnect', function(oldSocket) {
        t.equal(oldSocket, socketClient, '✅ reconnect');
        t.end();
    });
});



// Disconnecting
setTimeout(function(){
    console.log( 'closing...' );
    nodeClient.socket.close();
}, 1000)

