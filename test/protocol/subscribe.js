var test = require('tape')
var dopServer = require('../.proxy').create()
var dopClient = require('../.proxy').create()
var transportName = process.argv[2] || 'local'
var transportListen = require('dop-transports').listen[transportName]
var transportConnect = require('dop-transports').connect[transportName]

dopServer.env = 'SERVER'
dopClient.env = 'CLIENT1'

test('into()', t => {
    const transportServer = dopServer.listen({ transport: transportListen })
    const transportClient = dopClient.connect({
        transport: transportConnect
    })
    const objectServer = { hello: 'world' }
    dopServer.onSubscribe(() => objectServer)
    transportClient.on('connect', async nodeClient => {
        const objectClient = {}
        t.notDeepEqual(objectServer, objectClient)
        await nodeClient.subscribe().into(objectClient)
        t.deepEqual(objectServer, objectClient)
        nodeClient.disconnect()
        transportServer.socket.close()
        t.end()
    })
})

test('into() client deep object', t => {
    const transportServer = dopServer.listen({ transport: transportListen })
    const transportClient = dopClient.connect({
        transport: transportConnect
    })
    const objectServer = { inc: 0 }
    dopServer.onSubscribe(() => objectServer)
    transportClient.on('connect', async nodeClient => {
        const objectClient = { deep: {} }
        t.notDeepEqual(objectServer, objectClient.deep)
        await nodeClient.subscribe().into(objectClient.deep)
        t.deepEqual(objectServer, objectClient.deep)
        nodeClient.disconnect()
        transportServer.socket.close()
        t.end()
    })
})

test('observe into()', t => {
    const objectServer = dopServer.register({ inc: 0 })
    const transportServer = dopServer.listen({ transport: transportListen })
    dopServer.onSubscribe(() => objectServer)
    ;(function loop(times) {
        const transportClient = dopClient.connect({
            transport: transportConnect
        })
        transportClient.on('connect', async nodeClient => {
            const objectClient = dopClient.register({ deep: {} })
            t.notDeepEqual(objectServer, objectClient.deep)
            await nodeClient.subscribe().into(objectClient.deep)
            t.deepEqual(objectServer, objectClient.deep)
            const observer = dopClient.createObserver(() => {
                t.deepEqual(objectServer, objectClient.deep)
                setTimeout(() => {
                    nodeClient.disconnect()
                    if (times === 2) {
                        t.end()
                        transportServer.socket.close()
                    } else {
                        loop(times + 1)
                    }
                }, 0)
            })
            observer.observeAll(objectClient)
            objectServer.inc += 1
        })
    })(1)
})
