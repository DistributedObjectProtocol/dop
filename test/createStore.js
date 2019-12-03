import test from 'ava'
import { createStore } from '../'

test('createStore', function(t) {
    const state = { number: 1 }
    const store = createStore(state)

    t.is(state, store.state)
})

test('checking args of filter function in getState', function(t) {
    const store = createStore({ prop: true })
    store.getState(args => {
        const { object, prop, path } = args
        t.is(args.hasOwnProperty('oldValue'), true)
        t.is(typeof object, 'object')
        t.is(typeof prop, 'string')
        t.is(Array.isArray(path), true)
    })
})

test('subscribe', function(t) {
    const state = { prop: true }
    const store = createStore(state)
    const listener = () => {}
    const filter = () => {}
    store.subscribe(listener, filter)
    t.true(store.listeners.has(listener))
    t.is(store.listeners.get(listener), filter)
    t.is(store.listeners.size, 1)
    store.subscribe(listener)
    t.is(store.listeners.size, 1)
    t.is(store.listeners.get(listener), undefined)
})

test('unsubscribe', function(t) {
    const state = { prop: true }
    const store = createStore(state)
    const listener = () => {}
    store.subscribe(listener)
    t.true(store.listeners.has(listener))
    t.is(store.listeners.size, 1)
    store.unsubscribe(listener)
    t.is(store.listeners.size, 0)
    t.false(store.listeners.has(listener))
})

test('applyPatch', function(t) {
    const state = { prop: false }
    const store = createStore(state)
    const patch = { prop: true }
    const toreturnfromlistener = {}
    const listener = p => {
        t.not(p, patch)
        t.deepEqual(p, patch)
        return toreturnfromlistener
    }
    store.subscribe(listener)
    const outputs = store.applyPatch(patch)
    t.true(Array.isArray(outputs))
    t.is(outputs.length, 1)
    t.is(outputs[0].listener, listener)
    t.not(outputs[0].patch, patch)
    t.deepEqual(outputs[0].patch, patch)
    t.deepEqual(outputs[0].unpatch, { prop: false })
})

// function testFilter(t, object, patch, expected) {
//     const result = applyPatch(object, patch)
//     const { unpatch, mutations } = result
//     t.is(result.object, object)
//     t.deepEqual(object, expected)
// }

// test('filter must return true otherwise that mutation will be ignored', function(t) {
//     const patch = { a: 1, b: 2 }
//     const expected = {}
//     testFilter(t, {}, patch, expected, false, () => {})
//     testFilter(t, {}, patch, expected, false, () => false)
//     testFilter(t, {}, patch, expected, false, () => undefined)
//     testFilter(t, {}, patch, expected, false, () => 1)
// })

// test('filtering getState', function(t) {
//     const patch = { value: false, last: { deep: false } }

//     testFilter(
//         t,
//         {},
//         patch,
//         { last: { deep: false } },
//         false,
//         ({ prop }) => prop !== 'value'
//     )

//     testFilter(
//         t,
//         {},
//         patch,
//         { value: false },
//         false,
//         ({ prop }) => prop !== 'last'
//     )

//     testFilter(t, {}, patch, patch, false, ({ path }) => path.length === 1)

//     testFilter(
//         t,
//         { value: false, last: { deep: false } },
//         { value: true, last: { deep: true } },
//         { value: false, last: { deep: true } },
//         false,
//         ({ path }) => path.length === 2
//     )

//     testFilter(
//         t,
//         { value: false, last: { deep: false } },
//         { value: true, last: { deep: true } },
//         { value: true, last: { deep: false } },
//         false,
//         ({ path }) => path.length === 1
//     )
// })
