import test from 'ava'
import { applyPatch } from '../'
import { TYPE } from '../'
import { testEncodeDecode, testPatchUnpatch } from './utils'

test('Valid type', function(t) {
    const patch = { convert: TYPE.Splice(0, 1, 'world') }
    const expected = { convert: { $s: [0, 1, 'world'] } }
    testEncodeDecode(t, patch, expected)
})

test('Escape', function(t) {
    const patch = { escape: { $s: [0, 1] } }
    const expected = { escape: { $escape: { $s: [0, 1] } } }
    testEncodeDecode(t, patch, expected)
})

test('Ignore', function(t) {
    const patch = { ignore: { $s: { a: 2 } } }
    const expected = { ignore: { $s: { a: 2 } } }
    testEncodeDecode(t, patch, expected)
})

test('API', function(t) {
    const target = { array: ['a'] }
    const patch = { array: TYPE.Splice(1, 0, 'b') }
    const expected = { array: ['a', 'b'] }
    const { unpatch, result, mutations } = testPatchUnpatch(
        t,
        target,
        patch,
        expected
    )
    t.is(mutations.length, 1)
    t.is(result.array, target.array)
    t.true(unpatch.array instanceof TYPE.Splice)
    t.deepEqual(unpatch.array.args, [1, 1])
})

test('Patching a non array must do nothing', function(t) {
    const target = { array: 1234 }
    const patch = { array: TYPE.Splice({ 0: 'b' }) }
    const expected = { array: 1234 }
    const { mutations } = testPatchUnpatch(t, target, patch, expected)
    t.is(mutations.length, 0)
})

test('removing and adding', function(t) {
    const target = { array: ['a', 'b', 'c'] }
    const patch = { array: TYPE.Splice(0, 1, 'd') }
    const expected = { array: ['d', 'b', 'c'] }
    const { mutations } = testPatchUnpatch(t, target, patch, expected)
    t.is(mutations.length, 1)
})

test('removing', function(t) {
    const target = { array: ['a', 'b', 'c'] }
    const patch = { array: TYPE.Splice(0, 1) }
    const expected = { array: ['b', 'c'] }
    testPatchUnpatch(t, target, patch, expected)
})

test('removing middle', function(t) {
    const target = { array: ['a', 'b', 'c'] }
    const patch = { array: TYPE.Splice(1, 1) }
    const expected = { array: ['a', 'c'] }
    testPatchUnpatch(t, target, patch, expected)
})

test('adding', function(t) {
    const target = { array: ['a', 'b', 'c'] }
    const patch = { array: TYPE.Splice(3, 0, 'd') }
    const expected = { array: ['a', 'b', 'c', 'd'] }
    testPatchUnpatch(t, target, patch, expected)
})

test('negative', function(t) {
    const target = { array: ['angel', 'clown', 'mandarin', 'sturgeon'] }
    const patch = { array: TYPE.Splice(-2, 1) }
    const expected = { array: ['angel', 'clown', 'sturgeon'] }
    testPatchUnpatch(t, target, patch, expected, false)
})

function testAgainstNative(t, original, params) {
    const native = original.slice(0)
    Array.prototype.splice.apply(native, params)

    const target = original.slice(0)
    const patch = TYPE.Splice.apply(null, params)
    // console.log({ original, params })
    const { unpatch } = applyPatch(target, patch)
    t.deepEqual(target, native)
    // console.log({ result: target })
    applyPatch(target, unpatch)
    t.deepEqual(target, original)
    // console.log({ result: target })
}

test('1/ vs Array.splice', function(t) {
    const original = ['angel', 'clown', 'mandarin', 'sturgeon']
    const params = [0, 0]
    testAgainstNative(t, original, params)
})

test('2/ vs Array.splice', function(t) {
    const original = ['angel', 'clown', 'mandarin', 'sturgeon']
    const params = [0, 1]
    testAgainstNative(t, original, params)
})

