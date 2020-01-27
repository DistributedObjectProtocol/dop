const dop = require('../.proxy')
const transportName = process.argv[2] || 'local'
const transportListen = require('dop-transports').listen[transportName]
const transportConnect = require('dop-transports').connect[transportName]

function connect(t, end = true, port1 = 12345, port2 = 23456) {
    return new Promise(function(response, reject) {
        const dopServer = dop.create()
        const dopClient = dop.create()
        const dopSubClient = dop.create()
        dopServer.env = 'SERVER'
        dopClient.env = 'CLIENT'
        dopSubClient.env = 'SUBCLIENT'
        const transportServer = dopServer.listen({
            transport: transportListen,
            port: port1
        })
        const transportClient = dopClient.connect({
            transport: transportConnect,
            url: 'ws://localhost:' + port1
        })

        transportClient.on('connect', function(nodeClient) {
            const transportClientListen = dopClient.listen({
                transport: transportListen,
                port: port2
            })
            const transportSubClient = dopSubClient.connect({
                transport: transportConnect,
                url: 'ws://localhost:' + port2
            })
            transportSubClient.on('connect', function(nodeSubClient) {
                const close = function() {
                    nodeSubClient.disconnect()
                    transportServer.socket.close()
                    nodeClient.disconnect()
                    transportClientListen.socket.close()
                    if (end) t.end()
                }
                response({
                    dopServer,
                    dopClient,
                    dopSubClient,
                    transportServer,
                    transportClient,
                    transportSubClient,
                    nodeClient,
                    nodeSubClient,
                    close
                })
            })
        })
    })
}

module.exports = { connect }
