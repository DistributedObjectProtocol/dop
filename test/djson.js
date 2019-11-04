import test from 'ava'
import { DJSON } from '../'
import EJSON from 'ejson'
import { isInteger, newDate } from './utils'

DJSON.setType('$date', () => ({
    isValidToStringify: value => value instanceof Date, // JSON.stringify uses .toISOString() to serialize Date
    isValidToParse: value => isInteger(value.$date),
    stringify: value => ({ $date: new Date(value).getTime() }),
    parse: value => newDate(value.$date)
}))

// DJSON.TYPES.$nestedtype = {
//     isValidToStringify: value => typeof value == 'function', // JSON.stringify uses .toISOString() to serialize Date
//     isValidToParse: value => true,
//     stringify: value => ({ $nestedtype: { date: newDate(value()) } })
// }

function testStringify(t, patch, expected) {
    const string = DJSON.stringify(patch)
    const parsed = JSON.parse(string)
    t.deepEqual(parsed, expected)
}

function testStringifyEJSON(t, patch, expected) {
    const string_djson = DJSON.stringify(patch)
    const string_ejson = EJSON.stringify(patch)
    const parsed_djson = JSON.parse(string_djson)
    const parsed_ejson = JSON.parse(string_ejson)
    t.deepEqual(parsed_djson, expected)
    t.deepEqual(parsed_djson, parsed_ejson)
    // t.deepEqual(patch, EJSON.parse(string_ejson))
}

test('$delete', function(t) {
    const patch = { user: { enzo: undefined } }
    const expected = { user: { enzo: { $delete: 0 } } }
    testStringify(t, patch, expected)
})

test('$date', function(t) {
    const patch = { user: newDate(123456789) }
    const expected = { user: { $date: 123456789 } }
    testStringifyEJSON(t, patch, expected)
})

test('$date $escape', function(t) {
    const patch = {
        user: { enzo: newDate(123456789), john: { $date: 123456789 } }
    }
    const expected = {
        user: {
            enzo: { $date: 123456789 },
            john: { $escape: { $date: 123456789 } }
        }
    }
    testStringifyEJSON(t, patch, expected)
})

test('$date $escape 2', function(t) {
    const patch = {
        user: { john: { $date: 123456789 }, enzo: newDate(123456789) }
    }
    const expected = {
        user: {
            enzo: { $date: 123456789 },
            john: { $escape: { $date: 123456789 } }
        }
    }
    testStringifyEJSON(t, patch, expected)
})

test('This should not be escaped because $date has another property', function(t) {
    const patch = {
        user: {
            enzo: newDate(123456789),
            john: { $date: 123456789, $other: 123456789 }
        }
    }
    const expected = {
        user: {
            enzo: { $date: 123456789 },
            john: { $date: 123456789, $other: 123456789 }
        }
    }
    testStringifyEJSON(t, patch, expected)
})

test('This should not be escaped because $date has another valid prop', function(t) {
    const patch = {
        user: {
            enzo: newDate(123456789),
            john: { $date: 123456789, $escape: 123456789 }
        }
    }
    const expected = {
        user: {
            enzo: { $date: 123456789 },
            john: { $date: 123456789, $escape: 123456789 }
        }
    }
    testStringifyEJSON(t, patch, expected)
})

test('This should not be escaped because $date has another valid prop 2', function(t) {
    const patch = {
        user: {
            enzo: newDate(123456789),
            john: { $escape: 123456789, $date: 123456789 }
        }
    }
    const expected = {
        user: {
            enzo: { $date: 123456789 },
            john: { $escape: 123456789, $date: 123456789 }
        }
    }
    testStringifyEJSON(t, patch, expected)
})

test('This should not be escaped because $date is not an number', function(t) {
    const patch = {
        user: { enzo: newDate(123456789), john: { $date: 'string' } }
    }
    const expected = {
        user: { enzo: { $date: 123456789 }, john: { $date: 'string' } }
    }
    testStringify(t, patch, expected) // testStringifyEJSON(t, patch, expected) // Not sure why EJSON is still escaping strings
})

test('Passing replacer', function(t) {
    const patch = { user: { deep: newDate(123456789) } }
    const expected = { user: { deep: { $date: 123456789 } } }
    DJSON.stringify(patch, function(prop, value) {
        if (prop === 'user') {
            t.is(value, patch.user)
            t.is(this, patch)
        }
        if (prop === 'deep') {
            t.deepEqual(value, expected.user.deep)
        }
        return value
    })
})

// // this is experimental, not sure if the protocol should allow nested types
// // this is experimental, not sure if the protocol should allow nested types
// // this is experimental, not sure if the protocol should allow nested types
// test('$nestedtype', function(t) {
//     const patch = { user: () => 123456789 }
//     const expected = {
//         user: { $nestedtype: { date: { $date: 123456789 } } }
//     }
//     testStringify(t, patch, expected)
// })

// test('$nestedtype escaped', function(t) {
//     const patch = {
//         user: { $nestedtype: { date: { $date: 123456789 } } }
//     }
//     const expected = {
//         user: {
//             $escape: {
//                 $nestedtype: { date: { $escape: { $date: 123456789 } } }
//             }
//         }
//     }
//     testStringify(t, patch, expected)
// })
// // this is experimental, not sure if the protocol should allow nested types
// // this is experimental, not sure if the protocol should allow nested types
// // this is experimental, not sure if the protocol should allow nested types
