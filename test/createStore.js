import test from 'ava'
import { createStore } from '../'

test('createStore', function(t) {
    const state = { number: 1 }
    const store = createStore(state)

    t.is(state, store.state)
})

test('getState gets a deep copy', function(t) {
    const state = { prop: true }
    const store = createStore(state)

    t.not(state, store.getState())
    t.deepEqual(state, store.getState())
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

test('patch', function(t) {
    const state = { prop: false }
    const store = createStore(state)
    const patch = { prop: true }
    const listener = p => {}
    store.subscribe(listener)
    const outputs = store.patch(patch)
    t.true(Array.isArray(outputs))
    t.is(outputs.length, 1)
    t.is(outputs[0].listener, listener)
    t.not(outputs[0].patch, patch)
    t.deepEqual(outputs[0].patch, patch)
    t.deepEqual(outputs[0].unpatch, { prop: false })
    t.true(Array.isArray(outputs[0].mutations))

    const { unpatch, mutations } = outputs
    t.deepEqual(unpatch, { prop: false })
    t.true(Array.isArray(mutations))
    t.deepEqual(mutations, outputs[0].mutations)
})

test('patchAndEmit', function(t) {
    const store = createStore({ prop: false })
    const patch = { prop: true, newprop: true }
    const toreturnfromlistener = {}
    const listener = p => {
        t.not(p, patch)
        t.deepEqual(p, patch)
        return toreturnfromlistener
    }
    store.subscribe(listener)
    const outputs = store.patchAndEmit(patch)
    t.true(Array.isArray(outputs))
    t.is(outputs.length, 1)
    t.is(outputs[0], toreturnfromlistener)
})

test('subscribe filter', function(t) {
    const store = createStore({ prop: false })
    const patch = { prop: true, newprop: true }
    const filter = mutation => mutation.prop !== 'newprop'
    store.subscribe(() => {}, filter)
    const result = store.patch(patch)
    const [output] = result
    t.not(output.patch, patch)
    t.deepEqual(output.patch, { prop: true })
    t.deepEqual(output.unpatch, { prop: false })
    t.is(output.mutations.length, 1)
    t.is(result.mutations.length, 2)
})
