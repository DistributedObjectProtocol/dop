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
                    // This is where the merge with plain objects happen
                    destiny[prop] = isPlainObject(origin_value)
                        ? applyPatch({}, origin_value).result
                        : origin_value

                    // Applying patches
                    const oldValue = patchers.reduce(
                        (oldValue, p) =>
                            p({
                                origin,
                                destiny,
                                prop,
                                path,
                                oldValue,
                                had_prop
                            }),
                        destiny_value
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
