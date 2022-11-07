import test from 'ava'
import { decode, TYPE } from '../src'
import { testEncodeDecode, testPatchUnpatch } from './utils'

test('Valid type', function (t) {
    const patch = { convert: TYPE.Replace({ hello: 'world' }) }
    const expected = { convert: { $e: { hello: 'world' } } }
    testEncodeDecode(t, patch, expected)
})

test('Escape', function (t) {
    const patch = { escape: { $e: 1 } }
    const expected = { escape: { $escape: { $e: 1 } } }
    testEncodeDecode(t, patch, expected)
})

test('Ignore', function (t) {
    const patch = { ignore: { $e: 1, $other: 1 } }
    const expected = { ignore: { $e: 1, $other: 1 } }
    testEncodeDecode(t, patch, expected)
})

test('$escaping', function (t) {
    const patch = {
        convert: TYPE.Replace([1, 2, 3]),
        escape: { $e: 1 },
    }
    const expected = {
        convert: { $e: [1, 2, 3] },
        escape: { $escape: { $e: 1 } },
    }
    testEncodeDecode(t, patch, expected)
})

test('This should not be escaped because $e has another valid prop', function (t) {
    const patch = {
        convert: TYPE.Replace([1, 2, 3]),
        ignored: { $e: [1, 2, 3], $escape: [1, 2, 3] },
    }
    const expected = {
        convert: { $e: [1, 2, 3] },
        ignored: { $e: [1, 2, 3], $escape: [1, 2, 3] },
    }
    testEncodeDecode(t, patch, expected)
})

test('This should not be escaped because $e has another valid prop 2', function (t) {
    const patch = {
        convert: TYPE.Replace([1, 2, 3]),
        escape: { $escape: [1, 2, 3], $e: TYPE.Replace([1, 2, 3]) },
    }
    const expected = {
        convert: { $e: [1, 2, 3] },
        escape: { $escape: [1, 2, 3], $e: { $e: [1, 2, 3] } },
    }
    testEncodeDecode(t, patch, expected)
})

test('Decode alone', function (t) {
    const patch = {
        convert: { $e: [1, 2, 3] },
        string: { $e: 'string' },
        escape: { $escape: { $e: [1, 2, 3] } },
        ignore: {
            $escape: { $e: [1, 2, 3] },
            two: { $e: [1, 2, 3] },
        },
    }
    const expected = {
        convert: TYPE.Replace([1, 2, 3]),
        string: TYPE.Replace('string'),
        escape: { $e: [1, 2, 3] },
        ignore: {
            $escape: TYPE.Replace([1, 2, 3]),
            two: TYPE.Replace([1, 2, 3]),
        },
    }
    t.deepEqual(decode(patch), expected)
})

test('patch array', function (t) {
    const target = { value: { a: 1, b: 2 } }
    const patch = { value: TYPE.Replace([1, 2, 3]) }
    const expected = { value: [1, 2, 3] }

    testPatchUnpatch({ t, target, patch, expected })
})

test('patch object', function (t) {
    const target = { value: { a: 1, b: 2 } }
    const patch = { value: TYPE.Replace({ c: 3 }) }
    const expected = { value: { c: 3 } }

    testPatchUnpatch({ t, target, patch, expected })
})

test('patch should replace the complete object', function (t) {
    const obj_to_replace = { c: 3 }
    const target = { value: { a: 1, b: 2 } }
    const patch = { value: TYPE.Replace(obj_to_replace) }
    const expected = { value: { c: 3 } }
    const copyvalue = target.value

    testPatchUnpatch({
        t,
        target,
        patch,
        expected,
        reverse: false,
        encodedecode: false,
    })
    t.is(obj_to_replace, target.value)
    t.not(copyvalue, target.value)
})

test('testing that last test works correctly without replace', function (t) {
    const target = { value: { a: 1, b: 2 } }
    const patch = { value: { c: 3 } }
    const expected = { value: { a: 1, b: 2, c: 3 } }

    const copyvalue = target.value

    testPatchUnpatch({ t, target, patch, expected })
    t.is(copyvalue, target.value)
    t.deepEqual(copyvalue, target.value)
})

test('replace array', function (t) {
    const target = { value: { a: 1, b: 2 } }
    const patch = TYPE.Replace([1, 2])
    const expected = [1, 2]

    testPatchUnpatch({ t, target, patch, expected })
})

test('same behavior as replace array', function (t) {
    const target = { value: { a: 1, b: 2 } }
    const patch = [1, 2]
    const expected = [1, 2]

    testPatchUnpatch({ t, target, patch, expected })
})

test('inner types', function (t) {
    const target = { value: { a: 1, b: 2 } }
    const patch = { value: TYPE.Replace({ a: 1, b: TYPE.Swap(1, 2) }) }
    const expected = { value: { a: 1, b: TYPE.Swap(1, 2) } }

    testPatchUnpatch({ t, target, patch, expected, reverse: false })
})

test('replace when is not defined yet', function (t) {
    const target = {}
    const patch = { value: TYPE.Replace({ a: 1 }) }
    const expected = { value: { a: 1 } }

    testPatchUnpatch({ t, target, patch, expected })
})
