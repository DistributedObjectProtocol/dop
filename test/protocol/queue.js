var test = require('tape');
var dop = require('../../dist/nodejs').create()
var dopServer = require('../../dist/nodejs').create();
var dopClient = require('../../dist/nodejs').create();

var transportName = process.argv[2]|| 'local';
var transportListen = require('dop-transports').listen[transportName];
var transportConnect = require('dop-transports').connect[transportName];



test('QUEUE TEST', function(t) {

    var server = dopServer.listen({transport:transportListen, timeout:2});
    var nodeClient = dopClient.connect({transport:transportConnect, listener:server});
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
        if (msg++ < 15)
            setTimeout(send, 300);
    }
    send();


    var incS=0, incC=1;

    server.on('connect', function(node){
        nodeServer = node;
    });
    server.on('message', function(node, message){
        if (message[0] !== '[') {
            t.equal(message, String(incS++), '❌ message `'+message+'`');
            if (incS===16 && incC===16) {
                server.listener.close();
                t.end();
            }
        }
    });

    nodeClient.on('message', function(message){
        if (message[0] !== '[') {
            t.equal(message, String(incC++), '✅ message `'+message+'`');
            if (incS===16 && incC===16) {
                t.end();
                try {
                    server.listener.close();
                    nodeClient.socket.close();
                } catch(e) {
                    // process.exit();
                }
            }
        }
    });






    setTimeout(function(){
        // console.log( 'closing...' );
        nodeClient.socket.close();
        setTimeout(function(){
            // console.log( 'reconnecting...' );
            nodeClient.reconnect();
        },500);
    }, 1000);

    setTimeout(function(){
        // console.log( 'closing2...' );
        nodeClient.socket.close();
        setTimeout(function(){
            // console.log( 'reconnecting2...' );
            nodeClient.reconnect();
        },500);
    }, 2000);


});
