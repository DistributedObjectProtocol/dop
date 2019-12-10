import test from 'ava'
import { createNode } from '../'

test('Basic example', async t => {
    const server = createNode()
    const client = createNode()

    client.open(server.message, (a, b) => a * b)
    const callClient = server.open(client.message)
    const ten = await callClient(2, 5)

    t.is(ten, 10)
})

test('createNode', async t => {
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
