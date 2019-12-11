import test from 'ava'
import { createNode } from '../'

test('Api', async t => {
    const server = createNode()
    const client = createNode()

    client.open(server.message)
    const callClient = server.open(client.message)
    const promise = callClient(2, 5)

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

test('Checking args', async t => {
    const server = createNode()
    const client = createNode()

    // Client side
    const callServer = client.open(server.message, (c, d, e, f) => {
        t.is(c, e)
        t.is(callServer, f)
    })

    // Server side
    const receiveFromClient = () => {}
    const f = () => {}
    const callClient = server.open(client.message, receiveFromClient)
    callClient(f, () => {}, f, receiveFromClient)
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
