var test = require('tape')
var dop = require('../../').create()
var dopServer = dop.create()
var dopClient = dop.create()
dopServer.env = 'SERVER'
dopClient.env = 'CLIENT'

// var transportName = process.argv[2] || 'local'
// var transportListen = require('/mnt/c/Users/enzo/drive/projects/dop-transport')
//     .listen[transportName]
// var transportConnect = require('/mnt/c/Users/enzo/drive/projects/dop-transport')
//     .connect[transportName]

test('CONNECT TEST', function(t) {
    var server = dopServer.listen({
        // transport: transportListen
    })
    var client = dopClient.connect({
        // transport: transportConnect
    })
    var nodeServer
    dopServer.onSubscribe(function() {
        return { hello: 'world' }
    })
    client.on('connect', function(node) {
        node.subscribe().then(function(o) {
            t.deepEqual(o, { hello: 'world' })
            node.closeSocket() // avoid reconnections
            server.close() // this must terminate the server
            t.end()
        })
    })
})
