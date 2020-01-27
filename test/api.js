import test from 'ava'
import dop from '../'
import { createNode } from '../'

const exported = [
    'version',
    'factory',
    'merge',
    'encode',
    'decode',
    'applyPatch',
    'createNode',
    'createStore',
    'addType',
    'TYPE'
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
    const { remote_functions } = node
    const isRemoteFunction = f => remote_functions.has(f)
    const callClient = node.open()
    t.true(isRemoteFunction(callClient))
    t.false(isRemoteFunction(() => {}))
    t.false(isRemoteFunction('other'))
})
