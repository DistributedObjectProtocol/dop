import test from 'ava'
import { createNode } from '../'

test('Basic example', async t => {
    const server = createNode()
    const client = createNode()

    // Client side
    const origin2 = client.open(server.message, (a, b, c, d, e, f) => {
        console.log({ c, d, e, f })
        t.is(c, e)
        t.is(origin2, f)
        return a * b
    })

    // Server side
    const origin = () => {}
    const f = () => {}
    const callClient = server.open(client.message, origin)
    const ten = await callClient(2, 5, f, () => {}, f, origin)

    t.is(ten, 10)
})

// test('createNode', async t => {
//     const server = createNode()
//     const client = createNode()

//     client.open(
//         msg => {
//             t.is(msg, '[-1,0,10]')
//             server.message(msg)
//         },
//         (a, b) => a * b
//     )
//     const callClient = server.open(msg => {
//         t.is(msg, '[1,0,[2,5]]')
//         client.message(msg)
//     })
//     const ten = await callClient(2, 5)

//     t.is(ten, 10)
// })
