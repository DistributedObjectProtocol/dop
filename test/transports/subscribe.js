var test = require('tape');
var dopServer = require('../../dist/nodejs').create();
var dopClient = require('../../dist/nodejs').create();


var transportName = process.argv[2] || 'local';
var transportListen = require('dop-transports').listen[transportName];
var transportConnect = require('dop-transports').connect[transportName];

var server = dopServer.listen({transport:transportListen, timeout:1});
var client = dopClient.connect({transport:transportConnect, listener:server});



// test('Subscribe', function(t) {

    server.on('connect', function(node){
        // node.subscribe('OBJCLIENT');
    })
    dopServer.onsubscribe(function(cuar){
        console.log( cuar );
        return {paco:'pil'};
    })

    myobj = dopClient.register({mola:'mazo'})
    client.subscribe('PUBLIC').into(myobj).then(function(obj){
        console.log( obj===myobj );
    })


// });

