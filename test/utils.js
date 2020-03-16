import { applyPatch, encode, decode } from '../'
import { getNewPlain } from '../src/util/get'
import { isPlainObject } from '../src/util/is'

function newDate(d = new Date().getDate()) {
    const date = new Date(d)
    date.toISOString = () => date
    date.replace = () => date
    return date
}

function isInteger(number) {
    return (
        typeof number === 'number' &&
        isFinite(number) &&
        Math.floor(number) === number
    )
}

function serializeDeserialize(patch, serialize = true) {
    return serialize ? JSON.parse(JSON.stringify(patch)) : patch
}

function testEncodeDecode(
    t,
    patch,
    expected,
    reverse = true,
    serialize = true
) {
    const encoded = serializeDeserialize(encode(patch), serialize)
    t.deepEqual(expected, encoded)
    t.not(patch, encoded)
    if (reverse) {
        const decoded = decode(serializeDeserialize(encoded, serialize))
        t.deepEqual(patch, decoded)
        t.not(encoded, decoded)
    }
}

function testPatchUnpatch(t, target, patch, expected, reverse = true) {
    const cloned = getNewPlain(target)
    const output = applyPatch(target, patch)
    const { unpatch, mutations, result } = output
    if (isPlainObject(result) && isPlainObject(target)) {
        t.is(target, result)
    }
    target = result
    t.deepEqual(target, expected)
    if (reverse) {
        const output2 = applyPatch(target, unpatch)
        t.deepEqual(output2.result, cloned)
    }
    return { unpatch, mutations, result }
}

module.exports = { newDate, isInteger, testEncodeDecode, testPatchUnpatch }
