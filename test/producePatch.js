import test from 'ava'
import { applyPatch, merge } from '../src'
import { producePatch } from '../src/util/producePatch'

test('basic', function (t) {
    let copy_draft
    const object = {
        change: false,
        array: [1, 2, 3],
        obj: { deepchange: false, delete: 0 },
    }

    const patch = producePatch(object, (draft) => {
        copy_draft = draft
        draft.change = true
        draft.array[3] = 4
        draft.obj.deepchange = true
        draft.obj.new = 'string'
        draft.obj.newobject = { hello: 'world' }
        delete draft.obj.delete
    })

    applyPatch(object, patch)
    t.deepEqual(object, copy_draft)
    t.is(object.array === copy_draft.array, false)

    console.log(copy_draft)
})
