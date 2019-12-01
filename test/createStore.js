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
        const { origin, destiny, prop, path } = args
        t.is(args.hasOwnProperty('value'), true)
        t.is(typeof origin, 'object')
        t.is(typeof destiny, 'object')
        t.is(typeof prop, 'string')
        t.is(Array.isArray(path), true)
    })
})
