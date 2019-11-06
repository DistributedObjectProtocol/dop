import test from 'ava'
import { DJSON } from '../'
import EJSON from 'ejson'
import { isInteger, newDate } from './utils'

DJSON.setType('$date', () => ({
    isValidToStringify: value => value instanceof Date, // JSON.stringify uses .toISOString() to serialize Date
    isValidToParse: (value, prop) => isInteger(value.$date),
    stringify: value => ({ $date: new Date(value).getTime() }),
    parse: value => newDate(value.$date)
}))

// DJSON.TYPES.$nestedtype = {
//     isValidToStringify: value => typeof value == 'function', // JSON.stringify uses .toISOString() to serialize Date
//     isValidToParse: value => true,
//     stringify: value => ({ $nestedtype: { date: newDate(value()) } })
// }

function testBasic(t, patch, expected, recursive = true) {
    const string = DJSON.stringify(patch)
    const parsed = JSON.parse(string)
    t.deepEqual(parsed, expected)
    if (recursive) {
        testBasic(t, DJSON.parse(string), expected, false)
    }
}

function testEJSON(t, patch, expected, recursive = true) {
    const string_djson = DJSON.stringify(patch)
    const string_ejson = EJSON.stringify(patch)
    const parsed_json_djson = JSON.parse(string_djson)
    const parsed_json_ejson = JSON.parse(string_ejson)
    t.deepEqual(parsed_json_djson, expected)
    t.deepEqual(parsed_json_djson, parsed_json_ejson)
    if (recursive) {
        testEJSON(t, DJSON.parse(string_djson), expected, false)
        // testEJSON(t, EJSON.parse(string_ejson), expected, false)
    }
}

test('$undefined', function(t) {
    const patch = { user: { enzo: undefined } }
    const expected = { user: { enzo: { $undefined: 0 } } }
    testBasic(t, patch, expected)
})

test('$undefined $escape', function(t) {
    const patch = {
        user: { enzo: undefined, john: { $undefined: 0 } }
    }
    const expected = {
        user: {
            enzo: { $undefined: 0 },
            john: { $escape: { $undefined: 0 } }
        }
    }
    testBasic(t, patch, expected)
})

test('$date', function(t) {
    const patch = { user: newDate(123456789) }
    const expected = { user: { $date: 123456789 } }
    testEJSON(t, patch, expected)
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
    testEJSON(t, patch, expected)
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
    testEJSON(t, patch, expected)
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
    testEJSON(t, patch, expected)
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
    testEJSON(t, patch, expected)
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
    testEJSON(t, patch, expected)
})

test('This should not be escaped because $date is not an number', function(t) {
    const patch = {
        user: { enzo: newDate(123456789), john: { $date: 'string' } }
    }
    const expected = {
        user: { enzo: { $date: 123456789 }, john: { $date: 'string' } }
    }
    testBasic(t, patch, expected) // testEJSON(t, patch, expected) // Not sure why EJSON is still escaping strings
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
//     testBasic(t, patch, expected)
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
//     testBasic(t, patch, expected)
// })
// // this is experimental, not sure if the protocol should allow nested types
// // this is experimental, not sure if the protocol should allow nested types
// // this is experimental, not sure if the protocol should allow nested types
