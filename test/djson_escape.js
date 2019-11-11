import test from 'ava'
import { DJSON } from '../'

const SPECIALSTRING = 'SPECIALSTRING'

DJSON.addType(({ getUniqueKey }) => ({
    key: '$specialstype',
    stringify: (value, prop, object) => {
        const unique_key = getUniqueKey(object)
        return prop !== '$specialstype' &&
            // unique_key !== undefined &&
            value === SPECIALSTRING
            ? { $specialstype: value }
            : value
    },
    parse: (value, prop) => {
        const unique_key = getUniqueKey(value)
        return unique_key === '$specialstype' && prop !== '$escape'
            ? value.$specialstype
            : value
    }
}))

function testBasic(t, patch, expected, recursive = true) {
    const string = DJSON.stringify(patch)
    const jsonparsed = JSON.parse(string)
    const parsed = DJSON.parse(string)
    t.deepEqual(expected, jsonparsed)
    if (recursive) {
        return testBasic(t, parsed, expected, false)
    }
    return parsed
}

test('basic', function(t) {
    const patch = { user: { enzo: SPECIALSTRING } }
    const expected = { user: { enzo: { $specialstype: SPECIALSTRING } } }
    testBasic(t, patch, expected)
})

test('$escaping', function(t) {
    const patch = {
        user: {
            enzo: SPECIALSTRING,
            john: { $specialstype: SPECIALSTRING }
        }
    }
    const expected = {
        user: {
            enzo: { $specialstype: SPECIALSTRING },
            john: { $escape: { $specialstype: SPECIALSTRING } }
        }
    }
    testBasic(t, patch, expected)
})

// test('This should not be escaped because $specialstype has another property', function(t) {
//     const patch = {
//         user: {
//             // enzo: SPECIALSTRING,
//             john: { $specialstype: SPECIALSTRING, $other: SPECIALSTRING }
//         }
//     }
//     const expected = {
//         user: {
//             // enzo: { $specialstype: SPECIALSTRING },
//             john: { $specialstype: SPECIALSTRING, $other: SPECIALSTRING }
//         }
//     }
//     testBasic(t, patch, expected)
// })

// test('This should not be escaped because $specialstype has another valid prop', function(t) {
//     const patch = {
//         user: {
//             enzo: SPECIALSTRING,
//             john: { $specialstype: SPECIALSTRING, $escape: SPECIALSTRING }
//         }
//     }
//     const expected = {
//         user: {
//             enzo: { $specialstype: SPECIALSTRING },
//             john: { $specialstype: SPECIALSTRING, $escape: SPECIALSTRING }
//         }
//     }
//     testBasic(t, patch, expected)
// })

// test('This should not be escaped because $specialstype has another valid prop 2', function(t) {
//     const patch = {
//         user: {
//             enzo: SPECIALSTRING,
//             john: { $escape: SPECIALSTRING, $specialstype: SPECIALSTRING }
//         }
//     }
//     const expected = {
//         user: {
//             enzo: { $specialstype: SPECIALSTRING },
//             john: { $escape: SPECIALSTRING, $specialstype: SPECIALSTRING }
//         }
//     }
//     testBasic(t, patch, expected)
// })

// test('This should not be escaped because $specialstype is not an number', function(t) {
//     const patch = {
//         user: { enzo: SPECIALSTRING, john: { $specialstype: 'string' } }
//     }
//     const expected = {
//         user: { enzo: { $specialstype: SPECIALSTRING }, john: { $specialstype: 'string' } }
//     }
//     testBasic(t, patch, expected) // testBasic(t, patch, expected) // Not sure why EJSON is still escaping strings
// })
