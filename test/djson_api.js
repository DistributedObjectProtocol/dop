import test from 'ava'
import { djsonFactory } from '../'

const DJSON = djsonFactory()

function testBasic(t, patch, expected, useParse = false) {
    const string = DJSON.stringify(patch)
    const parsed = JSON.parse(string)
    t.deepEqual(parsed, expected)
    if (useParse) {
        testBasic(t, DJSON.parse(string), expected, false)
    }
}

test('not_defined_stringify', function(t) {
    let i = 0
    DJSON.addType(() => ({
        key: 'not_defined_stringify',
        isValidToStringify: (value, prop) => {
            i += 1
            return true
        }
    }))
    const patch = { user: 1 }
    const expected = { user: 1 }
    testBasic(t, patch, expected)
    t.is(i, 0)
})

test('not_defined_stringify2', function(t) {
    let i = 0
    DJSON.addType(() => ({
        key: 'not_defined_stringify2',
        stringify: (value, prop) => {
            i += 1
            return true
        }
    }))
    const patch = { user: 1 }
    const expected = { user: 1 }
    testBasic(t, patch, expected)
    t.is(i, 0)
})

test('valid_stringify', function(t) {
    let i = 0
    DJSON.addType(() => ({
        key: 'valid_stringify',
        isValidToStringify: () => {
            i += 1
            return true
        },
        stringify: value => {
            i += 1
            return String(value)
        }
    }))
    const patch = { testingStringify: 1 }
    const expected = { testingStringify: '1' }
    testBasic(t, patch, expected)
    t.is(i, 2)
})
