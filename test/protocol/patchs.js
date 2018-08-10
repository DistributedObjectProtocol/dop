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

var server = dop.listen({ transport: transportListen })
var client1 = dopClient1.connect({
    transport: transportConnect,
    listener: server
})
var client2 = dopClient2.connect({
    transport: transportConnect,
    listener: server
})

var objServer = dop.register({
    number: 1,
    subobject: {},
    array: []
})
var objClient1
var objClient2
dop.onSubscribe(function() {
    return objServer
})

test('TWO CLIENTS SUBCRIBED AND BOTH RECEIVE MULTIPLE MUTATIONS', function(t) {
    client1.subscribe().then(function(obj) {
        client2.subscribe().then(function(obj2) {
            objClient1 = obj
            objClient2 = obj2
            t.deepEqual(
                objServer,
                objClient1,
                'objClient1 deepEqual objServer before mutations'
            )
            t.deepEqual(
                objServer,
                objClient2,
                'objClient2 deepEqual objServer before mutations'
            )

            dop.set(objServer, 'number', 'first')
            dop.set(objServer, 'array', [2, 2, 2])
            dop.set(objServer, 'tres', 3)
            dop.set(objServer, 'cuatro', 4444)
            dop.set(objServer, 'cinco', 'elcinco')

            setTimeout(function() {
                t.deepEqual(
                    objServer,
                    objClient1,
                    'objClient1 deepEqual objServer after mutations'
                )
                t.deepEqual(
                    objServer,
                    objClient2,
                    'objClient2 deepEqual objServer after mutations'
                )
                server.listener.close()
                t.end()
            }, 1000)
        })
    })
})

// // More test todo...
