import test from 'ava'
import { encode, decode, TYPE } from '../'

const DELETE = TYPE.Delete()

function testBasic(t, patch, expected, recursive = true) {
    const encoded = encode(patch)
    const decoded = decode(encoded)
    t.deepEqual(expected, encoded)
    t.deepEqual(patch, decoded)
    t.not(patch, encoded)
    t.not(encoded, decoded)
}

test('Valid type', function(t) {
    const patch = { convert: DELETE }
    const expected = { convert: { $delete: 1 } }
    testBasic(t, patch, expected)
})

test('Escape', function(t) {
    const patch = { escape: { $delete: 1 } }
    const expected = { escape: { $escape: { $delete: 1 } } }
    testBasic(t, patch, expected)
})

test('Ignore', function(t) {
    const patch = { ignore: { $delete: 1, $other: 1 } }
    const expected = { ignore: { $delete: 1, $other: 1 } }
    testBasic(t, patch, expected)
})

test('$escaping', function(t) {
    const patch = {
        convert: DELETE,
        escape: { $delete: 1 }
    }
    const expected = {
        convert: { $delete: 1 },
        escape: { $escape: { $delete: 1 } }
    }
    testBasic(t, patch, expected)
})

test('This should not be escaped because $delete has another valid prop', function(t) {
    const patch = {
        convert: DELETE,
        ignored: { $delete: 1, $escape: 1 }
    }
    const expected = {
        convert: { $delete: 1 },
        ignored: { $delete: 1, $escape: 1 }
    }
    testBasic(t, patch, expected)
})

test('This should not be escaped because $delete has another valid prop 2', function(t) {
    const patch = {
        convert: DELETE,
        escape: { $escape: 1, $delete: DELETE }
    }
    const expected = {
        convert: { $delete: 1 },
        escape: { $escape: 1, $delete: { $delete: 1 } }
    }
    testBasic(t, patch, expected)
})

test('This should not be escaped because $delete is not an number', function(t) {
    const patch = {
        convert: DELETE,
        escape: { $delete: 'string' }
    }
    const expected = {
        convert: { $delete: 1 },
        escape: { $delete: 'string' }
    }
    testBasic(t, patch, expected) // testBasic(t, patch, expected) // Not sure why EJSON is still escaping strings
})

test('Invalid format, should not be escaped', function(t) {
    const patch = { convert: { $delete: 0 } }
    const expected = { convert: { $delete: 0 } }
    testBasic(t, patch, expected)
})

test('Decode alone', function(t) {
    const patch = {
        convert: { $delete: 1 },
        string: { $delete: 'string' },
        escape: { $escape: { $delete: 1 } },
        ignore: { $escape: { $delete: 1 }, two: { $delete: 1 } }
    }
    const expected = {
        convert: DELETE,
        string: { $delete: 'string' },
        escape: { $delete: 1 },
        ignore: { $escape: DELETE, two: DELETE }
    }
    t.deepEqual(decode(patch), expected)
})
