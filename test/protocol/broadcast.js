var test = require('tape');
var dop = require('../../dist/dop.nodejs').create();
var dopClient1 = require('../../dist/dop.nodejs').create();
var dopClient2 = require('../../dist/dop.nodejs').create();
var transportName = process.argv[2] || 'local';
var transportListen = require('dop-transports').listen[transportName];
var transportConnect = require('dop-transports').connect[transportName];

dop.env = 'SERVER';
dop.data.object_inc = 25;
dopClient1.env = 'CLIENT1';
dopClient2.env = 'CLIENT2';


test('BROADCAST TESTS', function(tt) {

    var test = function(name, cb){
        tt.test(name, {}, cb);
    };

var server = dop.listen({transport:transportListen})
var client1 = dopClient1.connect({transport:transportConnect, listener:server})
var client2 = dopClient2.connect({transport:transportConnect, listener:server})





var objServer = {
    number:1,
    subobject:{}
}
dop.register(objServer);
dop.setBroadcastFunction(objServer.subobject,'broadcast');
dop.onSubscribe(function(){
    return objServer;
})




// setBroadcastFunction(object, 'namefunction')

test('BROADCASTING TO CLIENTS', function(t) {

client1.subscribe().into({subobject:{broadcast:function(a,b){return a+b}}})
.then(function(obj) {
    return client2.subscribe().into({subobject:{broadcast:function(a,b){return a*b}}})
})
.then(function(obj) {
    
    var promises = objServer.subobject.broadcast(2,5);
    t.equal(Array.isArray(promises), true, 'Promises is array');
    t.equal(promises.length, 2, 'Promises are two promises');
    t.equal(promises[0] instanceof Promise, true, 'First promise is instanceof Promise');
    Promise.all(promises)
    .then(function(values){
        t.equal(values[0], 7, 'First value must be 2+5=7');
        t.equal(values[0], 7, 'Second value must be 2*5=10');
        // try {
            server.listener.close();
            // client1.socket.close();
            // client2.socket.close();
        // } catch(e) {
            // console.log( e );
            // process.exit();
        // }
        t.end()
    })
    // .catch(function(err){
    //     console.log( err );
    // })
})
})


// More test todo



})
