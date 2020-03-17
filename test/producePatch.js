import test from 'ava'
import { producePatch } from '../src/api/produce'

test('basic', function(t) {
    const object = { change: false, obj: { change: false, todelete: 0 } }
    producePatch(object, draft => {
        draft.change = true
        draft.obj.change = true
        draft.obj.new = 'string'
        delete draft.obj.todelete
    })

    t.is(1, 1)
})
