var test = require('tape')
var dop = require('../.proxy').create()
var dopServer = dop.create()
var dopClient = dop.create()
dopServer.env = 'SERVER'
dopClient.env = 'CLIENT'

var transportName = process.argv[2] || 'ws'
var transportListen = require('dop-transports').listen[transportName]
var transportConnect = require('dop-transports').connect[transportName]

test('CONNECT TEST', function(t) {
    var server = dopServer.listen({
        transport: transportListen
    })
    var tokenServer
    var tokenClient

    dopClient
        .connect({
            transport: transportConnect,
            listener: server
        })
        .then(function(nodeClient) {
            tokenClient = nodeClient.token
            // t.equal(tokenServer, nodeClient.token, 'SERVER connect')
        })

    server.on('connect', function(node) {
        t.equal(tokenClient, node.token, 'SERVER connect')
        server.socket.close()
        t.end()
    })
})
