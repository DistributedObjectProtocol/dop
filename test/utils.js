import { applyPatch, producePatch, encode, decode, merge } from '../src'
import { getNewPlain } from '../src/util/getset'
import { isPlainObject, isFunction } from '../src/util/is'

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

function testPatchUnpatch({
    t,
    target,
    patch,
    fnpatch,
    expected,
    reverse = true,
    reversefn = true,
    encodedecode = true,
    serialize = true,
}) {
    let patch2
    const copytarget = merge({}, target)

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

    // producePatch
    if (isFunction(fnpatch)) {
        const resu = producePatch(copytarget, fnpatch)
        patch2 = resu.patch
        // console.log(resu.mutations.length)
        testPatchUnpatch({
            t,
            target: copytarget,
            patch: patch2,
            expected,
            reverse: reverse && reversefn,
            encodedecode,
            serialize,
        })
    }

    return { unpatch, mutations, result, patch2 }
}

module.exports = { newDate, isInteger, testEncodeDecode, testPatchUnpatch }