test('3/ vs Array.splice', function(t) {
    const original = ['angel', 'clown', 'mandarin', 'sturgeon']
    const params = [0, -1]
    testAgainstNative(t, original, params)
})

test('4/ vs Array.splice', function(t) {
    const original = ['angel', 'clown', 'mandarin', 'sturgeon']
    const params = [1, 0]
    testAgainstNative(t, original, params)
})
test('5/ vs Array.splice', function(t) {
    const original = ['angel', 'clown', 'mandarin', 'sturgeon']
    const params = [1, 1]
    testAgainstNative(t, original, params)
})
test('6/ vs Array.splice', function(t) {
    const original = ['angel', 'clown', 'mandarin', 'sturgeon']
    const params = [1, -1]
    testAgainstNative(t, original, params)
})

test('7/ vs Array.splice', function(t) {
    const original = ['angel', 'clown', 'mandarin', 'sturgeon']
    const params = [-1, 0]
    testAgainstNative(t, original, params)
})

test('8/ vs Array.splice', function(t) {
    const original = ['angel', 'clown', 'mandarin', 'sturgeon']
    const params = [-1, 1]
    testAgainstNative(t, original, params)
})

test('9/ vs Array.splice', function(t) {
    const original = ['angel', 'clown', 'mandarin', 'sturgeon']
    const params = [-1, -1]
    testAgainstNative(t, original, params)
})

test('10/ vs Array.splice', function(t) {
    const original = ['angel', 'clown', 'mandarin', 'sturgeon']
    const params = [0, 0, 'last']
    testAgainstNative(t, original, params)
})

test('11/ vs Array.splice', function(t) {
    const original = ['angel', 'clown', 'mandarin', 'sturgeon']
    const params = [0, 1, 'last']
    testAgainstNative(t, original, params)
})

test('12/ vs Array.splice', function(t) {
    const original = ['angel', 'clown', 'mandarin', 'sturgeon']
    const params = [0, -1, 'last']
    testAgainstNative(t, original, params)
})

test('13/ vs Array.splice', function(t) {
    const original = ['angel', 'clown', 'mandarin', 'sturgeon']
    const params = [1, 0, 'last']
    testAgainstNative(t, original, params)
})
test('14/ vs Array.splice', function(t) {
    const original = ['angel', 'clown', 'mandarin', 'sturgeon']
    const params = [1, 1, 'last']
    testAgainstNative(t, original, params)
})
test('15/ vs Array.splice', function(t) {
    const original = ['angel', 'clown', 'mandarin', 'sturgeon']
    const params = [1, -1, 'last']
    testAgainstNative(t, original, params)
})

test('16/ vs Array.splice', function(t) {
    const original = ['angel', 'clown', 'mandarin', 'sturgeon']
    const params = [-1, 0, 'last']
    testAgainstNative(t, original, params)
})

test('17/ vs Array.splice', function(t) {
    const original = ['angel', 'clown', 'mandarin', 'sturgeon']
    const params = [-1, 1, 'last']
    testAgainstNative(t, original, params)
})

test('18/ vs Array.splice', function(t) {
    const original = ['angel', 'clown', 'mandarin', 'sturgeon']
    const params = [-1, -1, 'last']
    testAgainstNative(t, original, params)
})

test('19/ vs Array.splice', function(t) {
    const original = ['angel', 'clown', 'mandarin', 'sturgeon']
    const params = [-2, 0, 'last', 'prelast']
    testAgainstNative(t, original, params)
})

test('20/ vs Array.splice', function(t) {
    const original = ['angel', 'clown', 'mandarin', 'sturgeon']
    const params = [-2, 1, 'last', 'prelast']
    testAgainstNative(t, original, params)
})

test('21/ vs Array.splice', function(t) {
    const original = ['angel', 'clown', 'mandarin', 'sturgeon']
    const params = [-2, -1, 'last', 'prelast']
    testAgainstNative(t, original, params)
})
