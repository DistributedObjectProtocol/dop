import test from 'ava'
import { applyPatch, TYPE } from '../'
import forEachObject from '../src/util/forEachObject'
import { is, isPlain, isPlainObject } from '../src/util/is'
import { setDeep } from '../src/util/getset'

export function producePatch(object, fn) {
    const root = {}
    const mutations = []
    const patch = {}
    let storing = false
    forEachObject(
        { draft: object },
        root,
        ({ origin, destiny, prop, path }) => {
            const origin_value = origin[prop]
            const destiny_value = destiny[prop]
            const tof_origin = is(origin_value)
            const tof_destiny = is(destiny_value)
            if (isPlain(origin_value)) {
                if (
                    !destiny.hasOwnProperty(prop) ||
                    tof_origin != tof_destiny
                ) {
                    const path_copy = path.slice(1)
                    destiny[prop] = new Proxy(tof_origin == 'array' ? [] : {}, {
                        set: (object, prop, value) => {
                            if (storing) {
                                mutations.push([
                                    path_copy.concat(prop),
                                    isPlainObject(value)
                                        ? TYPE.Replace(value)
                                        : value,
                                ])
                            }
                            object[prop] = value
                            return true
                        },
                        deleteProperty: (object, prop) => {
                            if (storing) {
                                mutations.push([
                                    path_copy.concat(prop),
                                    TYPE.Delete(),
                                ])
                            }
                            delete object[prop]
                            return true
                        },
                    })
                }
            } else {
                destiny[prop] = origin_value
                return false // we dont go deeper
            }
        }
    )

    storing = true
    fn(root.draft)
    storing = false
    mutations.forEach((mutation) => setDeep(patch, mutation[0], mutation[1]))
    return patch
}

test('basic', function (t) {
    let copy_draft
    const object = { change: false, obj: { deepchange: false, delete: 0 } }

    const patch = producePatch(object, (draft) => {
        copy_draft = draft
        draft.change = true
        draft.obj.deepchange = true
        draft.obj.new = 'string'
        draft.obj.newobject = { hello: 'world' }
        delete draft.obj.delete
    })

    applyPatch(object, patch)
    t.deepEqual(object, copy_draft)
})
