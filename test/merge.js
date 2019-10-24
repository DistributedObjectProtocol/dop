import test from 'ava'
import { merge } from '../'
import lodashStable from 'lodash' // https://github.com/lodash/lodash/blob/master/test/merge.test.js

test('should merge `source` into `object`', function(t) {
    var names = {
        characters: [{ name: 'barney' }, { name: 'fred' }]
    }

    var ages = {
        characters: [{ age: 36 }, { age: 40 }]
    }

    var heights = {
        characters: [{ height: '5\'4"' }, { height: '5\'5"' }]
    }

    var expected = {
        characters: [
            { name: 'barney', age: 36, height: '5\'4"' },
            { name: 'fred', age: 40, height: '5\'5"' }
        ]
    }

    t.deepEqual(merge(names, ages, heights), expected)
})

test.skip('should merge sources containing circular references', function(t) {
    var object = {
        foo: { a: 1 },
        bar: { a: 2 }
    }

    var source = {
        foo: { b: { c: { d: {} } } },
        bar: {}
    }

    source.foo.b.c.d = source
    source.bar.b = source.foo.b

    var actual = merge(object, source)

    t.notDeepEqual(actual.bar.b, actual.foo.b)
    t.deepEqual(actual.foo.b.c.d, actual.foo.b.c.d.foo.b.c.d)
})

test('should work with four arguments', function(t) {
    var expected = { a: 4 },
        actual = merge({ a: 1 }, { a: 2 }, { a: 3 }, expected)

    t.deepEqual(actual, expected)
})

test('should merge onto function `object` values', function(t) {
    function Foo() {}

    var source = { a: 1 },
        actual = merge(Foo, source)

    t.deepEqual(actual, Foo)
    t.deepEqual(Foo.a, 1)
})

test('should merge first source object properties to function', function(t) {
    var fn = function() {},
        object = { prop: {} },
        actual = merge({ prop: fn }, object)

    t.deepEqual(actual, object)
})

test('should merge first and second source object properties to function', function(t) {
    var fn = function() {},
        object = { prop: {} },
        actual = merge({ prop: fn }, { prop: fn }, object)

    t.deepEqual(actual, object)
})

test('should not merge onto function values of sources', function(t) {
    var source1 = { a: function() {} },
        source2 = { a: { b: 2 } },
        expected = { a: { b: 2 } },
        actual = merge({}, source1, source2)

    t.deepEqual(actual, expected)
    t.true(!('b' in source1.a))

    actual = merge(source1, source2)
    t.deepEqual(actual, expected)
})

test('should merge onto non-plain `object` values', function(t) {
    function Foo() {}

    var object = new Foo(),
        actual = merge(object, { a: 1 })

    t.deepEqual(actual, object)
    t.deepEqual(object.a, 1)
})

test('should treat sparse array sources as dense', function(t) {
    var array = [1]
    array[2] = 3

    var actual = merge([0], array),
        expected = array.slice()

    expected[1] = undefined

    t.true('1' in actual)
    t.deepEqual(actual, expected)
})

test.skip('should merge `arguments` objects', function(t) {
    var object1 = { value: args },
        object2 = { value: { '3': 4 } },
        expected = { '0': 1, '1': 2, '2': 3, '3': 4 },
        actual = merge(object1, object2)

    t.true(!('3' in args))
    t.true(!isArguments(actual.value))
    t.deepEqual(actual.value, expected)
    object1.value = args

    actual = merge(object2, object1)
    t.true(!isArguments(actual.value))
    t.deepEqual(actual.value, expected)

    expected = { '0': 1, '1': 2, '2': 3 }

    actual = merge({}, object1)
    t.true(!isArguments(actual.value))
    t.deepEqual(actual.value, expected)
})

test.skip('should merge typed arrays', function(t) {
    var typedArrays = [
        'Float32Array',
        'Float64Array',
        'Int8Array',
        'Int16Array',
        'Int32Array',
        'Uint8Array',
        'Uint8ClampedArray',
        'Uint16Array',
        'Uint32Array'
    ]

    var array1 = [0],
        array2 = [0, 0],
        array3 = [0, 0, 0, 0],
        array4 = [0, 0, 0, 0, 0, 0, 0, 0]

    var arrays = [
            array2,
            array1,
            array4,
            array3,
            array2,
            array4,
            array4,
            array3,
            array2
        ],
        buffer = ArrayBuffer && new ArrayBuffer(8)

    var expected = lodashStable.map(typedArrays, function(type, index) {
        var array = arrays[index].slice()
        array[0] = 1
        return root[type] ? { value: array } : false
    })

    var actual = lodashStable.map(typedArrays, function(type) {
        var Ctor = root[type]
        return Ctor ? merge({ value: new Ctor(buffer) }, { value: [1] }) : false
    })

    t.true(lodashStable.isArray(actual))
    t.deepEqual(actual, expected)

    expected = lodashStable.map(typedArrays, function(type, index) {
        var array = arrays[index].slice()
        array.push(1)
        return root[type] ? { value: array } : false
    })

    actual = lodashStable.map(typedArrays, function(type, index) {
        var Ctor = root[type],
            array = lodashStable.range(arrays[index].length)

        array.push(1)
        return Ctor
            ? merge({ value: array }, { value: new Ctor(buffer) })
            : false
    })

    t.true(lodashStable.isArray(actual))
    t.deepEqual(actual, expected)
})

