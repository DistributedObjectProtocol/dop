import test from 'ava'
import { applyPatch, merge, Delete } from '../'

function testUnpatch(t, object, patch, expected) {
    const cloned = merge({}, object)
    const { unpatch, mutations } = applyPatch(object, patch)
    t.deepEqual(object, expected)
    applyPatch(object, unpatch)
    t.deepEqual(object, cloned)
    return { unpatch, mutations }
}

test.skip('syntax mutations', function(t) {})

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
    function Foo() {}
    const instance = new Foo()
    instance.prop = 2

    const object = { prop: 123 }
    const patch = { prop: { deep: true } }
    const expected = { prop: { deep: true } }

    applyPatch(object, patch)
    t.not(object.prop, patch.prop)
    t.deepEqual(object, expected)
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

test('object to object/instance', function(t) {
    function Foo() {}
    const instance = new Foo()
    instance.prop = 2

    const object = { prop: instance }
    const patch = { prop: { deep: true } }
    const expected = { prop: { deep: true } }

    testUnpatch(t, object, patch, expected)
})

test('object/instance to object', function(t) {
    function Foo() {}
    const instance = new Foo()
    instance.prop = 2

    const object = { prop: { deep: true } }
    const patch = { prop: instance }
    const expected = { prop: instance }

    testUnpatch(t, object, patch, expected)
})

// test('should merge onto non-plain `object` values', function(t) {
//     function Foo() {}

//     var object = new Foo(),
//         actual = merge(object, { a: 1 })

//     t.deepEqual(actual, object)
//     t.deepEqual(object.a, 1)
// })

// test('should treat sparse array sources as dense', function(t) {
//     var array = [1]
//     array[2] = 3

//     var actual = merge([0], array),
//         expected = array.slice()

//     expected[1] = undefined

//     t.true('1' in actual)
//     t.deepEqual(actual, expected)
// })

// test('should assign `null` values', function(t) {
//     var actual = merge({ a: 1 }, { a: null })
//     t.deepEqual(actual.a, null)
// })

// test(
//     name +
//         ': should assign non array/buffer/typed-array/plain-object source values directly',
//     function(t) {
//         function Foo() {}

//         var values = [
//                 new Foo(),
//                 new Boolean(),
//                 new Date(),
//                 Foo,
//                 new Number(),
//                 new String(),
//                 new RegExp()
//             ],
//             expected = _.map(values, () => true)

//         var actual = _.map(values, function(value) {
//             var object = merge({}, { a: value, b: { c: value } })
//             return object.a === value && object.b.c === value
//         })
//         t.deepEqual(actual, expected)
//     }
// )

// test('should not augment source objects', function(t) {
//     var source1 = { a: [{ a: 1 }] },
//         source2 = { a: [{ b: 2 }] },
//         actual = merge({}, source1, source2)

//     t.deepEqual(source1.a, [{ a: 1 }])
//     t.deepEqual(source2.a, [{ b: 2 }])
//     t.deepEqual(actual.a, [{ a: 1, b: 2 }])

//     var source1 = { a: [[1, 2, 3]] },
//         source2 = { a: [[3, 4]] },
//         actual = merge({}, source1, source2)

//     t.deepEqual(source1.a, [[1, 2, 3]])
//     t.deepEqual(source2.a, [[3, 4]])
//     t.deepEqual(actual.a, [[3, 4, 3]])
// })

// test('should merge plain objects onto non-plain objects', function(
//     t
// ) {
//     function Foo(object) {
//         _.assign(this, object)
//     }

//     var object = { a: 1 },
//         actual = merge(new Foo(), object)

//     t.true(actual instanceof Foo)
//     t.deepEqual(actual, new Foo(object))

//     actual = merge([new Foo()], [object])
//     t.true(actual[0] instanceof Foo)
//     t.deepEqual(actual, [new Foo(object)])
// })

// test(
//     name +
//         ': should not overwrite existing values with `undefined` values of object sources',
//     function(t) {
//         var actual = merge({ a: 1 }, { a: undefined, b: undefined })
//         var expected = { a: 1, b: undefined }
//         t.deepEqual(actual, expected)
//     }
// )

