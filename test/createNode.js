import test from 'ava'
import { createNode } from '../'

test('createNode', function(t) {
    const server = createNode()
    server.ENV = 'SERVER'
    const client = createNode()
    client.ENV = 'CLIENT'

    const channel_server = server.open(client.message, data => {})
    channel_server(1, 2, 3, 4)

    const channel_client = client.open(server.message, data => {})
    channel_client(1, 2, 3, 4)

    t.is(state, store.state)
})
