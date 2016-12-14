var test = require('tape');
var dop = require('../../dist/nodejs').create();
var dopClient = require('../../dist/nodejs').create();


var transportName = process.argv[2] || 'local';
var transportListen = require('dop-transports').listen[transportName];
var transportConnect = require('dop-transports').connect[transportName];

var server = dop.listen({transport:transportListen, timeout:1});
var client = dopClient.connect({transport:transportConnect});


var tend;
test('Events', function(t) {
    var sock, msg;
    var sock2, msg2;
    var order = 1;
    tend = t.end.bind(this);

    server.on('open', function(socket){
        sock = socket;
        t.equal(order++, 1, 'server/open');
    });
    client.on('open', function(socket){
        sock2 = socket;
        t.equal(order++, 2, 'client/open');
    });


    client.on('message', function(message){
        t.equal(order++, 3, 'client/message');
        t.equal(sock2, client.socket, 'client/message sock');
    });
    server.on('message', function(node, message) {
        t.equal(order++, 4, 'server/message');
        t.equal(sock, node.socket, 'server/message sock');
    });



    client.on('close', function(){
        t.equal(order++, 5, 'client/close');
    });
    server.on('close', function(socket){
        t.equal(order++, 6, 'server/close');
        t.equal(sock, socket, 'server/close sock');
        t.end();
        try {
            server.listener.close();
        } catch(e) {
            process.exit();
        }
    });


});


setTimeout(function(){
    client.socket.close();
},1000);