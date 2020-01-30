import test from 'ava'
import { addType } from '../'
import Splice from '../src/types/Splice'
import { testBasic, testUnpatch } from './utils'

addType(Splice)

test('Valid type', function(t) {
    const patch = { convert: Splice(0, 1, 'world') }
    const expected = { convert: { $s: [0, 1, 'world'] } }
    testBasic(t, patch, expected)
})

test('Escape', function(t) {
    const patch = { escape: { $s: [0, 1] } }
    const expected = { escape: { $escape: { $s: [0, 1] } } }
    testBasic(t, patch, expected)
})

test('Ignore', function(t) {
    const patch = { ignore: { $s: { a: 2 } } }
    const expected = { ignore: { $s: { a: 2 } } }
    testBasic(t, patch, expected)
})

test('removing and adding', function(t) {
    const target = { array: ['a', 'b', 'c'] }
    const patch = { array: Splice(0, 1, 'd') }
    const expected = { array: ['d', 'b', 'c'] }
    testUnpatch(t, target, patch, expected)
})

test('removing', function(t) {
    const target = { array: ['a', 'b', 'c'] }
    const patch = { array: Splice(0, 1) }
    const expected = { array: ['b', 'c'] }
    testUnpatch(t, target, patch, expected)
})

test('removing middle', function(t) {
    const target = { array: ['a', 'b', 'c'] }
    const patch = { array: Splice(1, 1) }
    const expected = { array: ['a', 'c'] }
    testUnpatch(t, target, patch, expected)
})

test('adding', function(t) {
    const target = { array: ['a', 'b', 'c'] }
    const patch = { array: Splice(3, 0, 'd') }
    const expected = { array: ['a', 'b', 'c', 'd'] }
    testUnpatch(t, target, patch, expected)
})

// test('negative (not supported yet)', function(t) {
//     const target = { array: ['angel', 'clown', 'mandarin', 'sturgeon'] }
//     const patch = { array: Splice(-2, 1) }
//     const expected = { array: ['angel', 'clown', 'sturgeon'] }
//     testUnpatch(t, target, patch, expected, false)
// })
