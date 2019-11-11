import test from 'ava'
import { DJSON } from '../'

const SPECIALSTRING = 'SPECIALSTRING'

DJSON.addType(({ getUniqueKey }) => ({
    key: '$specialstype',
    stringify: (value, prop) => {
        return prop !== '$specialstype' && value === SPECIALSTRING
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
    t.deepEqual(jsonparsed, expected)
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
