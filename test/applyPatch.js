import test from 'ava'
import { applyPatch, merge, Delete } from '../'

function testUnpatch(t, object, patch, expected, reverse = true) {
    const cloned = merge({}, object)
    const { unpatch, mutations } = applyPatch(object, patch)
    t.deepEqual(object, expected)
    if (reverse) {
        applyPatch(object, unpatch)
        t.deepEqual(object, cloned)
    }
    return { unpatch, mutations }
}

test('basic mutation', function(t) {
    const object = { number: 1 }
    const patch = { number: 2 }
    const expected = { number: 2 }

    testUnpatch(t, object, patch, expected)
})

test('basic mutations', function(t) {
    const func1 = () => {}
    const func2 = () => {}
    const object = { number: 1, bool: false, string: 'hello', func: func1 }
    const patch = { number: 2, bool: true, string: 'world', func: func2 }
    const expected = { number: 2, bool: true, string: 'world', func: func2 }

    testUnpatch(t, object, patch, expected)
})

test('value didnt exists', function(t) {
    const object = {}
    const patch = { value: true }
    const expected = { value: true }

    testUnpatch(t, object, patch, expected)
})

test('deletion', function(t) {
    const object = { value: 12345 }
    const patch = { value: Delete() }
    const expected = {}

    testUnpatch(t, object, patch, expected)
})

test('patch new object should not be same object', function(t) {
    const object = { prop: 123 }
    const patch = { prop: { deep: true } }
    const expected = { prop: { deep: true } }

    applyPatch(object, patch)
    t.not(object.prop, patch.prop)
    t.deepEqual(object, expected)
})

test('multiple mutations levels', function(t) {
    const object = { value: false, prop: false, last: { value: false } }
    const patch = { value: true, prop: { deep: true }, last: { value: true } }
    const expected = {
        value: true,
        prop: { deep: true },
        last: { value: true }
    }

    testUnpatch(t, object, patch, expected)
})

test('from deep to other', function(t) {
    const object = { value: { more: false } }
    const patch = { value: true }
    const expected = { value: true }

    testUnpatch(t, object, patch, expected)
})

test('deep value', function(t) {
    const object = { value: { more: false } }
    const patch = { value: { more: true } }
    const expected = { value: { more: true } }

    testUnpatch(t, object, patch, expected)
})

test('deep value should not create root object, just mutate the props', function(t) {
    const object = { value: { a: 1 } }
    const patch = { value: { a: 2, b: 3 } }
    const expected = { value: { a: 2, b: 3 } }

    const { unpatch, mutations } = testUnpatch(t, object, patch, expected)
    t.is(mutations.length, 2)
    t.deepEqual(unpatch, { value: { a: 1, b: unpatch.value.b } })
})

test('mutating multiple levels', function(t) {
    const object = { value: { more: false }, other: false }
    const patch = { value: { more: true }, other: true }
    const expected = { value: { more: true }, other: true }

    testUnpatch(t, object, patch, expected)
})

test('mutating multiple levels not defineds', function(t) {
    const object = {}
    const patch = { value: { more: true }, other: true }
    const expected = { value: { more: true }, other: true }

    testUnpatch(t, object, patch, expected)
})

test('function to object', function(t) {
    const object = { prop: () => {} }
    const patch = { prop: {} }
    const expected = { prop: {} }

    testUnpatch(t, object, patch, expected)
})

test('object to function', function(t) {
    const f = () => {}
    const object = { prop: {} }
    const patch = { prop: f }
    const expected = { prop: f }

    testUnpatch(t, object, patch, expected)
})

test('plain to noplain', function(t) {
    function Foo() {}
    const instance = new Foo()
    instance.prop = 2

    const object = { prop: instance }
    const patch = { prop: { deep: true } }
    const expected = { prop: { deep: true } }

    const { mutations } = testUnpatch(t, object, patch, expected)
    t.is(mutations.length, 1)
})

test('noplain to plain', function(t) {
    function Foo() {}
    const instance = new Foo()
    instance.prop = 2

    const object = { prop: { deep: true } }
    const patch = { prop: instance }
    const expected = { prop: instance }

    testUnpatch(t, object, patch, expected)
})

test('syntax mutations', function(t) {
    const object = {
        value: false,
        prop: false,
        last: { value: false },
        lastlast: { value: false }
    }
    const patch = {
        value: true,
        prop: { deep: true },
        last: { value: true },
        lastlast: true
    }

    const { mutations } = applyPatch(object, patch)
    t.is(mutations.length, 4)
    t.deepEqual(mutations[0], {
        prop: 'value',
        oldValue: false,
        path: ['value'],
        object
    })
    t.deepEqual(mutations[1], {
        prop: 'prop',
        oldValue: false,
        path: ['prop'],
        object
    })
    t.deepEqual(mutations[2], {
        prop: 'value',
        oldValue: false,
        path: ['last', 'value'],
        object: object.last
    })
    t.deepEqual(mutations[3], {
        prop: 'lastlast',
        oldValue: { value: false },
        path: ['lastlast'],
        object
    })
})

