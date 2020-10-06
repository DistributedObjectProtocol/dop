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

function encodeDecode(patch, encodedecode = true, serialize = true) {
    return encodedecode
        ? decode(serializeDeserialize(encode(patch), serialize))
        : patch
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
    const decoded = decode(serializeDeserialize(encoded, serialize))
    if (reverse) {
        t.deepEqual(patch, decoded)
        t.not(encoded, decoded)
    }
    return { encoded, decoded }
}

function testPatchUnpatch(
    t,
    target,
    patch,
    expected,
    reverse = true,
    encodedecode = true,
    serialize = true
) {
    const cloned = getNewPlain(target)
    const output = applyPatch(
        target,
        encodeDecode(patch, encodedecode, serialize)
    )
    const { unpatch, mutations, result } = output
    if (isPlainObject(result) && isPlainObject(target)) {
        t.is(target, result)
    }
    target = result
    t.deepEqual(target, expected)
    if (reverse) {
        const output2 = applyPatch(
            target,
            encodeDecode(unpatch, encodedecode, serialize)
        )
        t.deepEqual(output2.result, cloned, '(Unpatching)')
    }
    return { unpatch, mutations, result }
}

module.exports = { newDate, isInteger, testEncodeDecode, testPatchUnpatch }
