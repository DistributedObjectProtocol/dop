var test = require('tape');
var dop = require('../../dist/nodejs').create();
var dopClient1 = require('../../dist/nodejs').create();
var dopClient2 = require('../../dist/nodejs').create();
var transportName = process.argv[2] || 'local';
var transportListen = require('dop-transports').listen[transportName];
var transportConnect = require('dop-transports').connect[transportName];

dop.env = 'SERVER';
dop.data.object_inc = 25;
dopClient1.env = 'CLIENT1';
dopClient2.env = 'CLIENT2';

var server = dop.listen({transport:transportListen})
var client1 = dopClient1.connect({transport:transportConnect, listener:server})
var client2 = dopClient2.connect({transport:transportConnect, listener:server})





var objServer = dop.register({
    primero:1,
    subobject:{},
    dos:[]
})
dop.onsubscribe(function(){
    return objServer;
})





// HACKING dopCLient1 onpatch to lose one message
var lost = false;
dopClient1.protocol.onpatchOri = dopClient1.protocol.onpatch; 
dopClient1.protocol.onpatch = function(node, request_id, request) {
    var version = request[2];
    if (request[2] === 2) {
        if (lost===false) lost = true;
        else
        // setTimeout(function() {
            dopClient1.protocol.onpatchOri(node, request_id, request);
        // }, 600);
    }
    else if (request[2] === 3) {
        setTimeout(function() {
            dopClient1.protocol.onpatchOri(node, request_id, request);
        }, 300);
    }
    else if (request[2] === 4) {
        setTimeout(function() {
            dopClient1.protocol.onpatchOri(node, request_id, request);
        }, 400);
    }
    else if (request[2] === 5) {
        setTimeout(function() {
            dopClient1.protocol.onpatchOri(node, request_id, request);
        }, 500);
    }
    else
        dopClient1.protocol.onpatchOri(node, request_id, request);
}




test('TWO CLIENTS SUBCRIBED AND ONE LOSE PATCH VERSION 2', function(t) {

    client1.subscribe().then(function(obj) {
        client2.subscribe().then(function(obj2) {

            t.deepEqual(objServer, obj, 'Obj1 deepEqual objServer before mutations');
            t.deepEqual(objServer, obj2, 'Obj2 deepEqual objServer before mutations');

            dop.set(objServer, 'primero', 'first');
            dop.set(objServer, 'dos', [2,2,2]);
            dop.set(objServer, 'tres', 3);
            dop.set(objServer, 'cuatro', 4444);
            dop.set(objServer, 'cinco', 'elcinco');

            setTimeout(function(){
                t.deepEqual(objServer, obj, 'Obj1 deepEqual objServer after mutations');
                t.deepEqual(objServer, obj2, 'Obj2 deepEqual objServer after mutations');
                t.end()
            },1000)


        })
    })
})




// // More test todo...
