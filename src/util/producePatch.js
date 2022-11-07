import { TYPE } from '../index.js'
import { is, isPlain, isPlainObject, isArray } from './is.js'
import { getDeep } from './getset.js'
import { createPatchFromMutations } from './patches.js'
import { forEachDeep } from './forEach.js'

export default function producePatch(baseobject, callback) {
    const draft = {}
    const mutations = []
    const state = { storing: false }

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
            const addMutation = (value, prop) => {
                const newpath =
                    prop !== undefined
                        ? path.slice(1).concat(prop)
                        : path.slice(1)
                if (prop === undefined) console.log([newpath, value])
                mutations.push([newpath, value])
            }

            destiny[prop] = specialArray(
                new Proxy(tof_origin == 'array' ? [] : {}, {
                    set: (object, prop, value) => {
                        if (state.storing) {
                            addMutation(
                                isPlainObject(value) //&& isPlainObject(object[prop])
                                    ? TYPE.Replace(value)
                                    : value,
                                prop
                            )
                        }
                        object[prop] = value
                        return true
                    },
                    deleteProperty: (object, prop) => {
                        if (state.storing) {
                            addMutation(TYPE.Delete(), prop)
                        }
                        delete object[prop]
                        return true
                    },
                }),
                state,
                addMutation
            )

            return true
        } else {
            destiny[prop] = origin_value
            return false // we dont go deeper
        }
    })

    state.storing = true
    callback(draft.draft)
    state.storing = false

    const patch = createPatchFromMutations(mutations)
    return { patch, mutations }
}

function specialArray(array, state, addMutation) {
    if (isArray(array)) {
        function unshift(...args) {
            state.storing = false
            const output = Array.prototype.unshift.apply(array, args)
            addMutation(TYPE.Splice(0, 0, ...args))
            state.storing = true
            return output
        }

        Object.defineProperties(array, {
            unshift: { value: unshift },
        })
    }

    return array
}
