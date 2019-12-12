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
    t.is(server.send, client.message)
    t.is(callClient.name, '$remoteFunction')
    t.true(promise instanceof Promise)
    t.deepEqual(Object.keys(promise), [
        'resolve',
        'reject',
        'data',
        'node',
        'destroy'
    ])
    t.is(promise.node, server)
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
            t.is(repeated2, repeated2)
            t.is(callServer, callserverasargument)
        }
    )

    // Server side
    const receiveFromClient = () => {}
    const repeated = () => {}
    const callClient = server.open(client.message, receiveFromClient)
    callClient(repeated, repeated, receiveFromClient)
})

test.skip('Recursive functions as arguments', async t => {
    const server = createNode()
    const client = createNode()
    server.ENV = 'SERVER'
    client.ENV = 'CLIENT'

    // server side
    const callClient = server.open(client.message, f => {
        // f(f)
        return { callClient, f }
    })

    // client side
    const callServer = client.open(server.message)
    const callServer2 = await callServer(callServer, callClient)
    // const callServer3 = await callServer(callServer2)
    // const callServer4 = await callServer(callServer3)
})

test('Testing messages', async t => {
    const server = createNode()
    const client = createNode()

    client.open(
        msg => {
            t.is(msg, '[-1,0,10]')
            server.message(msg)
        },
        (a, b) => a * b
    )
    const callClient = server.open(msg => {
        t.is(msg, '[1,0,[2,5]]')
        client.message(msg)
    })
    const ten = await callClient(2, 5)

    t.is(ten, 10)
})
