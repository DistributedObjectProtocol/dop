import test from 'ava'
import { TYPE } from '../'
import { testBasic, testUnpatch } from './utils'

test('Valid type', function(t) {
    const patch = { convert: TYPE.Inner({ 0: 'world' }) }
    const expected = { convert: { $i: { 0: 'world' } } }
    testBasic(t, patch, expected)
})

test('Sub Types', function(t) {
    const patch = { convert: TYPE.Inner({ 0: { a: TYPE.Delete() } }) }
    const expected = { convert: { $i: { 0: { a: { $d: 0 } } } } }
    testBasic(t, patch, expected)
})

test('Escape', function(t) {
    const patch = { escape: { $i: { 1: 2 } } }
    const expected = { escape: { $escape: { $i: { 1: 2 } } } }
    testBasic(t, patch, expected)
})

test('Ignore', function(t) {
    const patch = { ignore: { $i: [0, 1] } }
    const expected = { ignore: { $i: [0, 1] } }
    testBasic(t, patch, expected)
})

test('Inner only accepts plain objects', function(t) {
    try {
        TYPE.Inner([])
    } catch (e) {
        t.is(typeof e, 'string')
    }
})

test('API', function(t) {
    const target = { array: ['a'] }
    const patch = { array: TYPE.Inner({ 1: 'b' }) }
    const expected = { array: ['a', 'b'] }
    const { unpatch, result, mutations } = testUnpatch(
        t,
        target,
        patch,
        expected
    )
    t.is(mutations.length, 1)
    t.is(result.array, target.array)
    t.true(unpatch.array instanceof TYPE.Inner)
    t.deepEqual(unpatch.array.patch, { '1': undefined, length: 1 })
})

test('Patching a non array must do nothing', function(t) {
    const target = { array: 1234 }
    const patch = { array: TYPE.Inner({ 0: 'b' }) }
    const expected = { array: 1234 }
    testUnpatch(t, target, patch, expected)
    const { mutations } = testUnpatch(t, target, patch, expected)
    t.is(mutations.length, 0)
})

test('Editing top level', function(t) {
    const target = { array: ['a', 'b', 'c'] }
    const patch = { array: TYPE.Inner({ 0: 'A', 3: 'd' }) }
    const expected = { array: ['A', 'b', 'c', 'd'] }
    testUnpatch(t, target, patch, expected)
})

test('Editing subobjects', function(t) {
    const target = { array: [{ a: false }] }
    const patch = { array: TYPE.Inner({ 0: { a: true } }) }
    const expected = { array: [{ a: true }] }
    testUnpatch(t, target, patch, expected)
})

test('Extending subobjects', function(t) {
    const target = { array: [{ a: true }] }
    const patch = { array: TYPE.Inner({ 0: { b: true } }) }
    const expected = { array: [{ a: true, b: true }] }
    testUnpatch(t, target, patch, expected)
})

test('Deleting subobjects', function(t) {
    const target = { array: [{ a: true }] }
    const patch = { array: TYPE.Inner({ 0: { a: TYPE.Delete() } }) }
    const expected = { array: [{}] }
    testUnpatch(t, target, patch, expected)
})
