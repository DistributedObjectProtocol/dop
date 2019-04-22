var test = require('tape')
var dop = require('../.proxy').create()
var dopServer = dop.create()
var dopClient = dop.create()
dopServer.env = 'SERVER'
dopClient.env = 'CLIENT'
var transportName = process.argv[2] || 'websocket'
var transportListen = require('dop-transports').listen[transportName]
var transportConnect = require('dop-transports').connect[transportName]

test('QUEUE TEST', function(t) {
    var server = dopServer.listen({ transport: transportListen, timeout: 2 })
    dopClient
        .connect({
            transport: transportConnect,
            listener: server
        })
        .then(function(nodeClient) {
            var nodeServer
            var msg = 0
            var maxMsg = 10
            function send() {
                nodeClient.send(String(msg))
                nodeServer.send(String(msg))
                msg += 1
                if (msg < maxMsg) setTimeout(send, 300)
            }

            var incS = 0,
                incC = 0

            server.on('connect', function(node) {
                nodeServer = node
                send()
            })
            nodeClient.on('message', function(message) {
                t.equal(
                    message,
                    String(incC++),
                    'CLIENT message `' + message + '`'
                )
            })
            server.on('message', function(node, message) {
                t.equal(
                    message,
                    String(incS++),
                    'SERVER message `' + message + '`'
                )
                if (incS === maxMsg && incC === maxMsg) {
                    console.log('CLOSSING!!')
                    t.end()
                    // server.disconnectAll()
                    // server.socket.close()
                    nodeClient.socket.close()
                    // nodeClient.closeSocket()
                }
            })

            // setTimeout(function() {
            //     console.log('closing...')
            //     nodeClient.socket.close()
            // }, 500)

            // setTimeout(function() {
            //     console.log('closing2...')
            //     nodeClient.socket.close()
            // }, 2000)
        })
})
