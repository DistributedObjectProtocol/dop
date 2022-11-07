import test from 'ava'
import { createStore, TYPE } from '../src'

test('createStore', function (t) {
    const state = { number: 1 }
    const store = createStore(state)

    t.is(state, store.state)
})

// test('getState gets a deep copy', function(t) {
//     const state = { prop: true }
//     const store = createStore(state)

//     t.not(state, store.getState())
//     t.deepEqual(state, store.getState())
// })

test('subscribe', function (t) {
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

test('unsubscribe from subscribe', function (t) {
    const state = { prop: true }
    const store = createStore(state)
    const listener = () => {}
    const unsubscribe = store.subscribe(listener)
    t.true(store.listeners.has(listener))
    t.is(store.listeners.size, 1)
    unsubscribe()
    t.is(store.listeners.size, 0)
    t.false(store.listeners.has(listener))
})

test('unsubscribe', function (t) {
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

test('applyPatch', function (t) {
    const state = { prop: false }
    const store = createStore(state)
    const patch = { prop: true }
    const listener = (p) => {}
    store.subscribe(listener)
    const outputs = store.applyPatch(patch)
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

test('applyPatch with function', function (t) {
    const state = { prop: false }
    const store = createStore(state)
    const listener = (p) => {}
    store.subscribe(listener)
    const outputs = store.applyPatch((draft) => {
        draft.prop = true
    })
    t.true(Array.isArray(outputs))
    t.is(outputs.length, 1)
    t.is(outputs[0].listener, listener)
    t.deepEqual(outputs[0].unpatch, { prop: false })
    t.true(Array.isArray(outputs[0].mutations))

    const { unpatch, mutations } = outputs
    t.deepEqual(unpatch, { prop: false })
    t.true(Array.isArray(mutations))
    t.deepEqual(mutations, outputs[0].mutations)
})

test('subscribe filter', function (t) {
    const initialstate = { prop: false }
    const store = createStore(initialstate)
    const patch = { prop: true, newprop: true }
    const filter = (mutation) => mutation.prop !== 'newprop'
    store.subscribe(() => {}, filter)
    const result = store.applyPatch(patch)
    const [output] = result
    t.not(output.patch, patch)
    t.deepEqual(output.patch, { prop: true })
    t.deepEqual(output.unpatch, { prop: false })
    t.is(output.mutations.length, 1)
    t.is(result.mutations.length, 2)
})

test('subscribe output of applyPatch must return same length that listeners', function (t) {
    const store = createStore({ prop: false })
    const patch = { prop: true, newprop: true }
    store.subscribe(
        () => {},
        () => false
    )
    store.subscribe(
        () => {},
        () => true
    )
    const output = store.applyPatch(patch)
    t.is(output.length, 2)
    t.deepEqual(output[0].patch, {})
    t.deepEqual(output[1].patch, patch)
    t.deepEqual(output[0].mutations.length, 0)
    t.deepEqual(output[1].mutations.length, 2)
})

test('filtered patches by createPatchAndUnpatchFromMutations must be the same as original patch', function (t) {
    const store = createStore({ params: { a: 1, b: 2 } })
    const patch = { params: TYPE.Replace({ c: 3 }) }
    store.subscribe(
        () => {},
        () => false
    )
    store.subscribe(
        () => {},
        () => true
    )
    const output = store.applyPatch(patch)
    t.is(output.length, 2)
    t.deepEqual(output[0].patch, {})
    t.deepEqual(output[1].patch, patch)
})
