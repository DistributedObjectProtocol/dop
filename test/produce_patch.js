import test from 'ava'
import { applyPatch, merge } from '../src'
import { producePatch } from '../src/util/patches'
import { isPlainObject, isArray } from '../src/util/is'

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

test('mutations: *', function (t) {
    let copy_draft
    const object = {
        change: false,
        array: [1, new Date(), 3],
        obj: { deepchange: false, delete: 0 },
    }

    const { patch, mutations } = producePatch(object, (draft) => {
        t.deepEqual(object, draft)

        // mutations
        delete draft.obj.delete
        draft.change = true
        draft.array[3] = 4
        const arr = []
        draft.array.push(arr)
        draft.array.shift()
        draft.array.reverse()
        draft.array.shift()
        draft.array.reverse()
        draft.array.unshift('added')
        arr.push(1234)
        draft.obj.deepchange = true
        draft.obj.new = 'string'
        draft.obj.newobject = { hello: 'world' }

        copy_draft = merge({}, draft)
        t.deepEqual(copy_draft, draft)
    })

    console.log(mutations)
    console.log(patch)
    applyPatch(object, patch)
    t.deepEqual(object, copy_draft)
})
