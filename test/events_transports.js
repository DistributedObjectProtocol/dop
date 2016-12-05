var test = require('tape');
var dop = require('../dist/nodejs').create();
var dopClient = require('../dist/nodejs').create();
var localtransportlisten = require('dop-transports').listen.local;
var localtransportconnect = require('dop-transports').connect.local;

// Browsers
// var server = dop.listen({transport:localtransportlisten});
// var client = dopClient.connect({transport:localtransportconnect, listener:server});
// node.js (WebSockets)
var server = dop.listen();
var client = dopClient.connect();


test('Events', function(t) {
    var sock, msg;
    var sock2, msg2;
    var order = 1;

    server.on('open', function(socket){
        sock = socket;
        t.equal(order++, 1, 'server/open');
    });

    server.listener.on('connection', function(socket){
        sock.on('message', onmessageserver);
        sock.on('close', oncloseserver);
        t.equal(order++, 2, 'server/connection');
        t.equal(sock, socket, 'server/connection sock');
    });

    client.on('open', function(socket){
        sock2 = socket;
        t.equal(order++, 3, 'client/open');
    });

    client.socket.on('open', function(){
        sock2.on('message', onmessageclient);
        sock2.on('close', oncloseclient);
        t.equal(order++, 4, 'clientsocket/open');
        t.equal(sock2, this, 'clientsocket/open sock');
    });


    client.on('message', function(socket, message){
        msg2 = message;
        t.equal(order++, 5, 'client/message');
        t.equal(sock2, socket, 'client/message sock');
    });
    function onmessageclient(message){
        t.equal(order++, 6, 'clientsocket/message');
        t.equal(msg2, message, 'clientsocket/message msg');
    };

    server.on('message', function(socket, message){
        msg = message;
        t.equal(order++, 7, 'server/message');
        t.equal(sock, socket, 'server/message sock');
    });
    function onmessageserver(message){
        t.equal(order++, 8, 'serverlistener/message');
        t.equal(msg, message, 'serverlistener/message msg');
        (Math.round(Math.random()*100)%2) ? sock.close() : sock2.close();
    };


    client.on('close', function(){
        t.equal(order++, 9, 'client/close');
    });
    function oncloseclient(){
        t.equal(order++, 10, 'clientsocket/close');
    };



    server.on('close', function(socket){
        t.equal(order++, 11, 'server/close');
        t.equal(sock, socket, 'server/close sock');
    });
    function oncloseserver(){
        t.equal(order++, 12, 'serverlistener/close');
        t.end();
        try {server.listener.close()} catch(e) {}
    };
















});



