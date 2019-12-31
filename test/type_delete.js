import test from 'ava'
import { applyPatch, encode, decode, TYPE } from '../'
import { getNewPlain } from '../src/util/get'
import { isPlainObject } from '../src/util/is'
const DELETE = TYPE.Delete()

function testBasic(t, patch, expected, recursive = true) {
    const encoded = encode(patch)
    const decoded = decode(encoded)
    t.deepEqual(expected, encoded)
    t.deepEqual(patch, decoded)
    t.not(patch, encoded)
    t.not(encoded, decoded)
}

function testUnpatch(t, target, patch, expected, reverse = true) {
    const cloned = getNewPlain(target)
    const output = applyPatch(target, patch)
    const { unpatch, mutations, result } = output
    // console.log(result)
    if (isPlainObject(result)) {
        // t.is(target, result)
    }
    target = result
    t.deepEqual(target, expected)
    if (reverse) {
        const output2 = applyPatch(target, unpatch)
        t.deepEqual(output2.result, cloned)
    }
    return { unpatch, mutations }
}

test('Valid type', function(t) {
    const patch = { convert: DELETE }
    const expected = { convert: { $delete: 0 } }
    testBasic(t, patch, expected)
})

test('Escape', function(t) {
    const patch = { escape: { $delete: 0 } }
    const expected = { escape: { $escape: { $delete: 0 } } }
    testBasic(t, patch, expected)
})

test('Ignore', function(t) {
    const patch = { ignore: { $delete: 0, $other: 0 } }
    const expected = { ignore: { $delete: 0, $other: 0 } }
    testBasic(t, patch, expected)
})

test('$escaping', function(t) {
    const patch = {
        convert: DELETE,
        escape: { $delete: 0 }
    }
    const expected = {
        convert: { $delete: 0 },
        escape: { $escape: { $delete: 0 } }
    }
    testBasic(t, patch, expected)
})

test('This should not be escaped because $delete has another valid prop', function(t) {
    const patch = {
        convert: DELETE,
        ignored: { $delete: 0, $escape: 0 }
    }
    const expected = {
        convert: { $delete: 0 },
        ignored: { $delete: 0, $escape: 0 }
    }
    testBasic(t, patch, expected)
})

test('This should not be escaped because $delete has another valid prop 2', function(t) {
    const patch = {
        convert: DELETE,
        escape: { $escape: 0, $delete: DELETE }
    }
    const expected = {
        convert: { $delete: 0 },
        escape: { $escape: 0, $delete: { $delete: 0 } }
    }
    testBasic(t, patch, expected)
})

test('This should not be escaped because $delete is not an number', function(t) {
    const patch = {
        convert: DELETE,
        escape: { $delete: 'string' }
    }
    const expected = {
        convert: { $delete: 0 },
        escape: { $delete: 'string' }
    }
    testBasic(t, patch, expected) // testBasic(t, patch, expected) // Not sure why EJSON is still escaping strings
})

test('Invalid format, should not be escaped', function(t) {
    const patch = { convert: { $delete: 1 } }
    const expected = { convert: { $delete: 1 } }
    testBasic(t, patch, expected)
})

test('Decode alone', function(t) {
    const patch = {
        convert: { $delete: 0 },
        string: { $delete: 'string' },
        escape: { $escape: { $delete: 0 } },
        ignore: { $escape: { $delete: 0 }, two: { $delete: 0 } }
    }
    const expected = {
        convert: DELETE,
        string: { $delete: 'string' },
        escape: { $delete: 0 },
        ignore: { $escape: DELETE, two: DELETE }
    }
    t.deepEqual(decode(patch), expected)
})

test('patch', function(t) {
    const target = { value: 12345 }
    const patch = { value: TYPE.Delete() }
    const expected = {}

    testUnpatch(t, target, patch, expected)
})
