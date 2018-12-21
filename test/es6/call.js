const test = require('tape')
const dopServer = require('../.proxy').create()
const dopClient = require('../.proxy').create()
const transportName = process.argv[2] || 'local'
const transportListen = require('dop-transports').listen[transportName]
const transportConnect = require('dop-transports').connect[transportName]

const server = dopServer.listen({ transport: transportListen })
const client = dopClient.connect({
    transport: transportConnect,
    listener: server
})

dopServer.env = 'SERVER'
dopClient.env = 'CLIENT'

const objServer = dopServer.register({
    return: req => {
        return 'Hello world'
    },
    throw: () => {
        throw 'My Error'
    },
    undefined: req => {
        // returning nothing
    }
})

// server
dopServer.onSubscribe(() => objServer)

test('REMOTE FUNCTIONS MUST RETURN SAME VALUE WHEN RUNNING LOCALLY', async t => {
    const remoteFunctions = await client.subscribe()
    t.deepEqual(Object.keys(remoteFunctions), Object.keys(objServer))

    // normal return
    let dataremote = await remoteFunctions.return()
    let datalocal = await objServer.return()
    t.equal(dataremote, 'Hello world')
    t.equal(dataremote, datalocal)

    try {
        await remoteFunctions.throw()
        t.equal(1, 2, 'this should not happen')
    } catch (e) {
        t.equal(e, 'My Error')
    }

    try {
        await objServer.throw()
        t.equal(1, 2, 'this should not happen 2')
    } catch (e) {
        t.equal(e, 'My Error')
    }

    // undefined
    dataremote = await remoteFunctions.undefined()
    datalocal = await objServer.undefined()
    t.equal(dataremote, undefined)
    t.equal(dataremote, datalocal)

    t.end()
})
