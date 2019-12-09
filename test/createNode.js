import test from 'ava'
import { createNode } from '../'

test('createNode', async t => {
    const server = createNode()
    server.ENV = 'SERVER'
    const client = createNode()
    client.ENV = 'CLIENT'

    client.open(server.message, (a, b) => a * b)
    const callClient = server.open(client.message, data => {})
    const ten = await callClient(2, 5)

    t.is(ten, 10)
})
