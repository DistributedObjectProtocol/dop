import test from 'ava'
import { applyPatch, encode, decode, TYPE } from '../'
import { getNewPlain } from '../src/util/get'
import { isPlainObject } from '../src/util/is'

function testBasic(t, patch, expected) {
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
    if (isPlainObject(result)) {
        t.is(target, result)
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
    const patch = { convert: TYPE.Splice(0, 1, 'world') }
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
    const patch = { array: TYPE.Splice(0, 1, 'd') }
    const expected = { array: ['d', 'b', 'c'] }
    testUnpatch(t, target, patch, expected)
})

test('removing', function(t) {
    const target = { array: ['a', 'b', 'c'] }
    const patch = { array: TYPE.Splice(0, 1) }
    const expected = { array: ['b', 'c'] }
    testUnpatch(t, target, patch, expected)
})

test('removing middle', function(t) {
    const target = { array: ['a', 'b', 'c'] }
    const patch = { array: TYPE.Splice(1, 1) }
    const expected = { array: ['a', 'c'] }
    testUnpatch(t, target, patch, expected)
})

test('adding', function(t) {
    const target = { array: ['a', 'b', 'c'] }
    const patch = { array: TYPE.Splice(3, 0, 'd') }
    const expected = { array: ['a', 'b', 'c', 'd'] }
    testUnpatch(t, target, patch, expected)
})

// test('negative (not supported yet)', function(t) {
//     const target = { array: ['angel', 'clown', 'mandarin', 'sturgeon'] }
//     const patch = { array: TYPE.Splice(-2, 1) }
//     const expected = { array: ['angel', 'clown', 'sturgeon'] }
//     testUnpatch(t, target, patch, expected, false)
// })
