import test from 'ava'
import djsonFactory from '../src/api/djsonFactory'

const DJSON = djsonFactory()

test('before and after', function(t) {
    let i = 0
    DJSON.addType(() => ({
        key: 'beforeandafter',
        isValidToStringify: () => true,
        isValidToParse: () => true,
        beforeStringify: () => {
            i += 1
            t.is(i, 1)
        },
        stringify: value => {
            i += 1
            return value
        },
        parse: value => {
            // i += 1
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
        afterParse: () => {
            i += 1
            t.is(i, 6)
        }
    }))
    DJSON.parse(DJSON.stringify({ value: 1 }))
    t.is(i, 6)
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
