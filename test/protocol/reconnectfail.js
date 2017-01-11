var test = require('tape');
var dop = require('../../dist/nodejs');
var dopServer = dop.create();
var dopClient = dop.create();

var transportName = process.argv[2] || 'local';
var transportListen = require('dop-transports').listen[transportName];
var transportConnect = require('dop-transports').connect[transportName];

test('RECONNECTFAIL TEST', function(t) {


    var server = dopServer.listen({transport:transportListen, timeout:1});
    var nodeClient = dopClient.connect({transport:transportConnect, listener:server});
    dopServer.env = 'SERVER'
    dopClient.env = 'CLIENT'
    var nodeServer, socketServer, socketClient;
    var tokenServer, tokenClient;
    var order = 0;
    var connected2 = false;


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
        else {
            connected2 = true;
            t.notEqual(node.socket, socketServer, '❌ connect 2');
            t.end();
            try {
                server.listener.close();
                nodeClient.socket.close();
            } catch(e) {
                // process.exit();
            }
        }
    });
    server.on('disconnect', function(node){
        if (connected2 === false)
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
        }
    });
    nodeClient.on('disconnect', function() {
        t.equal(nodeClient.socket, socketClient, '✅ disconnect');
    });
    nodeClient.on('reconnect', function(oldSocket) {
        t.equal(true, false, '✅ reconnect'); // this should not happen
    });


    // Disconnecting
    setTimeout(function(){
        // console.log( 'closing...' );
        nodeClient.socket.close();
    }, 500)
    // Reconnecting
    setTimeout(function(){
        // console.log( 'late reconnecting...' );
        nodeClient.reconnect();
    }, 3000);


});
