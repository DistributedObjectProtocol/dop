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
var server = dopServer.listen({timeout:2});
var nodeClient = dopClient.connect();
dopServer.env = 'SERVER'
dopClient.env = 'CLIENT'
var nodeServer, socketServer, socketClient;
var tokenServer, tokenClient;
var order = 0;




var msg=0;
function send() {
    nodeClient.send(String(msg));
    if (nodeServer)
        nodeServer.send(String(msg));
    if (msg++ < 25)
        setTimeout(send, 100);
}
send();





test('CONNECT TEST', function(t) {

    server.on('connect', function(node){
        nodeServer = node;
    });
    server.on('message', function(node, message){
        // console.log( '❌ message `'+message+'`', node.token );
    });

    nodeClient.on('message', function(message){
        console.log( '✅ message `'+message+'`' );
    });
});






setTimeout(function(){
    console.log( 'closing...' );
    nodeClient.socket.close();
    setTimeout(function(){
        console.log( 'reconnecting...' );
        nodeClient.reconnect();
    },500);
}, 1000)