// test(
//     name +
//         ': should not overwrite existing values with `undefined` values of array sources',
//     function(t) {
//         var array = [1]
//         array[2] = 3

//         var actual = merge([4, 5, 6], array),
//             expected = [1, 5, 3]

//         t.deepEqual(actual, expected)

//         array = [1, , 3]
//         array[1] = undefined

//         actual = merge([4, 5, 6], array)
//         t.deepEqual(actual, expected)
//     }
// )

// test(
//     name +
//         ': should skip merging when `object` and `source` are the same value',
//     function(t) {
//         var object = {},
//             pass = true

//         Object.defineProperty(object, 'a', {
//             configurable: true,
//             enumerable: true,
//             get: function() {
//                 pass = false
//             },
//             set: function() {
//                 pass = false
//             }
//         })

//         merge(object, object)
//         t.true(pass)
//     }
// )

// test(
//     name +
//         ': should convert strings to arrays when merging arrays of `source`',
//     function(t) {
//         var object = { a: 'abcde' },
//             actual = merge(object, { a: ['x', 'y', 'z'] })

//         t.deepEqual(actual, { a: ['x', 'y', 'z'] })
//     }
// )

// test('checking different types', function(t) {
//     const object = {
//         string: 'string',
//         boolean: true,
//         number: -123,
//         Infinity: -Infinity,
//         float: 1.234153454354341,
//         long: 12313214234312324353454534534,
//         null: null,
//         undefined: undefined,
//         NaN: NaN,
//         symbol: Symbol('sym'),
//         date: new Date(),
//         regexp: /molamazo/g,
//         f: () => {},
//         function: function() {
//             console.log(arguments)
//         },
//         obj: { lolo: 111 },
//         arr: [1, 2, 3, { La: 123 }],
//         array: [567],
//         arrobj: { 0: 1, 1: 2 },
//         d: {
//             a: 11,
//             array: [1, 2, 3, { abc: 123 }],
//             d: {
//                 d1: 13,
//                 d2: {
//                     d21: 123,
//                     d22: {
//                         d221: 12,
//                         d223: {
//                             hola: 'hola',
//                             undefined: undefined
//                         }
//                     }
//                 }
//             },
//             arrobj: ['a', 'b', 'c', 'd'],
//             g: 123,
//             d2: {
//                 d22: {
//                     d222: 25,
//                     d223: {
//                         hola: 'mundo'
//                     }
//                 }
//             }
//         }
//     }

//     var actual = merge({}, object)
//     var actual_lodash = {}
//     var actual_rambda = R.merge({}, object)
//     _.merge(actual_lodash, object)
//     t.deepEqual(object, actual)
//     t.deepEqual(object, actual_lodash)
//     t.deepEqual(object, actual_rambda)
//     t.not(object.obj, actual.obj)
//     t.not(object.obj, actual_lodash.obj)
//     // t.not(object.obj, actual_rambda.obj) // this fails because Rambda makes shallow copies of objects
//     t.not(object.obj, actual.arr)
//     t.not(object.arr, actual_lodash.arr)
//     // t.not(object.arr, actual_rambda.arr) // this fails because Rambda makes shallow copies of arrays
// })

// test(
//     name +
//         ': should convert values to arrays when merging arrays of `source`',
//     function(t) {
//         var object = { a: { '1': 'y', b: 'z', length: 2 } }
//         var actual = merge(object, { a: ['x'] })
//         var expected = { a: ['x', 'y'] }

//         t.deepEqual(actual, expected)

//         actual = merge({ a: {} }, { a: [] })
//         t.deepEqual(actual, { a: [] })
//     }
// )

// test.skip(
//     'should merge sources containing circular references',
//     function(t) {
//         var object = {
//             foo: { a: 1 },
//             bar: { a: 2 }
//         }

//         var source = {
//             foo: { b: { c: { d: {} } } },
//             bar: {}
//         }

