import test from 'ava'
import { TYPE, applyPatch } from '../src'
import { testEncodeDecode, testPatchUnpatch } from './utils'

test('Valid type', function (t) {
    const patch = { convert: TYPE.Swap(0, 1) }
    const expected = { convert: { $w: [0, 1] } }
    testEncodeDecode(t, patch, expected)
})

test('Escape', function (t) {
    const patch = { escape: { $w: [0, 1] } }
    const expected = { escape: { $escape: { $w: [0, 1] } } }
    testEncodeDecode(t, patch, expected)
})

test('Ignore', function (t) {
    const patch = { ignore: { $w: { a: 2 } } }
    const expected = { ignore: { $w: { a: 2 } } }
    testEncodeDecode(t, patch, expected)
})

test('API', function (t) {
    const target = { array: ['a', 'b'] }
    const patch = { array: TYPE.Swap(0, 1) }
    const expected = { array: ['b', 'a'] }
    const { unpatch, result, mutations } = testPatchUnpatch({
        t,
        target,
        patch,
        expected,
    })
    t.is(mutations.length, 1)
    t.is(result.array, target.array)
    t.true(unpatch.array instanceof TYPE.Swap)
    t.deepEqual(unpatch.array.args, [1, 0])
})

test('Patching a non array must do nothing', function (t) {
    const target = { array: 1234 }
    const patch = { array: TYPE.Swap(0, 1) }
    const expected = { array: 1234 }
    const { mutations } = testPatchUnpatch({ t, target, patch, expected })
    t.is(mutations.length, 0)
})

test('Multiple mutations', function (t) {
    const target = { array: ['a', 'b', 'c', 'd'] }
    const patch = { array: TYPE.Swap(0, 2, 1, 3) }
    const expected = { array: ['c', 'd', 'a', 'b'] }
    testPatchUnpatch({ t, target, patch, expected })
})

test('Combining swaps', function (t) {
    const target = { array: ['a', 'b', 'c'] }
    const patch = { array: TYPE.Swap(0, 1, 2, 1) }
    const expected = { array: ['b', 'c', 'a'] }
    testPatchUnpatch({ t, target, patch, expected })
})

test('Repeating swaps', function (t) {
    const target = { array: ['a', 'b'] }
    const patch = { array: TYPE.Swap(0, 1, 1, 0) }
    const expected = { array: ['a', 'b'] }
    testPatchUnpatch({ t, target, patch, expected })
})

test('Swaping do not mutate inner objects, must be the same instances', function (t) {
    const target = { array: [{ a: 1 }, { b: 2 }] }
    const a = target.array[0]
    const b = target.array[1]
    const patch = { array: TYPE.Swap(0, 1) }
    const expected = { array: [{ b: 2 }, { a: 1 }] }
    testPatchUnpatch({ t, target, patch, expected, reverse: false })
    t.is(a, target.array[1])
    t.is(b, target.array[0])
})
