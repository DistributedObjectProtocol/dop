var test = require('tape');
var dop = require('../.proxy').create();
var dopClient1 = require('../.proxy').create();
var dopClient2 = require('../.proxy').create();
var transportName = process.argv[2]|| 'local';
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
    number:1,
    subobject:{},
    array:[]
})
var objClient1;
var objClient2;
dop.onSubscribe(function(){
    return objServer;
})





// HACKING dopCLient1 onpatch to lose one message
var lost2 = false;
var lost5 = false;
dopClient1.protocol.onpatchOri = dopClient1.protocol.onpatch; 
dopClient1.protocol.onpatch = function(node, request_id, request) {
    var version = request[2];
    if (request[2] === 2) {
        if (lost2===false)
            lost2 = true;
        else
            dopClient1.protocol.onpatchOri(node, request_id, request);
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
        if (lost5===false)
            lost5 = true;
        else
            dopClient1.protocol.onpatchOri(node, request_id, request);
    }
    else
        dopClient1.protocol.onpatchOri(node, request_id, request);
}




test('TWO CLIENTS SUBCRIBED AND ONE LOSE PATCH VERSION 2', function(t) {

    client1.subscribe().then(function(obj) {
        client2.subscribe().then(function(obj2) {

            objClient1 = obj;
            objClient2 = obj2;
            t.deepEqual(objServer, objClient1, 'objClient1 deepEqual objServer before mutations');
            t.deepEqual(objServer, objClient2, 'objClient2 deepEqual objServer before mutations');

            dop.set(objServer, 'number', 'first');
            dop.set(objServer, 'array', [2,2,2]);
            dop.set(objServer, 'tres', 3);
            dop.set(objServer, 'cuatro', 4444);
            dop.set(objServer, 'cinco', 'elcinco');

            setTimeout(function(){
                t.deepEqual(objServer, objClient1, 'objClient1 deepEqual objServer after mutations');
                t.deepEqual(objServer, objClient2, 'objClient2 deepEqual objServer after mutations');
                t.end()
            },2000)


        })
    })
})




// // More test todo...

// test('TWO CLIENTS SUBCRIBED AND ONE LOSE PATCH VERSION 2', function(t) {


//     delete objClient2.array
//     delete objClient2.subobject
//     dop.set(objServer.subobject, 'value', 1234)
//     objServer.array.unshift('LOL')

//     setTimeout(function(){
//         t.deepEqual(objServer, objClient1, 'objClient1 deepEqual objServer after mutations');
//         t.deepEqual(objServer, objClient2, 'objClient2 deepEqual objServer after mutations');
//         t.end()
//         server.listener.close();
//     },2000)


// })