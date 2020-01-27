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
    const expected = { convert: { $d: 0 } }
    testBasic(t, patch, expected)
})

test('Escape', function(t) {
    const patch = { escape: { $d: 0 } }
    const expected = { escape: { $escape: { $d: 0 } } }
    testBasic(t, patch, expected)
})

test('Ignore', function(t) {
    const patch = { ignore: { $d: 0, $other: 0 } }
    const expected = { ignore: { $d: 0, $other: 0 } }
    testBasic(t, patch, expected)
})

test('$escaping', function(t) {
    const patch = {
        convert: DELETE,
        escape: { $d: 0 }
    }
    const expected = {
        convert: { $d: 0 },
        escape: { $escape: { $d: 0 } }
    }
    testBasic(t, patch, expected)
})

test('This should not be escaped because $d has another valid prop', function(t) {
    const patch = {
        convert: DELETE,
        ignored: { $d: 0, $escape: 0 }
    }
    const expected = {
        convert: { $d: 0 },
        ignored: { $d: 0, $escape: 0 }
    }
    testBasic(t, patch, expected)
})

test('This should not be escaped because $d has another valid prop 2', function(t) {
    const patch = {
        convert: DELETE,
        escape: { $escape: 0, $d: DELETE }
    }
    const expected = {
        convert: { $d: 0 },
        escape: { $escape: 0, $d: { $d: 0 } }
    }
    testBasic(t, patch, expected)
})

test('This should not be escaped because $d is not an number', function(t) {
    const patch = {
        convert: DELETE,
        escape: { $d: 'string' }
    }
    const expected = {
        convert: { $d: 0 },
        escape: { $d: 'string' }
    }
    testBasic(t, patch, expected) // testBasic(t, patch, expected) // Not sure why EJSON is still escaping strings
})

test('Invalid format, should not be escaped', function(t) {
    const patch = { convert: { $d: 1 } }
    const expected = { convert: { $d: 1 } }
    testBasic(t, patch, expected)
})

test('Decode alone', function(t) {
    const patch = {
        convert: { $d: 0 },
        string: { $d: 'string' },
        escape: { $escape: { $d: 0 } },
        ignore: { $escape: { $d: 0 }, two: { $d: 0 } }
    }
    const expected = {
        convert: DELETE,
        string: { $d: 'string' },
        escape: { $d: 0 },
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
