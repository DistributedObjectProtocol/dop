import test from 'ava'
import { createNode } from '../'

test('Api', async t => {
    const server = createNode()
    const client = createNode()

    client.open(server.message, (a, b, req) => {
        t.is(a, 2)
        t.is(b, 5)
        t.true(req instanceof Promise)
        t.deepEqual(Object.keys(req).length, 3)
        t.is(req.node, client)
        t.is(typeof req.resolve, 'function')
        t.is(typeof req.reject, 'function')
    })
    const callClient = server.open(client.message)
    const promise = callClient(2, 5)

    t.deepEqual(Object.keys(server).length, 7)

    t.deepEqual(Object.keys(promise).length, 5)
    t.true(promise instanceof Promise)
    t.is(server.send, client.message)
    t.is(promise.node, server)
    t.is(typeof promise.resolve, 'function')
    t.is(typeof promise.reject, 'function')
    t.is(typeof promise.createdAt, 'number')
})

test('Checking api req', async t => {
    const server = createNode()
    const client = createNode()
    server.open(client.message, (...args) => {
        t.is(args.length, 1)
        t.deepEqual(Object.keys(args[0]), ['resolve', 'reject', 'node'])
    })
    const callServer = client.open(server.message)
    callServer()
})

test('Callback pattern example', async t => {
    const server = createNode()
    const client = createNode()

    // server side
    server.open(client.message, (a, b, callback) => {
        callback(a * b)
    })

    // client side
    const callServer = client.open(server.message)
    callServer(3, 3, value => {
        t.is(value, 9)
    })
})

test('Calling a defined function .message must return true', async t => {
    const server = createNode()
    const client = createNode()
    const callClient = server.open(client.message, () => {})
    const callServer = client.open(msg => {
        t.is(server.message(msg), true)
    })
    callServer()
})

test('Calling a not defined function .message must return false', async t => {
    const server = createNode()
    const client = createNode()
    const callClient = server.open(client.message)
    const callServer = client.open(msg => {
        t.is(server.message(msg), false)
    })
    callServer()
})

test('Response (reject or resolve must delete request)', async t => {
    const server = createNode()
    const client = createNode()
    server.open(client.message, v => {})
    const callServer = client.open(server.message)
    t.is(Object.keys(client.requests).length, 0)
    callServer().then(v => {
        t.is(Object.keys(client.requests).length, 0)
    })
    t.is(Object.keys(client.requests).length, 1)
})

test('Passing same functions should not create a new one', async t => {
    const server = createNode()
    const client = createNode()

    // Client side
    const callServer = client.open(
        server.message,
        (repeated1, repeated2, callserverasargument) => {
            t.is(repeated1, repeated2)
            t.is(callServer, callserverasargument)
        }
    )

    // Server side
    const receiveFromClient = () => {}
    const repeated = () => {}
    const callClient = server.open(client.message, receiveFromClient)
    callClient(repeated, repeated, receiveFromClient)
})

test('Sending remote functions that is from the same node must be replaced as null', async t => {
    const server = createNode()
    const client = createNode()

    // server side
    server.open(client.message, (...args) => {
        t.is(args.length, 3)
        t.is(args[0], null)
        t.is(typeof args[1], 'function')
        t.is(typeof args[2], 'object')
        return args[1]
    })

    // client side
    const callServer = client.open(server.message)
    const resu = await callServer(callServer, () => {})
    t.is(resu, null)
})

test('Testing messages', async t => {
    const server = createNode()
    const client = createNode()

    client.open(
        msg => {
            t.deepEqual(msg, [-1, 0, 10])
            server.message(msg)
        },
        (a, b) => a * b
    )
    const callClient = server.open(msg => {
        t.deepEqual(msg, [1, 0, [2, 5]])
        client.message(msg)
    })
    const ten = await callClient(2, 5)
    t.is(ten, 10)
})

