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
