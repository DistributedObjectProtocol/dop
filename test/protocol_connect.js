var test = require('tape');
var dop = require('../dist/nodejs').create();
var dopClient = require('../dist/nodejs').create();
var localtransportlisten = require('dop-transports').listen.local;
var localtransportconnect = require('dop-transports').connect.local;
var localtransportlistensocketio = require('dop-transports').listen.socketio;
var localtransportconnectsocketio = require('dop-transports').connect.socketio;

// var server = dop.listen({transport:localtransportlisten});
// var client = dopClient.connect({transport:localtransportconnect, listener:server});
// server = dop.listen({transport:localtransportlistensocketio});
// client = dopClient.connect({transport:localtransportconnectsocketio});
var server = dop.listen();
var client = dopClient.connect();


dop.env = 'SERVER'
dopClient.env = 'CLIENT'




    server.on('open', function(nod){
        socket = nod.socket;
        node = nod;
        token = node.token;
        console.log( '❌ open' );
    });
    server.on('message', function(node, message){
        console.log( '❌ message', '`'+message+'`');
    });
    server.on('close', function(node){
        console.log( '❌ close'/*, nod.readyState*/ );
        console.log( '' );
        console.log( '---------' );
        console.log( '' );
    });
    server.on('connect', function(node){
        console.log( '❌ connect' );
    });
    server.on('disconnect', function(node){
        console.log( '❌ disconnect', node.readyState );
    });
    server.on('reconnect', function(node, oldSocket){
        console.log( '❌ reconnect', node.readyState, node.token, oldSocket["~TOKEN_DOP"], node.token["~TOKEN_DOP"] );
    });

    client.on('open', function(){
        sock = client.socket;
        console.log( '✅ open' );
    });
    client.on('message', function(message){
        console.log( '✅ message', client.readyState, '`'+message+'`' );
    });
    client.on('close', function(){
        console.log( '✅ close', client.readyState );
        // nod.send('mierda desde server')
        // client.send('mierda desde client')
        setTimeout(function(){
        // client.reconnect();
        }, 2000)
    });
    client.on('connect', function(token){
        console.log( '✅ connect' );
    });
    client.on('disconnect', function(){
        console.log( '✅ disconnect' );
    });


setTimeout(function(){
    client.disconnect();
    // client.send('---antes')
}, 2000)

