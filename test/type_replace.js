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
    // console.log(result)
    if (isPlainObject(result)) {
        // t.is(target, result)
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
    const patch = { convert: TYPE.Replace({ hello: 'world' }) }
    const expected = { convert: { $replace: { hello: 'world' } } }
    testBasic(t, patch, expected)
})

test('Escape', function(t) {
    const patch = { escape: { $replace: 1 } }
    const expected = { escape: { $escape: { $replace: 1 } } }
    testBasic(t, patch, expected)
})

test('Ignore', function(t) {
    const patch = { ignore: { $replace: 1, $other: 1 } }
    const expected = { ignore: { $replace: 1, $other: 1 } }
    testBasic(t, patch, expected)
})

test('$escaping', function(t) {
    const patch = {
        convert: TYPE.Replace([1, 2, 3]),
        escape: { $replace: 1 }
    }
    const expected = {
        convert: { $replace: [1, 2, 3] },
        escape: { $escape: { $replace: 1 } }
    }
    testBasic(t, patch, expected)
})

test('This should not be escaped because $replace has another valid prop', function(t) {
    const patch = {
        convert: TYPE.Replace([1, 2, 3]),
        ignored: { $replace: [1, 2, 3], $escape: [1, 2, 3] }
    }
    const expected = {
        convert: { $replace: [1, 2, 3] },
        ignored: { $replace: [1, 2, 3], $escape: [1, 2, 3] }
    }
    testBasic(t, patch, expected)
})

test('This should not be escaped because $replace has another valid prop 2', function(t) {
    const patch = {
        convert: TYPE.Replace([1, 2, 3]),
        escape: { $escape: [1, 2, 3], $replace: TYPE.Replace([1, 2, 3]) }
    }
    const expected = {
        convert: { $replace: [1, 2, 3] },
        escape: { $escape: [1, 2, 3], $replace: { $replace: [1, 2, 3] } }
    }
    testBasic(t, patch, expected)
})

test('Decode alone', function(t) {
    const patch = {
        convert: { $replace: [1, 2, 3] },
        string: { $replace: 'string' },
        escape: { $escape: { $replace: [1, 2, 3] } },
        ignore: {
            $escape: { $replace: [1, 2, 3] },
            two: { $replace: [1, 2, 3] }
        }
    }
    const expected = {
        convert: TYPE.Replace([1, 2, 3]),
        string: TYPE.Replace('string'),
        escape: { $replace: [1, 2, 3] },
        ignore: {
            $escape: TYPE.Replace([1, 2, 3]),
            two: TYPE.Replace([1, 2, 3])
        }
    }
    t.deepEqual(decode(patch), expected)
})

test('patch', function(t) {
    const target = { value: { a: 1, b: 2 } }
    const patch = { value: TYPE.Replace([1, 2, 3]) }
    const expected = { value: [1, 2, 3] }

    testUnpatch(t, target, patch, expected)
})

test('patch should replace the complete object', function(t) {
    const obj_to_replace = { a: 1, b: 3 }
    const target = { value: { a: 1, b: 2 } }
    const patch = { value: TYPE.Replace(obj_to_replace) }
    const expected = { value: { a: 1, b: 3 } }
    const copyvalue = target.value

    testUnpatch(t, target, patch, expected)
    t.is(obj_to_replace, target.value)
    t.not(copyvalue, target.value)
    t.deepEqual(copyvalue, target.value)
})

test('testing that last test works correctly without replace', function(t) {
    const target = { value: { a: 1, b: 2 } }
    const patch = { value: { a: 1, b: 3 } }
    const expected = { value: { a: 1, b: 3 } }

    const copyvalue = target.value

    testUnpatch(t, target, patch, expected)
    t.is(copyvalue, target.value)
    t.deepEqual(copyvalue, target.value)
})

test('replace array', function(t) {
    const target = { value: { a: 1, b: 2 } }
    const patch = TYPE.Replace([1, 2])
    const expected = [1, 2]

    testUnpatch(t, target, patch, expected)
})

test('same behavior as replace array', function(t) {
    const target = { value: { a: 1, b: 2 } }
    const patch = [1, 2]
    const expected = [1, 2]

    testUnpatch(t, target, patch, expected)
})
