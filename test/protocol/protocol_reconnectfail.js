var test = require('tape');
var dop = require('../../dist/nodejs');
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
var server = dopServer.listen({timeout:1});
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
        if (nodeServer === undefined) {
            nodeServer = node;
            tokenServer = node.token;
            t.equal(node.socket, socketServer, '❌ connect 1');
        }
        else
            t.notEqual(node.socket, socketServer, '❌ connect 2');
    });
    server.on('disconnect', function(node){
        t.equal(node, nodeServer, '❌ disconnect');
    });
    server.on('reconnect', function(node, oldSocket){
        t.equal(false, true, '❌ reconnect'); // this should not happen
    });




    nodeClient.on('open', function(socket) {
        if (socketClient === undefined)
            socketClient = socket;
    });
    nodeClient.on('connect', function() {
        if (tokenClient === undefined) {
            tokenClient = nodeClient.token;
            t.equal(nodeClient.socket, socketClient, '✅ connect 1');
        }
        else {
            t.notEqual(nodeClient.socket, socketClient, '✅ connect 2');
            t.end();
            // server.listener.close();
        }
    });
    nodeClient.on('disconnect', function() {
        t.equal(nodeClient.socket, socketClient, '✅ disconnect');
    });
    nodeClient.on('reconnect', function(oldSocket) {
        t.equal(true, false, '✅ reconnect'); // this should not happen
    });

});



// Disconnecting
setTimeout(function(){
    console.log( 'closing...' );
    nodeClient.socket.close();
}, 500)
// Reconnecting
setTimeout(function(){
    console.log( 'late reconnecting...' );
    nodeClient.reconnect();
}, 3000);
