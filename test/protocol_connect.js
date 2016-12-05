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
// dopClient.env = 'CLIENT'




    server.on('open', function(socket){
        sock = socket;
        console.log( '❌ open' );
    });
    server.on('message', function(socket, message){
        console.log( '❌ message', message, dop.getNodeBySocket(socket).readyState);
    });
    server.on('close', function(socket){
        console.log( '❌ close' );
        console.log( '' );
        console.log( '---------' );
        console.log( '' );
    });
    server.on('connect', function(node, token){
        nod = node;
        tok = token;
        console.log( '❌ connect', token );
    });
    server.on('disconnect', function(node){
        console.log( '❌ disconnect', node.readyState );
    });
    server.on('reconnect', function(node, oldSocket, newSocket){
        console.log( '❌ reconnect', node.readyState, node.token, oldSocket["~TOKEN_DOP"], newSocket["~TOKEN_DOP"] );
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
        // nod.send('mierda desde server')
        // client.send('mierda desde client')
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
    client.disconnect();
    // client.send('---antes')
}, 1000)

