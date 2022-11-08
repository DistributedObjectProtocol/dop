import test from 'ava'
import { applyPatch, TYPE } from '../src'
import { testPatchUnpatch } from './utils'

test('1 / https://tools.ietf.org/html/rfc7386 ', function (t) {
    const target = { a: 'b' }
    const patch = { a: 'c' }
    const expected = { a: 'c' }
    const fnpatch = (d) => {
        d.a = 'c'
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('2 / https://tools.ietf.org/html/rfc7386 ', function (t) {
    const target = { a: 'b' }
    const patch = { b: 'c' }
    const expected = { a: 'b', b: 'c' }
    const fnpatch = (d) => {
        d.b = 'c'
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('3 / https://tools.ietf.org/html/rfc7386 ', function (t) {
    const target = { a: 'b' }
    const patch = { a: TYPE.Delete() }
    const expected = {}
    const fnpatch = (d) => {
        delete d.a
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('4 / https://tools.ietf.org/html/rfc7386 ', function (t) {
    const target = { a: 'b', b: 'c' }
    const patch = { a: TYPE.Delete() }
    const expected = { b: 'c' }
    const fnpatch = (d) => {
        delete d.a
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('5 / https://tools.ietf.org/html/rfc7386 ', function (t) {
    const target = { a: ['b'] }
    const patch = { a: 'c' }
    const expected = { a: 'c' }
    const fnpatch = (d) => {
        d.a = 'c'
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('6 / https://tools.ietf.org/html/rfc7386 ', function (t) {
    const target = { a: 'c' }
    const patch = { a: ['b'] }
    const expected = { a: ['b'] }
    const fnpatch = (d) => {
        d.a = ['b']
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('7 / https://tools.ietf.org/html/rfc7386 ', function (t) {
    const target = { a: { b: 'c' } }
    const patch = { a: { b: 'd', c: TYPE.Delete() } }
    const expected = { a: { b: 'd' } }
    const fnpatch = (d) => {
        d.a.b = 'd'
        delete d.a.c
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('8 / https://tools.ietf.org/html/rfc7386 ', function (t) {
    const target = { a: {} }
    const patch = { a: [1] }
    const expected = { a: [1] }
    const fnpatch = (d) => {
        d.a = [1]
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('9 / https://tools.ietf.org/html/rfc7386 ', function (t) {
    const target = ['a', 'b']
    const patch = ['c', 'd']
    const expected = ['c', 'd']

    testPatchUnpatch({ t, target, patch, expected })
})

test('10 / https://tools.ietf.org/html/rfc7386 ', function (t) {
    const target = { a: 'b' }
    const patch = ['c']
    const expected = ['c']

    testPatchUnpatch({ t, target, patch, expected })
})

test('11 / https://tools.ietf.org/html/rfc7386 ', function (t) {
    const target = { a: 'foo' }
    const patch = null
    const expected = null

    testPatchUnpatch({ t, target, patch, expected, serialize: false })
})

test('12 / https://tools.ietf.org/html/rfc7386 ', function (t) {
    const target = { a: 'foo' }
    const patch = 'bar'
    const expected = 'bar'

    testPatchUnpatch({ t, target, patch, expected })
})

test('13 / https://tools.ietf.org/html/rfc7386 ', function (t) {
    const target = { e: null }
    const patch = { a: 1 }
    const expected = { e: null, a: 1 }
    const fnpatch = (d) => {
        d.a = 1
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('13/b', function (t) {
    const target = { e: TYPE.Delete() }
    const patch = { a: 1 }
    const expected = { e: TYPE.Delete(), a: 1 }
    const fnpatch = (d) => {
        d.a = 1
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('13/c (not sure about this case)', function (t) {
    const target = { e: TYPE.Delete() }
    const patch = { a: 1, e: TYPE.Delete() }
    const expected = { a: 1 }
    const fnpatch = (d) => {
        d.a = 1
        delete d.e
    }

    // not sure about this case because the unpatch would result in {}
    testPatchUnpatch({ t, target, patch, expected, reverse: false, fnpatch })
})

test('14 / https://tools.ietf.org/html/rfc7386 ', function (t) {
    const target = 'string' // [1, 2]
    const patch = { a: 'b', c: TYPE.Delete() }
    const expected = { a: 'b' }

    testPatchUnpatch({ t, target, patch, expected })
})

test('15 / https://tools.ietf.org/html/rfc7386 ', function (t) {
    const target = {}
    const patch = { a: { bb: { ccc: TYPE.Delete() } } }
    const expected = { a: { bb: {} } }
    const fnpatch = (d) => {
        d.a = { bb: { ccc: true } }
        delete d.a.bb.ccc
    }

    testPatchUnpatch({
        t,
        target,
        patch,
        expected,
        fnpatch,
        // reversefn: false,
    })
})

test('api: patch result is the same that patch argument', function (t) {
    const target = { hello: 1, world: 2, name: 'enzo' }
    const patch_expected = { hello: 3, new: 4, world: TYPE.Delete() }
    const { patch } = applyPatch(target, patch_expected)

    t.is(patch, patch_expected)
    t.deepEqual(patch, patch_expected)
    t.deepEqual(target, { hello: 3, new: 4, name: 'enzo' })
})

test('api: applyPatch as function instead of patch', function (t) {
    const target = { hello: 1, world: 2, name: 'enzo' }

    const { patch } = applyPatch(target, (d) => {
        d.hello = 3
        d.new = 4
        delete d.world
    })

    t.deepEqual(patch, { hello: 3, new: 4, world: TYPE.Delete() })
    t.deepEqual(target, { hello: 3, new: 4, name: 'enzo' })
})

test('basic mutation', function (t) {
    const target = { number: 1 }
    const patch = { number: 2 }
    const expected = { number: 2 }
    const fnpatch = (d) => {
        d.number = 2
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('basic mutations', function (t) {
    const func1 = () => {}
    const func2 = () => {}
    const target = { number: 1, bool: false, string: 'hello', func: func1 }
    const patch = { number: 2, bool: true, string: 'world', func: func2 }
    const expected = { number: 2, bool: true, string: 'world', func: func2 }
    const fnpatch = (d) => {
        d.number = 2
        d.bool = true
        d.string = 'world'
        d.func = func2
    }

    testPatchUnpatch({
        t,
        target,
        patch,
        expected,
        fnpatch,
        encodedecode: false,
    })
})

test('value didnt exists', function (t) {
    const target = {}
    const patch = { value: true }
    const expected = { value: true }
    const fnpatch = (d) => {
        d.value = true
    }

    testPatchUnpatch({ t, target, patch, fnpatch, expected })
})

test('deletion', function (t) {
    const target = { value: 12345 }
    const patch = { value: TYPE.Delete() }
    const expected = {}
    const fnpatch = (d) => {
        delete d.value
    }

    testPatchUnpatch({ t, target, patch, fnpatch, expected })
})

test('patch new target should not be same target', function (t) {
    const target = { prop: 123 }
    const patch = { prop: { deep: true } }
    const expected = { prop: { deep: true } }

    applyPatch(target, patch)
    t.not(target.prop, patch.prop)
    t.deepEqual(target, expected)
})

test('multiple mutations levels', function (t) {
    const target = { value: false, prop: false, last: { value: false } }
    const patch = { value: true, prop: { deep: true }, last: { value: true } }
    const expected = {
        value: true,
        prop: { deep: true },
        last: { value: true },
    }
    const fnpatch = (d) => {
        d.value = true
        d.prop = { deep: true }
        d.last.value = true
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('from deep to other', function (t) {
    const target = { value: { more: false } }
    const patch = { value: true }
    const expected = { value: true }
    const fnpatch = (d) => {
        d.value = true
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('deep value', function (t) {
    const target = { value: { more: false } }
    const patch = { value: { more: true } }
    const expected = { value: { more: true } }
    const fnpatch = (d) => {
        d.value.more = true
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('deep value should not create root target, just mutate the props', function (t) {
    const target = { value: { a: 1 } }
    const patch = { value: { a: 2, b: 3 } }
    const expected = { value: { a: 2, b: 3 } }

    const { unpatch, mutations } = testPatchUnpatch({
        t,
        target,
        patch,
        expected,
    })
    t.is(mutations.length, 2)
    t.deepEqual(unpatch, { value: { a: 1, b: unpatch.value.b } })
})

test('mutating multiple levels', function (t) {
    const target = { value: { more: false }, other: false }
    const patch = { value: { more: true }, other: true }
    const expected = { value: { more: true }, other: true }
    const fnpatch = (d) => {
        d.value.more = true
        d.other = true
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('mutating multiple levels not defineds', function (t) {
    const target = {}
    const patch = { value: { more: true }, other: true }
    const expected = { value: { more: true }, other: true }
    const fnpatch = (d) => {
        d.value = { more: true }
        d.other = true
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('mutating multiple levels not defineds / inverted', function (t) {
    const target = { value: { more: true }, other: true }
    const patch = { value: TYPE.Delete(), other: TYPE.Delete() }
    const expected = {}
    const fnpatch = (d) => {
        delete d.value
        delete d.other
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('function to target', function (t) {
    const target = { prop: () => {} }
    const patch = { prop: {} }
    const expected = { prop: {} }
    const fnpatch = (d) => {
        d.prop = {}
    }

    testPatchUnpatch({
        t,
        target,
        patch,
        expected,
        encodedecode: false,
        fnpatch,
    })
})

test('target to function', function (t) {
    const f = () => {}
    const target = { prop: {} }
    const patch = { prop: f }
    const expected = { prop: f }
    const fnpatch = (d) => {
        d.prop = f
    }

    testPatchUnpatch({
        t,
        target,
        patch,
        expected,
        encodedecode: false,
        fnpatch,
    })
})

test('plain to noplain', function (t) {
    function Foo() {}
    const instance = new Foo()
    instance.prop = 2

    const target = { prop: instance }
    const patch = { prop: { deep: true } }
    const expected = { prop: { deep: true } }
    const fnpatch = (d) => {
        d.prop = { deep: true }
    }

    const { mutations } = testPatchUnpatch({
        t,
        target,
        patch,
        expected,
        encodedecode: false,
        fnpatch,
    })
    t.is(mutations.length, 1)
})

test('noplain to plain', function (t) {
    function Foo() {}
    const instance = new Foo()
    instance.prop = 2

    const target = { prop: { deep: true } }
    const patch = { prop: instance }
    const expected = { prop: instance }
    const fnpatch = (d) => {
        d.prop = instance
    }

    testPatchUnpatch({
        t,
        target,
        patch,
        expected,
        encodedecode: false,
        fnpatch,
    })
})

test.skip('syntax mutations', function (t) {
    const target = {
        value: false,
        prop: false,
        last: { value: false },
        lastlast: { value: false },
    }
    const patch = {
        value: true,
        prop: { deep: true },
        last: { value: true },
        lastlast: true,
    }

    const { mutations } = applyPatch(target, patch)
    t.is(mutations.length, 4)
    t.deepEqual(mutations[0], {
        prop: 'value',
        old_value: false,
        path: ['value'],
        object: target,
    })
    t.deepEqual(mutations[1], {
        prop: 'prop',
        old_value: false,
        path: ['prop'],
        object: target,
    })
    t.deepEqual(mutations[2], {
        prop: 'value',
        old_value: false,
        path: ['last', 'value'],
        object: target.last,
    })
    t.deepEqual(mutations[3], {
        prop: 'lastlast',
        old_value: { value: false },
        path: ['lastlast'],
        object: target,
    })
})

test.skip('syntax mutations on top level', function (t) {
    const target = {}
    const patch = 'bar'

    const { mutations } = applyPatch(target, patch)
    t.is(mutations.length, 1)
    t.deepEqual(mutations[0], {
        prop: '',
        old_value: target,
        path: [],
        object: { '': patch },
    })
})

test.skip('syntax mutations when using delete', function (t) {
    const target = {}
    const patch = TYPE.Delete()

    const { mutations } = applyPatch(target, patch)
    t.is(mutations.length, 1)
    t.deepEqual(mutations[0], {
        prop: '',
        old_value: target,
        path: [],
        object: {},
    })
})

test('Deep objects/array must be merged instead of referenced', function (t) {
    const target = {}
    const patch = { object: { a: true }, array: [{ b: true }] }
    const { result } = applyPatch(target, patch)

    t.is(result, target)
    t.deepEqual(result, patch)
    t.not(result.object, patch.object)
    t.not(result.array, patch.array)
    t.not(result.array[0], patch.array[0])
})

test('Deep objects/array must be merged instead of referenced 2', function (t) {
    const target = { array: [0, 1, 2] }
    const patch = { array: [3, 4] }
    const expected = { array: [3, 4] }
    const fnpatch = (d) => {
        d.array = [3, 4]
    }

    testPatchUnpatch({ t, target, patch, expected, reverse: false, fnpatch })
    t.deepEqual(target.array, patch.array)
    t.not(target.array, patch.array)
    // console.log(target, patch)
})

test('array complex', function (t) {
    const target = { array: [0, 1, 2], string: 'yep', arrstr: [1, 2] }
    const patch = { array: [3, 4], string: ['a', 'b'], arrstr: '12' }
    const expected = { array: [3, 4], string: ['a', 'b'], arrstr: '12' }
    const fnpatch = (d) => {
        d.array = [3, 4]
        d.string = ['a', 'b']
        d.arrstr = '12'
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('from object to array', function (t) {
    const target = { objarr: { value: true } }
    const patch = { objarr: [0, 1] }
    const expected = { objarr: [0, 1] }
    const fnpatch = (d) => {
        d.objarr = [0, 1]
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('from array to object', function (t) {
    const target = { objarr: [0, 1] }
    const patch = { objarr: {} }
    const expected = { objarr: [0, 1] }

    testPatchUnpatch({ t, target, patch, expected })
})

test('should assign `null` values', function (t) {
    const target = { value: false }
    const patch = { value: null }
    const expected = { value: null }
    const fnpatch = (d) => {
        d.value = null
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('should assign `undefined` values', function (t) {
    const target = { value: false }
    const patch = { value: undefined, value2: undefined }
    const expected = { value: undefined, value2: undefined }
    const fnpatch = (d) => {
        d.value = undefined
        d.value2 = undefined
    }

    testPatchUnpatch({
        t,
        target,
        patch,
        expected,
        encodedecode: false,
        fnpatch,
    })
})

test('should assign non array/buffer/typed-array/plain-target source values directly', function (t) {
    function Foo() {}
    const values = [
        new Foo(),
        new Boolean(),
        new Date(),
        Foo,
        new Number(),
        new String(),
        new RegExp(),
    ]

    const target = {}
    const patch = { values: values }
    const expected = { values: values }
    const fnpatch = (d) => {
        d.values = values
    }

    testPatchUnpatch({
        t,
        target,
        patch,
        expected,
        encodedecode: false,
        fnpatch,
    })
})

test('same patch as target generate no mutations', function (t) {
    const target = { value: false }
    const patch = {}
    const expected = { value: false }

    const { mutations, unpatch } = testPatchUnpatch({
        t,
        target,
        patch,
        expected,
    })
    t.is(mutations.length, 0)
    t.deepEqual(unpatch, {})
})

test('same array as patch generate no mutations even if we mutate target object', function (t) {
    const target = { array: [1, 2, 3] }
    const original = target.array
    original.push(4)
    const patch = { array: target.array }
    const expected = { array: [1, 2, 3, 4] }
    const { mutations, unpatch } = testPatchUnpatch({
        t,
        target,
        patch,
        expected,
        encodedecode: false,
    })
    t.is(mutations.length, 0)
    t.deepEqual(unpatch, {})
    t.is(target.array, original)
})

test('slice array as patch generate mutation', function (t) {
    const target = { array: [1, 2, 3] }
    const original = target.array
    const patch = { array: target.array.slice(0).concat(4) }
    const expected = { array: [1, 2, 3, 4] }
    const fnpatch = (d) => {
        d.array = target.array.slice(0).concat(4)
    }

    const { mutations, unpatch } = testPatchUnpatch({
        t,
        target,
        patch,
        expected,
        fnpatch,
    })
    t.is(mutations.length, 1)
    t.not(target.array, original)
})

test('no mutations', function (t) {
    const target = { value: false }
    const patch = {}
    const expected = { value: false }

    const { mutations, unpatch } = testPatchUnpatch({
        t,
        target,
        patch,
        expected,
    })
    t.is(mutations.length, 0)
    t.deepEqual(unpatch, {})
})

test('checking different types and mutating multiple deep values', function (t) {
    const target = {
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
                            undefined: 'undefined',
                        },
                    },
                },
            },
            arrobj: ['a', 'b', 'c'],
            g: 'fff',
            d2: {
                d22: {
                    d222: 312432,
                    d223: {
                        hola: 'lalala',
                    },
                },
            },
        },
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
        function: function () {
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
                            undefined: undefined,
                        },
                    },
                },
            },
            arrobj: ['a', 'b', 'c', 'd'],
            g: 123,
            d2: {
                d22: {
                    d222: 555,
                    d223: {
                        hola: 'mundo',
                    },
                },
            },
        },
    }
    const expected = { ...patch, string: 'string' }

    const { mutations } = testPatchUnpatch({
        t,
        target,
        patch,
        expected,
        encodedecode: false,
    })
    t.is(mutations.length, 30)
})

// Inner arrays
// Inner arrays
// Inner arrays
// Inner arrays
// Inner arrays
// Inner arrays
// Inner arrays
// Inner arrays
// Inner arrays

test('adding item to array ', function (t) {
    const target = { objarr: [0, 1] }
    const patch = { objarr: { 3: { hello: 'world' } } }
    const expected = { objarr: [0, 1, undefined, { hello: 'world' }] }
    const fnpatch = (d) => {
        d.objarr[3] = { hello: 'world' }
    }

    const { mutations } = testPatchUnpatch({
        t,
        target,
        patch,
        expected,
        fnpatch,
    })
    t.is(mutations.length, 2)
    t.is(mutations[1].prop, 'length')
})

test('adding multiple item to array ', function (t) {
    const target = { objarr: [0, 1] }
    const patch = { objarr: { 3: 3, 5: 5 } }
    const expected = { objarr: [0, 1, undefined, 3, undefined, 5] }
    const fnpatch = (d) => {
        d.objarr[3] = 3
        d.objarr[5] = 5
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('changing length of array', function (t) {
    const target = { objarr: [0, 1] }
    const patch = { objarr: { length: 4 } }
    const expected = { objarr: [0, 1, undefined, undefined] }
    const fnpatch = (d) => {
        d.objarr.length = 4
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('editing length of array and also adding extra values', function (t) {
    const target = { objarr: [0, 1] }
    const patch = { objarr: { 3: 3, length: 5 } }
    const expected = { objarr: [0, 1, undefined, 3, undefined] }
    const fnpatch = (d) => {
        d.objarr[3] = 3
        d.objarr.length = 5
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('Inner plain array', function (t) {
    const target = [{ b: false }]
    const patch = { 0: { b: true } }
    const expected = [{ b: true }]
    const fnpatch = (d) => {
        d[0].b = true
    }

    const { result } = testPatchUnpatch({ t, target, patch, expected, fnpatch })
    t.is(target, result)
})

test('Editing top level', function (t) {
    const target = { array: ['a', 'b', 'c'] }
    const patch = { array: { 0: 'A', 3: 'D', 4: 'E' } }
    const expected = { array: ['A', 'b', 'c', 'D', 'E'] }
    const fnpatch = (d) => {
        d.array[0] = 'A'
        d.array[3] = 'D'
        d.array[4] = 'E'
    }

    testPatchUnpatch({
        t,
        target,
        patch,
        expected,
        fnpatch,
    })
})

test('Editing subobjects', function (t) {
    const target = { array: [{ a: false }] }
    const patch = { array: { 0: { a: true } } }
    const expected = { array: [{ a: true }] }
    const fnpatch = (d) => {
        d.array[0].a = true
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('Deleting subobject', function (t) {
    const target = { array: [{ a: true }] }
    const patch = { array: { 0: { a: TYPE.Delete() } } }
    const expected = { array: [{}] }
    const fnpatch = (d) => {
        delete d.array[0].a
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('Updating sub-subarray', function (t) {
    const target = { array: [{ subarray: ['a'] }] }
    const array = target.array
    const subarray = target.array[0].subarray
    const patch = {
        array: { 0: { subarray: { 0: 'b' } } },
    }
    const expected = { array: [{ subarray: ['b'] }] }
    const fnpatch = (d) => {
        d.array[0].subarray[0] = 'b'
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
    t.is(array, target.array)
    t.is(subarray, target.array[0].subarray)
})

test('Replacing sub-subarray', function (t) {
    const target = { array: [{ subarray: ['a'] }] }
    const array = target.array
    const subarray = target.array[0].subarray
    const patch = {
        array: { 0: { subarray: ['b', 'c'] } },
    }
    const expected = { array: [{ subarray: ['b', 'c'] }] }
    const fnpatch = (d) => {
        d.array[0].subarray = ['b', 'c']
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
    t.is(array, target.array)
    t.not(subarray, target.array[0].subarray)
})

test('Pushing subobjects', function (t) {
    const target = ['A']
    const patch = { 2: { a: true } }
    const expected = ['A', undefined, { a: true }]
    const fnpatch = (d) => {
        d[2] = { a: true }
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('Editing subobject and creating a new one', function (t) {
    const target = [{ a: false }]
    const patch = { 0: { a: true }, 1: { b: true } }
    const expected = [{ a: true }, { b: true }]
    const fnpatch = (d) => {
        d[0].a = true
        d[1] = { b: true }
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('Mutating array of array with a splice', function (t) {
    const target = { array: [{ array2: [{ array3: [1, 2] }] }] }
    const instancearray = target.array[0].array2[0].array3
    const expected = { array: [{ array2: [{ array3: [1, 2, 3] }] }] }
    const patch = {
        array: {
            0: { array2: { 0: { array3: TYPE.Splice(2, 0, 3) } } },
        },
    }
    const fnpatch = (d) => {
        d.array[0].array2[0].array3.splice(2, 0, 3)
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
    t.is(instancearray, target.array[0].array2[0].array3)
})

test('Changing lengh array', function (t) {
    const target = ['A']
    const patch = { length: 2 }
    const expected = ['A', undefined]
    const fnpatch = (d) => {
        d.length = 2
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('adding inner arrays', function (t) {
    const target = { objarr: [0, 1, [false], [[]]] }
    const patch = { objarr: { 2: [2], 3: { 0: { 0: [3] } } } }
    const expected = { objarr: [0, 1, [2], [[[3]]]] }
    const fnpatch = (d) => {
        d.objarr[2] = [2]
        d.objarr[3][0][0] = [3]
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('adding inner arrays as top level', function (t) {
    const target = [0, 1, [false], [[]]]
    const patch = { length: 5, 2: [2], 3: { 2: 4, 0: { 0: [3] } } }
    const expected = [0, 1, [2], [[[3]], undefined, 4], undefined]
    const fnpatch = (d) => {
        d.length = 5
        d[2] = [2]
        d[3][0][0] = [3]
        d[3][2] = 4
    }

    testPatchUnpatch({ t, target, patch, expected, fnpatch })
})

test('complex patch to array', function (t) {
    const target = { objarr: [0, 1, { value: false }] }
    const patch = {
        objarr: {
            2: { value: true },
            4: { value: true },
            5: TYPE.Multi([2, 3], TYPE.Swap(0, 1)),
        },
    }
    const expected = {
        objarr: [0, 1, { value: true }, undefined, { value: true }, [3, 2]],
    }
    const fnpatch = (d) => {
        d.objarr[2] = { value: true }
        d.objarr[4] = { value: true }
        d.objarr[5] = TYPE.Multi([2, 3], TYPE.Swap(0, 1))
    }

    testPatchUnpatch({
        t,
        target,
        patch,
        expected,
        fnpatch,
    })
})
