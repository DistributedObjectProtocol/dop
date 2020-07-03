import test from 'ava'
import { createNode } from '../'
import { RPC_CREATOR } from '../src/const'

test('Api', async (t) => {
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

    t.deepEqual(Object.keys(server).length, 6)

    t.deepEqual(Object.keys(promise).length, 5)
    t.true(promise instanceof Promise)
    t.is(promise.node, server)
    t.is(typeof server.send, 'function')
    t.is(typeof promise.resolve, 'function')
    t.is(typeof promise.reject, 'function')
    t.is(typeof promise.createdAt, 'number')
})

test('Checking api req', async (t) => {
    const server = createNode()
    const client = createNode()
    server.open(client.message, (...args) => {
        t.is(args.length, 1)
        t.deepEqual(Object.keys(args[0]), ['resolve', 'reject', 'node'])
    })
    const callServer = client.open(server.message)
    callServer()
})

test('Callback pattern example', async (t) => {
    const server = createNode()
    const client = createNode()

    // server side
    server.open(client.message, (a, b, callback) => {
        callback(a * b)
    })

    // client side
    const callServer = client.open(server.message)
    callServer(3, 3, (value) => {
        t.is(value, 9)
    })
})

test('Calling a defined function .message must return true', async (t) => {
    const server = createNode()
    const client = createNode()
    const callClient = server.open(client.message, () => {})
    const callServer = client.open((msg) => {
        t.is(server.message(msg), true)
    })
    callServer()
})

test('Calling a not defined function .message must return false', async (t) => {
    const server = createNode()
    const client = createNode()
    const callClient = server.open(client.message)
    const callServer = client.open((msg) => {
        t.is(server.message(msg), false)
    })
    callServer()
})

test('Response (reject or resolve must delete request)', async (t) => {
    const server = createNode()
    const client = createNode()
    server.open(client.message, (v) => {})
    const callServer = client.open(server.message)
    t.is(Object.keys(client.requests).length, 0)
    callServer().then((v) => {
        t.is(Object.keys(client.requests).length, 0)
    })
    t.is(Object.keys(client.requests).length, 1)
})

test('Passing same functions should not create a new one', async (t) => {
    function rpcFilter() {
        const rpcs = {}
        return ({ rpc, function_id }) => {
            if (rpcs.hasOwnProperty(function_id)) {
                return rpcs[function_id]
            } else {
                rpcs[function_id] = rpc
                return rpc
            }
        }
    }

    const server = createNode()
    const client = createNode({ rpcFilter: rpcFilter() })

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

test('Testing messages', async (t) => {
    const serdes = { serialize: (m) => m, deserialize: (m) => m }
    const server = createNode(serdes)
    const client = createNode(serdes)

    client.open(
        (msg) => {
            t.deepEqual(msg, [-1, 0, 10])
            server.message(msg)
        },
        (a, b) => a * b
    )
    const callClient = server.open((msg) => {
        t.deepEqual(msg, [1, 0, [2, 5]])
        client.message(msg)
    })
    const ten = await callClient(2, 5)
    t.is(ten, 10)
})

test('Escaping $r', async (t) => {
    const serdes = { serialize: (m) => m, deserialize: (m) => m }
    const server = createNode(serdes)
    const client = createNode(serdes)

    // server side
    server.open(
        (msg) => {
            t.deepEqual(msg, [-1, 0, { $escape: { $r: 1 } }])
            client.message(msg)
        },
        (arg) => {
            t.deepEqual(arg, { $r: 0 })
            return { $r: 1 }
        }
    )

    // client side
    const callServer = client.open((msg) => {
        t.deepEqual(msg, [1, 0, [{ $escape: { $r: 0 } }]])
        server.message(msg)
    })
    const resu = await callServer({ $r: 0 })
    t.deepEqual(resu, { $r: 1 })
})

test('Using resolve', async (t) => {
    const server = createNode()
    const client = createNode()
    server.open(client.message)
    t.is(Object.keys(client.requests).length, 0)
    const callServer = client.open(server.message)
    const req = callServer()
    t.is(Object.keys(client.requests).length, 1)
    req.then((value) => {
        t.is(value, 'resolved')
    })
    req.resolve('resolved')
    t.is(Object.keys(client.requests).length, 0)
})

test('Using reject', async (t) => {
    const server = createNode()
    const client = createNode()
    server.open(client.message)
    t.is(Object.keys(client.requests).length, 0)
    const callServer = client.open(server.message)
    const req = callServer()
    t.is(Object.keys(client.requests).length, 1)
    req.catch((error) => {
        t.is(error, 'rejected')
    })
    req.reject('rejected')
    t.is(Object.keys(client.requests).length, 0)
})

test('Using push', async (t) => {
    const server = createNode()
    const client = createNode()
    server.open(client.message, (...args) => {
        t.is(args.length, 1)
        t.deepEqual(Object.keys(args[0]), ['node'])
    })
    const callServer = client.open(server.message)
    t.is(Object.keys(client.requests).length, 0)
    t.is(callServer.push(), undefined)
    t.is(Object.keys(client.requests).length, 0)
})

test('Calling functions from client to server with another node in the middle', async (t) => {
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
            value: a * b,
        }),
    }))

    // middle side
    const callServer = middleServer.open(server.message)
    const objectServer = await callServer()
    middleClient.open(client.message, () => ({
        multiply: objectServer.multiply,
    }))

    // client side
    const callMiddle = client.open(middleClient.message)
    const objectMiddle = await callMiddle()
    const { value, sum } = await objectMiddle.multiply(5, 5)
    t.is(value, 25)
    const result = await sum(5, 5)
    t.is(result, 10)
})

