import test from 'ava'
import { DJSON, Delete } from '../'

function testBasic(t, patch, expected, recursive = true) {
    const string = DJSON.stringify(patch)
    const jsonparsed = JSON.parse(string)
    const parsed = DJSON.parse(string)
    t.deepEqual(expected, jsonparsed)
    t.deepEqual(patch, parsed)
}

test('Valid type', function(t) {
    const patch = { convert: Delete() }
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
