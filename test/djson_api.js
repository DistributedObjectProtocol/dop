import test from 'ava'
import { djsonFactory } from '../'

const DJSON = djsonFactory()

test('stringifying', function(t) {
    let i = 0
    DJSON.addType(() => ({
        key: 'stringifying',
        stringify: (value, prop) => {
            i += 1
            return prop === 'testingStringify' ? String(value) : value
        }
    }))
    const patch = { testingStringify: 1 }
    const expected = { testingStringify: '1' }
    const string = DJSON.stringify(patch)
    const parsed = JSON.parse(string)
    t.deepEqual(parsed, expected)
    t.is(i, 2)
})

test('parsing', function(t) {
    let i = 0
    DJSON.addType(() => ({
        key: 'parsing',
        parse: (value, prop, object) => {
            i += 1
            return prop === 'number' ? Number(value) : value
        }
    }))
    const expected = { number: 1 }
    const parsed = DJSON.parse('{ "number": "1" }')
    t.deepEqual(parsed, expected)
    t.is(i, 2)
})

test('before and after', function(t) {
    let i = 0
    DJSON.addType(() => ({
        key: 'beforeandafter',
        beforeStringify: () => {
            i += 1
            t.is(i, 1)
        },
        stringify: value => {
            i += 1
            return value
        },
        afterStringify: () => {
            i += 1
            t.is(i, 4)
        },
        beforeParse: () => {
            i += 1
            t.is(i, 5)
        },
        parse: value => {
            i += 1
            return value
        },
        afterParse: () => {
            i += 1
            t.is(i, 8)
        }
    }))
    DJSON.parse(DJSON.stringify({ value: 1 }))
    t.is(i, 8)
})

test('Passing replacer', function(t) {
    const patch = { user: { deep: 123 } }
    const expected = { user: { deep: 123 } }
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

// test.skip('skipping', function(t) {
//     let i = 0
//     DJSON.addType(() => ({
//         key: 'skipping',
//         skipStringify: () => {
//             i += 1
//             t.true(true)
//             return true
//         },
//         skipParse: () => {
//             i += 1
//             t.true(true)
//             return true
//         },
//         stringify: value => {
//             i += 1
//             t.true(false)
//             return value
//         },
//         parse: value => {
//             i += 1
//             t.true(false)
//             return value
//         }
//     }))
//     DJSON.parse(DJSON.stringify({ value: 1 }))
//     t.is(i, 4)
// })
