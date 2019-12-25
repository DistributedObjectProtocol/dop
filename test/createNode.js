import test from 'ava'
import { createNode } from '../'

test('Api', async t => {
    const server = createNode()
    const client = createNode()

    client.open(server.message)
    const callClient = server.open(client.message)
    const promise = callClient(2, 5)

    t.deepEqual(Object.keys(server), [
        'open',
        'message',
        'close',
        'opened',
        'send'
    ])
    t.deepEqual(Object.keys(promise), [
        'resolve',
        'reject',
        'data',
        'node',
        'destroy'
    ])
    t.true(promise instanceof Promise)
    t.is(server.send, client.message)
    t.is(promise.node, server)
    t.is(typeof promise.resolve, 'function')
    t.is(typeof promise.reject, 'function')
    t.is(typeof promise.destroy, 'function')
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

test('Sending remote functions must be replaced as null', async t => {
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

test('Escaping $function', async t => {
    const server = createNode()
    const client = createNode()

    // server side
    server.open(
        msg => {
            t.deepEqual(msg, [-1, 0, { $escape: { $function: 1 } }])
            client.message(msg)
        },
        arg => {
            t.deepEqual(arg, { $function: 0 })
            return { $function: 1 }
        }
    )

    // client side
    const callServer = client.open(msg => {
        t.deepEqual(msg, [1, 0, [{ $escape: { $function: 0 } }]])
        server.message(msg)
    })
    const resu = await callServer({ $function: 0 })
    t.deepEqual(resu, { $function: 1 })
})

test.skip('Passing serializer and deserializer', async t => {})
test.skip('Using destroy', async t => {})
test.skip('Using resolve', async t => {})
test.skip('Using reject', async t => {})
test.skip('Using stub', async t => {})
