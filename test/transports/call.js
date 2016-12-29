var test = require('tape');
var dopServer = require('../../dist/nodejs').create();
var dopClient = require('../../dist/nodejs').create();
dopServer.env = 'SERVER';
dopClient.env = 'CLIENT';
dopServer.data.object_inc = 7;


var transportName = process.argv[2] || 'local';
var transportListen = require('dop-transports').listen[transportName];
var transportConnect = require('dop-transports').connect[transportName];

var server = dopServer.listen({transport:transportListen})
var client = dopClient.connect({transport:transportConnect, listener:server})
server.on('connect', function(node) {
    if (typeof serverClient == 'undefined')
        serverClient = node;
})



test('', function(t) {
    var objectServer = {
        deep: {
            login: function() {
                console.log( 'arguments', arguments );
            }
        }
    };
    
    dopServer.onsubscribe(function() {
        return objectServer;
    })

    client.subscribe().then(function(obj) {
        obj.deep.login('hola', 'mundo');
        console.log( obj.deep.login.name );
        t.end();
    })

})