test('Escaping $f', async t => {
    const server = createNode()
    const client = createNode()

    // server side
    server.open(
        msg => {
            t.deepEqual(msg, [-1, 0, { $escape: { $f: 1 } }])
            client.message(msg)
        },
        arg => {
            t.deepEqual(arg, { $f: 0 })
            return { $f: 1 }
        }
    )

    // client side
    const callServer = client.open(msg => {
        t.deepEqual(msg, [1, 0, [{ $escape: { $f: 0 } }]])
        server.message(msg)
    })
    const resu = await callServer({ $f: 0 })
    t.deepEqual(resu, { $f: 1 })
})

test('Using resolve', async t => {
    const server = createNode()
    const client = createNode()
    server.open(client.message)
    t.is(Object.keys(client.requests).length, 0)
    const callServer = client.open(server.message)
    const req = callServer()
    t.is(Object.keys(client.requests).length, 1)
    req.then(value => {
        t.is(value, 'resolved')
    })
    req.resolve('resolved')
    t.is(Object.keys(client.requests).length, 0)
})

test('Using reject', async t => {
    const server = createNode()
    const client = createNode()
    server.open(client.message)
    t.is(Object.keys(client.requests).length, 0)
    const callServer = client.open(server.message)
    const req = callServer()
    t.is(Object.keys(client.requests).length, 1)
    req.catch(error => {
        t.is(error, 'rejected')
    })
    req.reject('rejected')
    t.is(Object.keys(client.requests).length, 0)
})

test('Using stub', async t => {
    const server = createNode()
    const client = createNode()
    server.open(client.message, (...args) => {
        t.is(args.length, 1)
        t.deepEqual(Object.keys(args[0]), ['node'])
    })
    const callServer = client.open(server.message)
    t.is(Object.keys(client.requests).length, 0)
    t.is(callServer.stub(), undefined)
    t.is(Object.keys(client.requests).length, 0)
})

test('Sending remote stub functions that is from the same node must be replaced as null', async t => {
    const server = createNode()
    const client = createNode()

    // server side
    server.open(client.message, (...args) => {
        t.is(args.length, 3)
        t.is(args[0], null)
        t.is(typeof args[1], 'function')
        t.is(typeof args[2], 'object')
        return args[1]
    })

    // client side
    const callServer = client.open(server.message)
    const resu = await callServer(callServer.stub, () => {})
    t.is(resu, null)
})

test('Calling functions from client to server with another node in the middle', async t => {
    // connection 1
    const server = createNode()
    const middleServer = createNode()
    // connection 2
    const middleClient = createNode()
    const client = createNode()

    // server side
    server.open(middleServer.message, () => ({
        multiply: (a, b) => ({
            sum: (c, d) => c + d,
            value: a * b
        })
    }))

    // middle side
    const callServer = middleServer.open(server.message)
    const objectServer = await callServer()
    middleClient.open(client.message, () => ({
        multiply: objectServer.multiply
    }))

    // client side
    const callMiddle = client.open(middleClient.message)
    const objectMiddle = await callMiddle()
    const { value, sum } = await objectMiddle.multiply(5, 5)
    t.is(value, 25)
    const result = await sum(5, 5)
    t.is(result, 10)
})

test('Limiting remote functions', async t => {
    const server = createNode({ max_remote_functions: 3 })
    const client = createNode()
    server.open(client.message, (fn, isLast) => {
        if (isLast) t.is(fn, null)
        else t.is(typeof fn, 'function')
    })
    const callServer = client.open(server.message)
    t.is(server.remote_functions.size, 2)
    await callServer(() => {}, false)
    t.is(server.remote_functions.size, 4)
    await callServer(() => {}, false)
    t.is(server.remote_functions.size, 6)
    await callServer(() => {}, true)
    t.is(server.remote_functions.size, 6)
})

test('Limiting remote functions to 0', async t => {
    const server = createNode({ max_remote_functions: 0 })
    const client = createNode({ max_remote_functions: 1 })
    const callClient = server.open(client.message, fn => fn)
    const callServer = client.open(server.message, fn => fn)
    await callServer(() => {})
    t.is(callClient, null)
    t.is(server.remote_functions.size, 0)
    t.is(client.remote_functions.size, 2)
})
