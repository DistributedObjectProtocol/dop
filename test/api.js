import test from 'ava'
import dop from '../'

const exported = [
    'factory',
    'merge',
    'applyPatch',
    'createNode',
    'createStore',
    'DJSON'
]

test('Checking exported params', function(t) {
    t.deepEqual(Object.keys(dop), exported)
})

test('Checking factory', function(t) {
    const dopcopy = dop.factory()
    t.deepEqual(Object.keys(dop), Object.keys(dopcopy))
    t.is(dop.factory, dopcopy.factory)
    t.not(dop.createNode, dopcopy.createNode)
})
