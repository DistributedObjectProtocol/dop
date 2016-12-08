var test = require('tape');
var dop = require('../dist/nodejs');
var dopServer = dop.create();
var dopClient = dop.create();
var uwstransportlisten = require('dop-transports').listen.ws;
var localtransportlisten = require('dop-transports').listen.local;
var localtransportconnect = require('dop-transports').connect.local;
var socketiotransportlisten = require('dop-transports').listen.socketio;
var socketiotransportconnect = require('dop-transports').connect.socketio;

// var server = dop.listen({transport:localtransportlisten});
// var client = dopClient.connect({transport:localtransportconnect, listener:server});
// server = dop.listen({transport:socketiotransportlisten});
// client = dopClient.connect({transport:socketiotransportconnect});
var server = dopServer.listen({transport:uwstransportlisten, timeout:2});
var nodeClient = dopClient.connect();
dopServer.env = 'SERVER'
dopClient.env = 'CLIENT'
var nodeServer, socketServer, socketClient;
var tokenServer, tokenClient;
var order = 0;

test('CONNECT TEST', function(t) {

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
    server.on('message', function(node, message){
        console.log( '❌ message `'+message+'`' );
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
        },500);
        t.equal(socket, socketClient, '✅ close');
    });
    nodeClient.on('reconnect', function(oldSocket) {
        t.equal(oldSocket, socketClient, '✅ reconnect');
    });
    // nodeClient.on('message', function(message){
    //     console.log( '✅ message `'+message+'`' );
    // });
});


// Sending messages before is connected
// nodeClient.send('Before');
// Disconnecting
setTimeout(function(){
    console.log( 'closing...' );
    nodeClient.socket.close();
}, 1000)

function sends() {
    var msg=1;
    var interval = setInterval(function(){
        // nodeServer.send(msg);
        nodeClient.send(msg);
        msg+=1;
        if (msg>25)
            clearInterval(interval);
    },100);
}
sends();
nodeClient.send('0');
