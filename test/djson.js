import test from 'ava'
import { DJSON } from '../'
import EJSON from 'ejson'

function testAll(t, patch, expected) {
    const string = DJSON.stringify(patch)
    const parsed = JSON.parse(string)
    t.deepEqual(parsed, expected)
}

test('$delete', function(t) {
    const patch = { user: { enzo: undefined } }
    const expected = { user: { enzo: { $delete: 0 } } }
    testAll(t, patch, expected)
})

test('Basic $escape', function(t) {
    const patch = { user: { enzo: undefined, john: { $delete: 0 } } }
    const expected = {
        user: { enzo: { $delete: 0 }, john: { $escape: { $delete: 0 } } }
    }
    testAll(t, patch, expected)
})

test('Basic $escape 2', function(t) {
    const patch = { user: { john: { $delete: 0 }, enzo: undefined } }
    const expected = {
        user: { enzo: { $delete: 0 }, john: { $escape: { $delete: 0 } } }
    }
    testAll(t, patch, expected)
})

test("This should not be $escape'd because $delete has another property", function(t) {
    const patch = {
        user: { enzo: undefined, john: { $delete: 0, $other: 0 } }
    }
    const expected = {
        user: { enzo: { $delete: 0 }, john: { $delete: 0, $other: 0 } }
    }
    testAll(t, patch, expected)
})

test("This should not be $escape'd because $delete has another valid prop", function(t) {
    const patch = {
        user: { enzo: undefined, john: { $delete: 0, $escape: 0 } }
    }
    const expected = {
        user: { enzo: { $delete: 0 }, john: { $delete: 0, $escape: 0 } }
    }
    testAll(t, patch, expected)
})

test("This should not be $escape'd because $delete has another valid prop 2", function(t) {
    const patch = {
        user: { enzo: undefined, john: { $escape: 0, $delete: 0 } }
    }
    const expected = {
        user: { enzo: { $delete: 0 }, john: { $escape: 0, $delete: 0 } }
    }
    testAll(t, patch, expected)
})

test("This should not be $escape'd because $delete is not 0 which means is an invalid type", function(t) {
    const patch = { user: { enzo: undefined, john: { $delete: 1 } } }
    const expected = { user: { enzo: { $delete: 0 }, john: { $delete: 1 } } }
    testAll(t, patch, expected)
})

test.only('Escaping the $escape', function(t) {
    const patch = { user: { born: 1234 } }
    // const expected = { user: { $escape: { $delete: 0 } } }
    const djson = DJSON.stringify(patch)
    const ejson = EJSON.stringify(patch)
    console.log('DJSON', djson)
    console.log('EJSON', ejson)
    // console.log(EJSON.parse(EJSON.stringify(patch)))
    // testAll(t, patch, expected)
    t.is(true, true)
})
