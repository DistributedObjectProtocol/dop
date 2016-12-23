var test = require('tape');
var dopServer = require('../../dist/nodejs').create();
var dopClient = require('../../dist/nodejs').create();
dopServer.env = 'SERVER';
dopClient.env = 'CLIENT';


var transportName = process.argv[2] || 'local';
var transportListen = require('dop-transports').listen[transportName];
var transportConnect = require('dop-transports').connect[transportName];

var server = dopServer.listen({transport:transportListen})
var client = dopClient.connect({transport:transportConnect, listener:server})
server.on('connect', function(node) {
    if (typeof serverClient == 'undefined')
        serverClient = node;
})



test('Client unsubscribe Server', function(t) {
    var objectServer = dopServer.register({test:Math.random()});
    t.equal(dopServer.data.object[1], undefined, 'Object data not stored on server yet');
    
    dopServer.onsubscribe(function() {
        return objectServer;
    })

    var objectClient = dopClient.register({});
    t.equal(dopClient.data.object[1], undefined, 'Object data not stored on client yet');
    client.subscribe().into(objectClient).then(function(obj){
        var objectDataServer = dopServer.data.object[1];
        var objectDataClient = dopClient.data.object[1];
        t.deepEqual(objectDataServer.node[serverClient.token].subscribed, true, 'Client subscribed');
        t.deepEqual(objectDataServer.node[serverClient.token].owner, false, 'Client is not owner');
        t.deepEqual(objectDataClient.node[client.token].subscribed, false, 'Server is not subscribed');
        t.deepEqual(objectDataClient.node[client.token].owner, true, 'Server is owner');


        client.unsubscribe(objectClient)
        .then(function(){
            t.deepEqual(objectDataServer.node[serverClient.token].subscribed, false, 'Client subscribed');
            t.deepEqual(objectDataServer.node[serverClient.token].owner, false, 'Client is not owner');
            t.deepEqual(objectDataClient.node[client.token].subscribed, false, 'Server is not subscribed');
            t.deepEqual(objectDataClient.node[client.token].owner, true, 'Server is owner');
        })
        .catch(function(err){
            console.log( err );
        })

        t.end();
    })

})