test('array', function(t) {
    const object = { array: [0, 1, 2] }
    const patch = { array: [3, 4] }
    const expected = { array: [3, 4] }

    testUnpatch(t, object, patch, expected, false)
    t.deepEqual(object.array, patch.array)
    t.not(object.array, patch.array)
    // console.log(object, patch)
})

test('array complex', function(t) {
    const object = { array: [0, 1, 2], string: 'yep', arrstr: [1, 2] }
    const patch = { array: [3, 4], string: ['a', 'b'], arrstr: '12' }
    const expected = { array: [3, 4], string: ['a', 'b'], arrstr: '12' }

    testUnpatch(t, object, patch, expected)
})

test('from object to array', function(t) {
    const object = { objarr: { value: true } }
    const patch = { objarr: [0, 1] }
    const expected = { objarr: [0, 1] }

    testUnpatch(t, object, patch, expected)
})

test('from array to object', function(t) {
    const object = { objarr: [0, 1] }
    const patch = { objarr: { value: true } }
    const expected = { objarr: { value: true } }

    testUnpatch(t, object, patch, expected)
})

test('should assign `null` values', function(t) {
    const object = { value: false }
    const patch = { value: null }
    const expected = { value: null }

    testUnpatch(t, object, patch, expected)
})

test('should assign `undefined` values', function(t) {
    const object = { value: false }
    const patch = { value: undefined, value2: undefined }
    const expected = { value: undefined, value2: undefined }

    testUnpatch(t, object, patch, expected)
})

test('should assign non array/buffer/typed-array/plain-object source values directly', function(t) {
    function Foo() {}
    const values = [
        new Foo(),
        new Boolean(),
        new Date(),
        Foo,
        new Number(),
        new String(),
        new RegExp()
    ]

    const object = {}
    const patch = { values: values }
    const expected = { values: values }

    testUnpatch(t, object, patch, expected)
})

test('same patch as object generate no mutations', function(t) {
    const object = { value: false }
    const expected = { value: false }

    const { mutations, unpatch } = testUnpatch(t, object, object, expected)
    t.is(mutations.length, 0)
    t.deepEqual(unpatch, {})
})

test('no mutations', function(t) {
    const object = { value: false }
    const patch = {}
    const expected = { value: false }

    const { mutations, unpatch } = testUnpatch(t, object, patch, expected)
    t.is(mutations.length, 0)
    t.deepEqual(unpatch, {})
})

test('checking different types', function(t) {
    const object = {
        string: 'string',
        obj: { lolo: 213 },
        arr: [1, 2, 3, { La: 243534 }],
        array: [32131],
        arrobj: { 0: 4, 1: 5 },
        d: {
            a: 3131,
            array: [1, 2, 3, { abc: 444 }],
            d: {
                d1: 432534,
                d2: {
                    d21: 143243,
                    d22: {
                        d221: 4353453,
                        d223: {
                            hola: 'mundo',
                            undefined: 'undefined'
                        }
                    }
                }
            },
            arrobj: ['a', 'b', 'c'],
            g: 'fff',
            d2: {
                d22: {
                    d222: 312432,
                    d223: {
                        hola: 'lalala'
                    }
                }
            }
        }
    }
    const patch = {
        boolean: true,
        number: -123,
        Infinity: -Infinity,
        float: 1.234153454354341,
        long: 12313214234312324353454534534,
        null: null,
        undefined: undefined,
        NaN: NaN,
        symbol: Symbol('sym'),
        date: new Date(),
        regexp: /molamazo/g,
        function: function() {
            console.log(arguments)
        },
        obj: { lolo: 555 },
        arr: [1, 2, 3, { La: 123 }],
        array: [567, 2121],
        arrobj: { 0: 1, 1: 2 },
        d: {
            a: 1234,
            b: 5678,
            c: 'othermore',
            array: [1, 2, 3, { abc: 123 }],
            d: {
                d1: 13,
                d2: {
                    d21: 123,
                    d22: {
                        d221: 12,
                        d223: {
                            hola: 'hola',
                            undefined: undefined
                        }
                    }
                }
            },
            arrobj: ['a', 'b', 'c', 'd'],
            g: 123,
            d2: {
                d22: {
                    d222: 555,
                    d223: {
                        hola: 'mundo'
                    }
                }
            }
        }
    }
    const expected = { ...patch, string: 'string' }

    const { mutations } = testUnpatch(t, object, patch, expected)
    t.is(mutations.length, 30)
})
