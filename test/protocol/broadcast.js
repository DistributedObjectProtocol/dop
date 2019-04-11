var test = require('tape')
var dop = require('../.proxy').create()
var dopClient1 = require('../.proxy').create()
var dopClient2 = require('../.proxy').create()
var transportName = process.argv[2] || 'local'
var transportListen = require('dop-transports').listen[transportName]
var transportConnect = require('dop-transports').connect[transportName]

dop.env = 'SERVER'
dop.data.object_inc = 25
dopClient1.env = 'CLIENT1'
dopClient2.env = 'CLIENT2'

test('BROADCAST TESTS', function(tt) {
    var test = function(name, cb) {
        tt.test(name, {}, cb)
    }

    var server = dop.listen({ transport: transportListen })
    var client1 = dopClient1.connect({
        transport: transportConnect,
        listener: server
    })
    var client2 = dopClient2.connect({
        transport: transportConnect,
        listener: server
    })

    var objServer = {
        number: 1,
        subobject: {}
    }
    var objClient1 = {
        subobject: {
            broadcastFunction: function(a, b) {
                return a + b
            }
        }
    }
    var objClient2 = {
        subobject: {
            broadcastFunction: function(a, b) {
                return a * b
            }
        }
    }

    dop.register(objServer)
    dop.setBroadcastFunction(objServer.subobject, 'broadcastFunction')
    dop.onSubscribe(function() {
        return objServer
    })

    tt.equal(
        typeof objServer.subobject.broadcastFunction,
        'function',
        'broadcastFunction is a function'
    )

    test('BROADCASTING TO CLIENTS', function(t) {
        client1
            .subscribe()
            .into(objClient1)
            .then(function(obj) {
                return client2.subscribe().into(objClient2)
            })
            .then(function(obj) {
                var promises = objServer.subobject.broadcastFunction(2, 5)
                t.equal(Array.isArray(promises), true, 'Promises is array')
                t.equal(promises.length, 2, 'Promises are two promises')
                t.equal(
                    promises[0] instanceof Promise,
                    true,
                    'First promise is instanceof Promise'
                )
                return Promise.all(promises)
                // .catch(function(err){
                //     console.log( err );
                // })
            })
            .then(function(values) {
                t.equal(values[0], 7, 'First value must be 2+5=7')
                t.equal(values[1], 10, 'Second value must be 2*5=10')

                objClient1.subobject.broadcastFunction = function(a, b) {
                    return a / b
                }

                return Promise.all(objServer.subobject.broadcastFunction(10, 2))
            })
            .then(function(values) {
                t.equal(values[0], 5, 'First value must be 10/2=5')
                t.equal(values[1], 20, 'Second value must be 10*2=20')
                server.listener.close()
                // client1.socket.close();
                // client2.socket.close();
                t.end()
            })
    })

    // More test todo
    tt.end()
})
