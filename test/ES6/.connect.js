const dop = require('../.proxy')
const transportName = process.argv[2] || 'local'
const transportListen = require('dop-transports').listen[transportName]
const transportConnect = require('dop-transports').connect[transportName]

function connect(t, end = true) {
    return new Promise((response, reject) => {
        const dopServer = dop.create()
        const dopClient = dop.create()
        dopServer.env = 'SERVER'
        dopClient.env = 'CLIENT1'
        const transportServer = dopServer.listen({ transport: transportListen })
        const transportClient = dopClient.connect({
            transport: transportConnect
        })
        transportClient.on('connect', async nodeClient => {
            const close = () => {
                nodeClient.disconnect()
                transportServer.socket.close()
                if (end) t.end()
            }
            response({
                dopServer,
                dopClient,
                transportServer,
                transportClient,
                nodeClient,
                close
            })
        })
    })
}

module.exports = { connect }
