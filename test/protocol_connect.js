var test = require('tape');
var dop = require('../dist/nodejs').create();
var dopClient = require('../dist/nodejs').create();
var localtransportlisten = require('dop-transports').listen.local;
var localtransportconnect = require('dop-transports').connect.local;

// var server = dop.listen({transport:localtransportlisten});
// var client = dopClient.connect({transport:localtransportconnect, listener:server});
var server = dop.listen();
dop.env = 'SERVER'
var client = dopClient.connect();
dopClient.env = 'CLIENT'



var sock, nod, tok;

    server.on('open', function(socket){
        sock = socket;
        console.log( '❌ open' );
    });
    server.on('message', function(socket, message){
        console.log( '❌ message', message);
    });
    server.on('close', function(socket){
        console.log( '❌ close' );
        console.log( '' );
        console.log( '---------' );
    });
    server.on('connect', function(node, token){
        nod = node;
        tok = token;
        console.log( '❌ connect' );
    });
    server.on('disconnect', function(node){
        console.log( '❌ disconnect', node.readyState );
    });


    client.on('open', function(socket){
        sock = socket;
        console.log( '✅ open' );
    });
    client.on('message', function(socket, message){
        console.log( '✅ message', message );
    });
    client.on('close', function(socket){
        console.log( '✅ close' );
        setTimeout(function(){
        client.reconnect();
        }, 2000)
    });
    client.on('connect', function(node, token){
        nod = node;
        console.log( '✅ connect' );
    });
    // client.on('disconnect', function(node){
    //     console.log( 'disconnect', node.readyState );
    // });


setTimeout(function(){
    client.close();
    // client.send('---antes')
}, 1000)

