import test from 'ava'
import { applyPatch } from '../src'
import { TYPE } from '../src'
import { testEncodeDecode, testPatchUnpatch } from './utils'

test('Valid type', function (t) {
    const patch = { convert: TYPE.Multi(0, 1) }
    const expected = { convert: { $m: [0, 1] } }
    testEncodeDecode(t, patch, expected)
})

test('Inner encode', function (t) {
    const patch = { convert: TYPE.Multi(0, 1, TYPE.Delete()) }
    const expected = { convert: { $m: [0, 1, { $d: 0 }] } }
    const { encoded, decoded } = testEncodeDecode(t, patch, expected)
})

test('Escape', function (t) {
    const patch = { escape: { $m: [0, 1] } }
    const expected = { escape: { $escape: { $m: [0, 1] } } }
    testEncodeDecode(t, patch, expected)
})

test('Ignore', function (t) {
    const patch = { ignore: { $m: { a: 2 } } }
    const expected = { ignore: { $m: { a: 2 } } }
    testEncodeDecode(t, patch, expected)
})

test('API', function (t) {
    const target = { array: ['a', 'b'] }
    const array = target.array
    const patch = {
        array: TYPE.Multi(
            TYPE.Splice(0, 0, 'c'),
            TYPE.Swap(0, 2),
            TYPE.Swap(1, 2)
        ),
    }
    const expected = { array: ['b', 'c', 'a'] }
    const { unpatch, result, mutations } = testPatchUnpatch({
        t,
        target,
        patch,
        expected,
    })
    t.is(mutations.length, 1)
    t.is(result.array, target.array)
    t.is(array, target.array)
    t.true(unpatch.array instanceof TYPE.Multi)
    t.is(unpatch.array.values.length, 3)
})

test('Deleting', function (t) {
    const target = { array: false }
    const patch = { array: TYPE.Multi(TYPE.Delete()) }
    const expected = {}
    testPatchUnpatch({ t, target, patch, expected })
})

test('Adding array and swaping', function (t) {
    const target = { array: 1234 }
    const patch = { array: TYPE.Multi([1, 2], TYPE.Swap(0, 1)) }
    const expected = { array: [2, 1] }
    testPatchUnpatch({ t, target, patch, expected })
})

test('Undefined before applying Multi', function (t) {
    const target = {}
    const patch = { array: TYPE.Multi(true) }
    const expected = { array: true }
    testPatchUnpatch({ t, target, patch, expected })
})