test('rpc is created if rpcFilter returns the rpc itself', async (t) => {
    const n = Math.random()
    const server = createNode({ rpcFilter: () => n })
    const client = createNode()
    const callClient = server.open(client.message, (fn) => {
        t.is(fn, n)
    })
    t.is(callClient, n)
    const callServer = client.open(server.message)
    callServer(() => {})
})

test('rpcFilter API', async (t) => {
    function login({ value, fn }) {
        t.is(typeof fn, 'function')
    }
    function entryFunction(fn0) {
        fn0()
        return {
            value: 1,
            login,
        }
    }

    const rpcFilter = ({
        rpc,
        node,
        function_id,
        function_creator,
        caller,
        path,
    }) => {
        // console.log({ function_id, function_creator, caller, path })
        t.is(node, server)
        if (function_id === 0) {
            t.is(function_creator, RPC_CREATOR.ENTRY)
            t.is(caller, undefined)
            t.is(path, undefined)
        }
        if (function_id === 1) {
            t.is(function_creator, RPC_CREATOR.REQUEST)
            t.is(caller, entryFunction)
            t.deepEqual(path, [0])
        }
        if (function_id === 2) {
            t.is(function_creator, RPC_CREATOR.RESPONSE)
            t.is(caller, undefined)
            t.deepEqual(path, [])
        }
        if (function_id === 3) {
            t.is(function_creator, RPC_CREATOR.REQUEST)
            t.is(caller, login)
            t.deepEqual(path, [0, 'fn'])
        }
        return rpc
    }
    const server = createNode({ rpcFilter })
    const client = createNode()
    server.ENV = 'SERVER'
    client.ENV = 'CLIENT'
    server.open(client.message, entryFunction)
    const callServer = client.open(server.message)
    const objServer = await callServer(() => {
        return () => {}
    })
    objServer.login({ value: 2, fn: () => {} })
})

test('registerLocalRpc & createRpc', async (t) => {
    const server = createNode()
    const client = createNode()
    server.open(client.message)
    client.open(server.message)

    const number = Math.random()
    server.registerLocalRpc('Login', (n) => {
        t.is(n, number)
        return n + 1
    })
    const rpc = client.createRpc('Login')
    const result = await rpc(number)
    t.is(number + 1, result)
})
