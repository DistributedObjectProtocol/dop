import test from 'ava'
import { createStore } from '../'

test('createStore', function(t) {
    const state = { number: 1 }
    const store = createStore(state)

    t.is(state, store.state)
})

test('subscribe without filter must return the same state', function(t) {
    const state = { number: 1 }
    const store = createStore(state)
    const statereturned = store.subscribe(() => {})

    t.not(state, statereturned)
    t.deepEqual(state, statereturned)
})

test('filter must return true otherwise that mutation will be ignored', function(t) {
    const store = createStore({})
    const l = () => {}

    t.deepEqual(
        {},
        store.subscribe(l, () => false)
    )
    t.deepEqual(
        {},
        store.subscribe(l, () => undefined)
    )
    t.deepEqual(
        {},
        store.subscribe(l, () => 1)
    )
})

test('checking args of filter function', function(t) {
    const store = createStore({ prop: true })
    store.subscribe(
        () => {},
        ({ origin, destiny, prop, path }) => {
            t.is(typeof origin, 'object')
            t.is(typeof destiny, 'object')
            t.is(typeof prop, 'string')
            t.is(Array.isArray(path), true)
        }
    )
})

test('filtering subscribe', function(t) {
    const state = { value: false, last: { deep: false } }
    const store = createStore(state)
    const l = () => {}

    t.deepEqual(
        { last: { deep: false } },
        store.subscribe(l, ({ origin, destiny, prop, path }) => {
            return prop !== 'value'
        })
    )

    t.deepEqual(
        { value: false },
        store.subscribe(l, ({ origin, destiny, prop, path }) => {
            return prop !== 'last'
        })
    )

    t.deepEqual(
        { value: false, last: {} },
        store.subscribe(l, ({ origin, destiny, prop, path }) => {
            return path.length === 1
        })
    )
})
