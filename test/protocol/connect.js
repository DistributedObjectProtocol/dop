var test = require('tape');
var dop = require('../../dist/nodejs');
var dopServer = dop.create();
var dopClient = dop.create();

var transportName = process.argv[2] || 'local';
var transportListen = require('dop-transports').listen[transportName];
var transportConnect = require('dop-transports').connect[transportName];



test('CONNECT TEST', function(t) {

    var timeoutDisconnect = 2, timeoutCheck; // seconds
    var server = dopServer.listen({transport:transportListen, timeout:timeoutDisconnect});
    var nodeClient = dopClient.connect({transport:transportConnect, listener:server});
    dopServer.env = 'SERVER'
    dopClient.env = 'CLIENT'
    var nodeServer, socketServer, socketClient;
    var tokenServer, tokenClient;
    var order = 0;

    server.on('open', function(socket) {
        socketServer = socket;
        t.equal(true, true, '❌ open');
    });
    server.on('connect', function(node) {
        nodeServer = node;
        tokenServer = node.token;
        t.equal(node.socket, socketServer, '❌ connect');
    });
    server.on('message', function(node, message){
        t.equal(message==='[-1,0]'||message==='Before', true, '❌ message `'+message+'`');
    });
    server.on('close', function(socket){
        timeoutCheck = new Date().getTime();
        t.equal(socket, socketServer, '❌ close');
    });
    server.on('disconnect', function(node){
        var timeoutCheckEnd = Math.round( (new Date().getTime()-timeoutCheck)/1000 );
        t.equal(timeoutCheckEnd, timeoutDisconnect, '❌ disconnect');
        t.end();
        try {
            // server.listener.close();
        } catch(e) {
            // process.exit();
        }
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
    nodeClient.on('disconnect', function() {
        // We dont emit this one in case the client wants to reconnect
        t.equal(1, 2, '✅ disconnect');
    });


// Sending messages before is connected
nodeClient.send('Before');
// Disconnecting
setTimeout(function(){
    // console.log( 'disconnecting...' );
    nodeClient.disconnect();
}, 1000);



});
