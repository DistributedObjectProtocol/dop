import test from 'ava'
import { encode, decode, TYPE } from '../'

function testBasic(t, patch, expected, recursive = true) {
    const encoded = encode(patch)
    const decoded = decode(encoded)
    t.not(patch, encoded)
    t.not(encoded, decoded)
    t.deepEqual(expected, encoded)
    t.deepEqual(patch, decoded)
}

test('Valid type', function(t) {
    const patch = { convert: TYPE.Delete() }
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
