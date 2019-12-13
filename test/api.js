import test from 'ava'
import dop from '../'
import { createNode, isRemoteFunction } from '../'

const exported = [
    'factory',
    'merge',
    'applyPatch',
    'createNode',
    'createStore',
    'DJSON',
    'isRemoteFunction'
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

test('isRemoteFunction', async t => {
    const node = createNode()
    const callClient = node.open()
    t.is(callClient.name, '~dopRemoteFunction')
    t.true(isRemoteFunction(callClient))
    t.false(isRemoteFunction(() => {}))
    t.false(isRemoteFunction('other'))
})
