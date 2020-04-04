import test from 'ava'
import { TYPE } from '../'
import { testEncodeDecode, testPatchUnpatch } from './utils'

test('Valid type', function (t) {
    const patch = { convert: TYPE.Inner({ 0: 'world' }) }
    const expected = { convert: { $i: { 0: 'world' } } }
    testEncodeDecode(t, patch, expected)
})

test('Sub Delete', function (t) {
    const patch = { convert: TYPE.Inner({ 0: { a: TYPE.Delete() } }) }
    const expected = { convert: { $i: { 0: { a: { $d: 0 } } } } }
    testEncodeDecode(t, patch, expected)
})

test('Sub Inner', function (t) {
    const patch = { convert: TYPE.Inner({ 0: { a: TYPE.Inner({ 0: 'b' }) } }) }
    const expected = { convert: { $i: { 0: { a: { $i: { 0: 'b' } } } } } }
    testEncodeDecode(t, patch, expected)
})

test('Escape', function (t) {
    const patch = { escape: { $i: { 1: 2 } } }
    const expected = { escape: { $escape: { $i: { 1: 2 } } } }
    testEncodeDecode(t, patch, expected)
})

test('Ignore', function (t) {
    const patch = { ignore: { $i: [0, 1] } }
    const expected = { ignore: { $i: [0, 1] } }
    testEncodeDecode(t, patch, expected)
})

test('Inner only accepts plain objects', function (t) {
    try {
        TYPE.Inner([])
    } catch (e) {
        t.is(typeof e, 'string')
    }
})

test('API', function (t) {
    const target = { array: ['a'] }
    const patch = { array: TYPE.Inner({ 1: 'b' }) }
    const expected = { array: ['a', 'b'] }
    const { unpatch, result, mutations } = testPatchUnpatch(
        t,
        target,
        patch,
        expected
    )
    t.is(mutations.length, 1)
    t.is(result.array, target.array)
    t.true(unpatch.array instanceof TYPE.Inner)
    t.deepEqual(unpatch.array.patch, { '1': TYPE.Delete(), length: 1 })
})

test('Patching a non array must do nothing', function (t) {
    const target = { array: 1234 }
    const patch = { array: TYPE.Inner({ 0: 'b' }) }
    const expected = { array: 1234 }
    testPatchUnpatch(t, target, patch, expected)
    const { mutations } = testPatchUnpatch(t, target, patch, expected)
    t.is(mutations.length, 0)
})

test('Editing top level', function (t) {
    const target = { array: ['a', 'b', 'c'] }
    const patch = { array: TYPE.Inner({ 0: 'A', 3: 'd' }) }
    const expected = { array: ['A', 'b', 'c', 'd'] }
    testPatchUnpatch(t, target, patch, expected)
})

test('Editing subobjects', function (t) {
    const target = { array: [{ a: false }] }
    const patch = { array: TYPE.Inner({ 0: { a: true } }) }
    const expected = { array: [{ a: true }] }
    testPatchUnpatch(t, target, patch, expected)
})

test('Deleting subobject', function (t) {
    const target = { array: [{ a: true }] }
    const patch = { array: TYPE.Inner({ 0: { a: TYPE.Delete() } }) }
    const expected = { array: [{}] }
    testPatchUnpatch(t, target, patch, expected)
})

test('Updating sub-subarray', function (t) {
    const target = { array: [{ subarray: ['a'] }] }
    const array = target.array
    const subarray = target.array[0].subarray
    const patch = {
        array: TYPE.Inner({ 0: { subarray: TYPE.Inner({ 0: 'b' }) } }),
    }
    const expected = { array: [{ subarray: ['b'] }] }
    testPatchUnpatch(t, target, patch, expected)
    t.is(array, target.array)
    t.is(subarray, target.array[0].subarray)
})

test('Replacing sub-subarray', function (t) {
    const target = { array: [{ subarray: ['a'] }] }
    const array = target.array
    const subarray = target.array[0].subarray
    const patch = {
        array: TYPE.Inner({ 0: { subarray: ['b', 'c'] } }),
    }
    const expected = { array: [{ subarray: ['b', 'c'] }] }
    testPatchUnpatch(t, target, patch, expected)
    t.is(array, target.array)
    t.not(subarray, target.array[0].subarray)
})

test('Pushing subobjects', function (t) {
    const target = ['A']
    const patch = TYPE.Inner({ 2: { a: true } })
    const expected = ['A', undefined, { a: true }]
    testPatchUnpatch(t, target, patch, expected)
})

test('Editing subobject and creating a new one', function (t) {
    const target = [{ a: false }]
    const patch = TYPE.Inner({ 0: { a: true }, 1: { b: true } })
    const expected = [{ a: true }, { b: true }]
    testPatchUnpatch(t, target, patch, expected)
    console.log(target)
})

test('Encoding unpatch', function (t) {
    const target = [{ a: false }]
    const patch = TYPE.Inner({ 0: { a: true }, 1: { b: true } })
    const expected = [{ a: true }, { b: true }]
    const { unpatch } = testPatchUnpatch(t, target, patch, expected)
    // console.log(unpatch.patch[1])
    testEncodeDecode(t, unpatch.patch, {
        '0': { a: false },
        '1': { $d: 0 },
        length: 1,
    })
})

test('Mutating array of array with a splice', function (t) {
    const target = { array: [{ array2: [{ array3: [1, 2] }] }] }
    const instancearray = target.array[0].array2[0].array3
    const expected = { array: [{ array2: [{ array3: [1, 2, 3] }] }] }
    const patch = {
        array: TYPE.Inner({
            0: { array2: TYPE.Inner({ 0: { array3: TYPE.Splice(2, 0, 3) } }) },
        }),
    }
    testPatchUnpatch(t, target, patch, expected)
    t.is(instancearray, target.array[0].array2[0].array3)
})
