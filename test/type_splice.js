import test from 'ava'
import { applyPatch, encode, decode, TYPE } from '../'
import { getNewPlain } from '../src/util/get'
import { isPlainObject } from '../src/util/is'

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
    console.log({ result, cloned })
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

test('patch', function(t) {
    const target = { array: ['a', 'b', 'c'] }
    const patch = { array: TYPE.Splice(0, 1, 'd') }
    const expected = { array: ['d', 'b', 'c'] }
    testUnpatch(t, target, patch, expected)
})
