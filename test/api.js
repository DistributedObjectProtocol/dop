import test from 'ava'
import dop from '../src'
import { createNode } from '../src'

const exported = {
    version: true,
    factory: true,
    merge: true,
    encode: true,
    decode: true,
    producePatch: true,
    applyPatch: true,
    createNode: true,
    createStore: true,
    TYPE: true,
    addType: true,
}

test('Checking exported params', function (t) {
    const keys = {}
    Object.keys(dop).forEach((key) => {
        keys[key] = true
    })
    t.deepEqual(keys, exported)
})

test('Checking factory', function (t) {
    const dopcopy = dop.factory()
    t.deepEqual(Object.keys(dop), Object.keys(dopcopy))
    t.is(dop.factory, dopcopy.factory)
    t.not(dop.createNode, dopcopy.createNode)
})

test('Types must be same instance when creating new dop', function (t) {
    const dopcopy = dop.factory()
    t.is(dop.TYPE.Inner, dopcopy.TYPE.Inner)
    t.is(dop.TYPE.Replace, dopcopy.TYPE.Replace)
    t.is(dop.TYPE.Splice, dopcopy.TYPE.Splice)
})
