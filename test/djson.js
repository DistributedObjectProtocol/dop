import test from 'ava'
import { DJSON } from '../'
import EJSON from 'ejson'

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

function newDate(d) {
    const date = new Date(d)
    date.toISOString = () => date
    return date
}

test('$delete', function(t) {
    const patch = { user: { enzo: undefined } }
    const expected = { user: { enzo: { $delete: 0 } } }
    testBasic(t, patch, expected)
})

test('Basic $escape', function(t) {
    const patch = { user: { enzo: undefined, john: { $delete: 0 } } }
    const expected = {
        user: { enzo: { $delete: 0 }, john: { $escape: { $delete: 0 } } }
    }
    testBasic(t, patch, expected)
})

test('Basic $escape 2', function(t) {
    const patch = { user: { john: { $delete: 0 }, enzo: undefined } }
    const expected = {
        user: { enzo: { $delete: 0 }, john: { $escape: { $delete: 0 } } }
    }
    testBasic(t, patch, expected)
})

test("This should not be $escape'd because $delete has another property", function(t) {
    const patch = {
        user: { enzo: undefined, john: { $delete: 0, $other: 0 } }
    }
    const expected = {
        user: { enzo: { $delete: 0 }, john: { $delete: 0, $other: 0 } }
    }
    testBasic(t, patch, expected)
})

test("This should not be $escape'd because $delete has another valid prop", function(t) {
    const patch = {
        user: { enzo: undefined, john: { $delete: 0, $escape: 0 } }
    }
    const expected = {
        user: { enzo: { $delete: 0 }, john: { $delete: 0, $escape: 0 } }
    }
    testBasic(t, patch, expected)
})

test("This should not be $escape'd because $delete has another valid prop 2", function(t) {
    const patch = {
        user: { enzo: undefined, john: { $escape: 0, $delete: 0 } }
    }
    const expected = {
        user: { enzo: { $delete: 0 }, john: { $escape: 0, $delete: 0 } }
    }
    testBasic(t, patch, expected)
})

test("This should not be $escape'd because $delete is not 0 which means is an invalid type", function(t) {
    const patch = { user: { enzo: undefined, john: { $delete: 1 } } }
    const expected = { user: { enzo: { $delete: 0 }, john: { $delete: 1 } } }
    testBasic(t, patch, expected)
})

test('$date', function(t) {
    const patch = { user: newDate(123456789) }
    const expected = { user: { $date: 123456789 } }
    testEJSON(t, patch, expected)
})

test.only('Escaping $date', function(t) {
    const patch = { user: { enzo: { $date: 12345 } } }
    const expected = { user: { enzo: { $date: 12345 } } }
    testEJSON(t, patch, expected)
})
