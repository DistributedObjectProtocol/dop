var test = require('tape');
var dop = require('../../dist/nodejs');
var dopServer = dop.create();
var dopClient = dop.create();

var transportName = process.argv[2]|| 'local';
var transportListen = require('dop-transports').listen[transportName];
var transportConnect = require('dop-transports').connect[transportName];



test('RECONNECT TEST', function(t) {

    var server = dopServer.listen({transport:transportListen, timeout:1.5});
    var nodeClient = dopClient.connect({transport:transportConnect, listener:server});
    dopServer.env = 'SERVER'
    dopClient.env = 'CLIENT'
    var nodeServer, socketServer, socketClient;
    var tokenServer, tokenClient;
    var order = 0;


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
        if (socketClient===undefined)
            socketClient = socket;
    });
    nodeClient.on('connect', function() {
        tokenClient = nodeClient.token;
        t.equal(nodeClient.socket, socketClient, '✅ connect');
    });
    nodeClient.on('reconnect', function(oldSocket) {
        t.equal(oldSocket, socketClient, '✅ reconnect');
        t.end();
        try {
            server.listener.close();
            nodeClient.socket.close();
        } catch(e) {
            // process.exit();
        }
    });

    // Disconnecting
    setTimeout(function(){
        // console.log( 'closing...' );
        nodeClient.socket.close();
    }, 500)
    // Reconnecting
    setTimeout(function(){
        // console.log( 'reconnecting...' );
        nodeClient.reconnect();
    }, 1000);

});



