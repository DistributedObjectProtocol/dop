import { isPlainObject, isArray } from '../util/is'
import { setDeep } from '../util/set'
import forEachObject from '../util/forEachObject'
import merge from '../util/merge'

export default function applyPatchFactory(patchers) {
    return function applyPatch(target, patch) {
        const mutations = []
        const target_root = { '': target } // a trick to allow top level patches
        const patch_root = { '': patch } // a trick to allow top level patches
        const unpatch_root = { '': {} }

        forEachObject(
            patch_root,
            target_root,
            ({ origin, destiny, prop, path }) => {
                const origin_value = origin[prop]
                const destiny_value = destiny[prop]
                const had_prop = destiny.hasOwnProperty(prop)
                if (
                    !had_prop ||
                    (origin_value !== destiny_value &&
                        !(
                            isPlainObject(origin_value) &&
                            isPlainObject(destiny_value)
                        ))
                ) {
                    let oldValue = destiny_value

                    destiny[prop] = isPlainObject(origin_value) // immutable
                        ? applyPatch({}, origin_value).result
                        : isArray(origin_value)
                        ? merge([], origin_value) // Shall we merge arrays or just copy? Don't know
                        : origin_value

                    oldValue = patchers.reduce(
                        (oldValue, p) =>
                            p({
                                origin,
                                destiny,
                                prop,
                                path,
                                oldValue,
                                had_prop
                            }),
                        oldValue
                    )

                    setDeep(unpatch_root, path.slice(0), oldValue)
                    mutations.push({
                        oldValue,
                        object: destiny,
                        prop,
                        path: path.slice(1)
                    })

                    return false // we dont go deeper
                }
            }
        )

        return {
            result: target_root[''],
            unpatch: unpatch_root[''],
            mutations
        }
    }
}
