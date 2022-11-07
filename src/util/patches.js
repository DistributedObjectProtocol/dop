import { TYPE } from '../index'
import { is, isPlain, isPlainObject } from './is'
import { setDeep, getDeep } from './getset'
import { forEachDeep } from './forEach'

export function producePatch(baseobject, callback) {
    const draft = {}
    const mutations = []
    let storing = false

    forEachDeep({ draft: baseobject }, ({ object, prop, path }) => {
        const origin = object
        const destiny = getDeep(draft, path.slice(0, path.length - 1))
        const origin_value = origin[prop]
        const destiny_value = destiny[prop]
        const tof_origin = is(origin_value)
        const tof_destiny = is(destiny_value)

        if (
            isPlain(origin_value) &&
            (!destiny.hasOwnProperty(prop) || tof_origin != tof_destiny)
        ) {
            destiny[prop] = new Proxy(tof_origin == 'array' ? [] : {}, {
                set: (object, prop, value) => {
                    if (storing) {
                        mutations.push([
                            path.slice(1).concat(prop),
                            isPlainObject(value) && isPlainObject(object[prop])
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
                            path.slice(1).concat(prop),
                            TYPE.Delete(),
                        ])
                    }
                    delete object[prop]
                    return true
                },
            })
            return true
        } else {
            destiny[prop] = origin_value
            return false // we dont go deeper
        }
    })

    storing = true
    callback(draft.draft)
    storing = false

    const patch = createPatchFromMutations(mutations)
    return { patch, mutations }
}

export function createPatchFromMutations(mutations) {
    const patch = {}
    mutations.forEach((mutation) => setDeep(patch, mutation[0], mutation[1]))
    return patch
}

export function createPatchAndUnpatchFromMutations(mutations, object) {
    const patch = {}
    const unpatch = {}
    mutations.forEach(({ path, old_value }) => {
        setDeep(patch, path, getDeep(object, path))
        setDeep(unpatch, path, old_value)
    })
    return { patch, unpatch }
}
