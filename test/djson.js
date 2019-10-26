import test from 'ava'
import { DJSON } from '../'
import EJSON from 'ejson'
import { isInteger, newDate } from './utils'

DJSON.TYPES.$date = {
    isValidToStringify: value => value instanceof Date, // JSON.stringify uses .toISOString() to serialize Date
    isValidToParse: value => isInteger(value),
    stringify: value => ({ $date: new Date(value).getTime() })
}

DJSON.TYPES.$function = {
    isValidToStringify: value => typeof value == 'function', // JSON.stringify uses .toISOString() to serialize Date
    isValidToParse: value => isInteger(value),
    stringify: value => ({ $function: { date: newDate(123456789) } })
}

function testBasic(t, patch, expected) {
    const string = DJSON.stringify(patch)
    const parsed = JSON.parse(string)
    t.deepEqual(parsed, expected)
}

function testEJSON(t, patch, expected) {
    const string = DJSON.stringify(patch)
    const string_ejson = EJSON.stringify(patch)
    const parsed = JSON.parse(string)
    const parsed_ejson = JSON.parse(string_ejson)
    t.deepEqual(parsed, expected)
    t.deepEqual(parsed, parsed_ejson)
}

test('$date', function(t) {
    const patch = { user: newDate(123456789) }
    const expected = { user: { $date: 123456789 } }
    testEJSON(t, patch, expected)
})

test('Basic $escape', function(t) {
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

test('Basic $escape 2', function(t) {
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

test('$delete', function(t) {
    const patch = { user: { enzo: undefined } }
    const expected = { user: { enzo: { $delete: 0 } } }
    testBasic(t, patch, expected)
})

// test('$function', function(t) {
//     const patch = { user: { enzo: () => {} } }
//     const expected = {
//         user: { enzo: { $function: { date: { $date: 123456789 } } } }
//     }
//     testBasic(t, patch, expected)
// })