test('should assign `null` values', function(t) {
    var actual = merge({ a: 1 }, { a: null })
    t.deepEqual(actual.a, null)
})

test('should assign non array/buffer/typed-array/plain-object source values directly', function(t) {
    function Foo() {}

    var values = [
            new Foo(),
            new Boolean(),
            new Date(),
            Foo,
            new Number(),
            new String(),
            new RegExp()
        ],
        expected = lodashStable.map(values, () => true)

    var actual = lodashStable.map(values, function(value) {
        var object = merge({}, { a: value, b: { c: value } })
        return object.a === value && object.b.c === value
    })
    t.deepEqual(actual, expected)
})

test.skip('should deep clone array/typed-array/plain-object source values', function(t) {
    var typedArray = Uint8Array ? new Uint8Array([1]) : { buffer: [1] }

    var props = ['0', 'buffer', 'a'],
        values = [[{ a: 1 }], typedArray, { a: [1] }],
        expected = lodashStable.map(values, () => true)

    var actual = lodashStable.map(values, function(value, index) {
        var key = props[index],
            object = merge({}, { value: value }),
            subValue = value[key],
            newValue = object.value,
            newSubValue = newValue[key]

        return (
            newValue !== value &&
            newSubValue !== subValue &&
            lodashStable.isEqual(newValue, value)
        )
    })

    t.deepEqual(actual, expected)
})

test('should not augment source objects', function(t) {
    var source1 = { a: [{ a: 1 }] },
        source2 = { a: [{ b: 2 }] },
        actual = merge({}, source1, source2)

    t.deepEqual(source1.a, [{ a: 1 }])
    t.deepEqual(source2.a, [{ b: 2 }])
    t.deepEqual(actual.a, [{ a: 1, b: 2 }])

    var source1 = { a: [[1, 2, 3]] },
        source2 = { a: [[3, 4]] },
        actual = merge({}, source1, source2)

    t.deepEqual(source1.a, [[1, 2, 3]])
    t.deepEqual(source2.a, [[3, 4]])
    t.deepEqual(actual.a, [[3, 4, 3]])
})

test('should merge plain objects onto non-plain objects', function(t) {
    function Foo(object) {
        lodashStable.assign(this, object)
    }

    var object = { a: 1 },
        actual = merge(new Foo(), object)

    t.true(actual instanceof Foo)
    t.deepEqual(actual, new Foo(object))

    actual = merge([new Foo()], [object])
    t.true(actual[0] instanceof Foo)
    t.deepEqual(actual, [new Foo(object)])
})

test('should not overwrite existing values with `undefined` values of object sources', function(t) {
    var actual = merge({ a: 1 }, { a: undefined, b: undefined })
    var expected = { a: 1, b: undefined }
    t.deepEqual(actual, expected)
})

test('should not overwrite existing values with `undefined` values of array sources', function(t) {
    var array = [1]
    array[2] = 3

    var actual = merge([4, 5, 6], array),
        expected = [1, 5, 3]

    t.deepEqual(actual, expected)

    array = [1, , 3]
    array[1] = undefined

    actual = merge([4, 5, 6], array)
    t.deepEqual(actual, expected)
})

test('should skip merging when `object` and `source` are the same value', function(t) {
    var object = {},
        pass = true

    Object.defineProperty(object, 'a', {
        configurable: true,
        enumerable: true,
        get: function() {
            pass = false
        },
        set: function() {
            pass = false
        }
    })

    merge(object, object)
    t.true(pass)
})

// test('should convert values to arrays when merging arrays of `source`', function(t) {
//     var object = { a: { '1': 'y', b: 'z', length: 2 } },
//         actual = merge(object, { a: ['x'] })

//     t.deepEqual(actual, { a: ['x', 'y'] })

//     actual = merge({ a: {} }, { a: [] })
//     t.deepEqual(actual, { a: [] })
// })

// test('should convert strings to arrays when merging arrays of `source`', function(t) {
//     var object = { a: 'abcde' },
//         actual = merge(object, { a: ['x', 'y', 'z'] })

//     t.deepEqual(actual, { a: ['x', 'y', 'z'] })
// })

// test('should not error on DOM elements', function(t) {
//     var object1 = { el: document && document.createElement('div') },
//         object2 = { el: document && document.createElement('div') },
//         pairs = [[{}, object1], [object1, object2]],
//         expected = lodashStable.map(pairs, ()=>true)

//     var actual = lodashStable.map(pairs, function(pair) {
//         try {
//             return merge(pair[0], pair[1]).el === pair[1].el
//         } catch (e) {}
//     })

//     t.deepEqual(actual, expected)
// })
