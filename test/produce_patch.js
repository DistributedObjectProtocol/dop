import test from 'ava'
import { applyPatch, merge, producePatch } from '../src'
import { isPlainObject, isArray } from '../src/util/is'
import { testPatchUnpatch } from './utils'

test('types: Draft is a completly new copy with proxies', function (t) {
    const object = {
        array: [{}, []],
        object: { o: new Object(), a: new Array() },
    }

    producePatch(object, (draft) => {
        t.deepEqual(object, draft)
        t.not(object, draft)
        t.not(object.array, draft.array)
        t.not(object.array[0], draft.array[0])
        t.not(object.array[1], draft.array[1])
        t.not(object.object, draft.object)
        t.not(object.object.o, draft.object.o)
        t.not(object.object.a, draft.object.a)
    })
})

test('types: Array shoult not be the same', function (t) {
    const array = []
    producePatch(array, (draft) => {
        t.not(array, draft)
    })
})

test('types: Not an object or array', function (t) {
    producePatch(12345, (draft) => {
        t.is(12345, draft)
    })
})

test('types: If is not plain object or array we ignore it', function (t) {
    const date = new Date()
    producePatch(date, (draft) => {
        t.is(date, draft)
    })
})

test('api: patch and mutations is the output', function (t) {
    const date = new Date()
    const { patch, mutations } = producePatch(date, () => {})
    t.true(isPlainObject(patch))
    t.true(isArray(mutations))
})

test('mutations: new object', function (t) {
    const target = {}
    const expected = { a: { bb: {} } }
    const { patch } = producePatch(target, (d) => {
        d.a = { bb: {} }
    })

    testPatchUnpatch({ t, target, patch, expected })
})

test('mutations: Array.unshift', function (t) {
    const target = { array: [1, 2, 3, 4] }
    const expected = { array: [0, 1, 2, 3, 4] }
    const { patch, mutations } = producePatch(target, (d) => {
        d.array.unshift(0)
    })

    // console.log(mutations.length, mutations)

    testPatchUnpatch({ t, target, patch, expected, reverse: false })
})

test.only('mutations: *', function (t) {
    let copy_draft
    const target = {
        change: false,
        array: [1, new Date(), 3],
        obj: { deepchange: false, delete: 0 },
    }
    const newobject = { hello: 'world' }

    const { patch, mutations } = producePatch(target, (draft) => {
        t.deepEqual(target, draft)

        // mutations
        delete draft.obj.delete
        draft.change = true
        draft.array[3] = 4
        const arr = []
        draft.array.shift()
        draft.array.reverse()
        draft.array.unshift('new')
        arr.push(1234)
        draft.obj.deepchange = true
        draft.obj.new = 'string'
        draft.obj.newobject = newobject

        copy_draft = merge({}, draft)
        t.deepEqual(copy_draft, draft)
    })

    // console.log(mutations.length)
    // console.log(patch)
    applyPatch(target, patch)
    t.is(target.obj.newobject, newobject)
    t.deepEqual(target, copy_draft)
})