//         source.foo.b.c.d = source
//         source.bar.b = source.foo.b

//         var actual = merge(object, source)

//         t.notDeepEqual(actual.bar.b, actual.foo.b)
//         t.deepEqual(actual.foo.b.c.d, actual.foo.b.c.d.foo.b.c.d)
//     }
// )

// test.skip('should merge `arguments` objects', function(t) {
//     var object1 = { value: args },
//         object2 = { value: { '3': 4 } },
//         expected = { '0': 1, '1': 2, '2': 3, '3': 4 },
//         actual = merge(object1, object2)

//     t.true(!('3' in args))
//     t.true(!isArguments(actual.value))
//     t.deepEqual(actual.value, expected)
//     object1.value = args

//     actual = merge(object2, object1)
//     t.true(!isArguments(actual.value))
//     t.deepEqual(actual.value, expected)

//     expected = { '0': 1, '1': 2, '2': 3 }

//     actual = merge({}, object1)
//     t.true(!isArguments(actual.value))
//     t.deepEqual(actual.value, expected)
// })

// test.skip('should deep clone array/typed-array/plain-object source values', function(t) {
//     var typedArray = Uint8Array ? new Uint8Array([1]) : { buffer: [1] }

//     var props = ['0', 'buffer', 'a'],
//         values = [[{ a: 1 }], typedArray, { a: [1] }],
//         expected = _.map(values, () => true)

//     var actual = _.map(values, function(value, index) {
//         var key = props[index],
//             object = merge({}, { value: value }),
//             subValue = value[key],
//             newValue = object.value,
//             newSubValue = newValue[key]

//         return (
//             newValue !== value &&
//             newSubValue !== subValue &&
//             _.isEqual(newValue, value)
//         )
//     })

//     t.deepEqual(actual, expected)
// })

// test.skip('should merge typed arrays', function(t) {
//     var typedArrays = [
//         'Float32Array',
//         'Float64Array',
//         'Int8Array',
//         'Int16Array',
//         'Int32Array',
//         'Uint8Array',
//         'Uint8ClampedArray',
//         'Uint16Array',
//         'Uint32Array'
//     ]

//     var array1 = [0],
//         array2 = [0, 0],
//         array3 = [0, 0, 0, 0],
//         array4 = [0, 0, 0, 0, 0, 0, 0, 0]

//     var arrays = [
//             array2,
//             array1,
//             array4,
//             array3,
//             array2,
//             array4,
//             array4,
//             array3,
//             array2
//         ],
//         buffer = ArrayBuffer && new ArrayBuffer(8)

//     var expected = _.map(typedArrays, function(type, index) {
//         var array = arrays[index].slice()
//         array[0] = 1
//         return root[type] ? { value: array } : false
//     })

//     var actual = _.map(typedArrays, function(type) {
//         var Ctor = root[type]
//         return Ctor ? merge({ value: new Ctor(buffer) }, { value: [1] }) : false
//     })

//     t.true(_.isArray(actual))
//     t.deepEqual(actual, expected)

//     expected = _.map(typedArrays, function(type, index) {
//         var array = arrays[index].slice()
//         array.push(1)
//         return root[type] ? { value: array } : false
//     })

//     actual = _.map(typedArrays, function(type, index) {
//         var Ctor = root[type],
//             array = _.range(arrays[index].length)

//         array.push(1)
//         return Ctor
//             ? merge({ value: array }, { value: new Ctor(buffer) })
//             : false
//     })

//     t.true(_.isArray(actual))
//     t.deepEqual(actual, expected)
// })

// test.skip('should not error on DOM elements', function(t) {
//     var object1 = { el: document && document.createElement('div') },
//         object2 = { el: document && document.createElement('div') },
//         pairs = [[{}, object1], [object1, object2]],
//         expected = _.map(pairs, () => true)

//     var actual = _.map(pairs, function(pair) {
//         try {
//             return merge(pair[0], pair[1]).el === pair[1].el
//         } catch (e) {}
//     })

//     t.deepEqual(actual, expected)
// })
