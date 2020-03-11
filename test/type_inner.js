import test from 'ava'
import { addType, applyPatch } from '../'
import Inner from '../src/types/Inner'
import { testBasic, testUnpatch } from './utils'

addType(Inner)

// test('Valid type', function(t) {
//     const patch = { convert: Splice(0, 1, 'world') }
//     const expected = { convert: { $s: [0, 1, 'world'] } }
//     testBasic(t, patch, expected)
// })

// test('Escape', function(t) {
//     const patch = { escape: { $s: [0, 1] } }
//     const expected = { escape: { $escape: { $s: [0, 1] } } }
//     testBasic(t, patch, expected)
// })

// test('Ignore', function(t) {
//     const patch = { ignore: { $s: { a: 2 } } }
//     const expected = { ignore: { $s: { a: 2 } } }
//     testBasic(t, patch, expected)
// })

test('basic', function(t) {
    const target = { array: ['a', 'b', 'c'] }
    const patch = { array: Inner({ 2: 'd' }) }
    const expected = { array: ['a', 'b', 'c', 'd'] }
    testUnpatch(t, target, patch, expected)
})
