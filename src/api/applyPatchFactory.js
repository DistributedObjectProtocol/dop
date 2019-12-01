import { isPlainObject } from '../util/is'
import { getNewPlain } from '../util/get'
import { setDeep } from '../util/set'
import forEachObject from '../util/forEachObject'

export default function applyPatchFactory(patchFunction) {
    return function applyPatch(object, patch, filter) {
        if (!isPlainObject(object) || !isPlainObject(patch)) {
            throw 'applyPatch only accepts plain objects'
        }

        const mutations = []
        const unpatch = {}
        const has_filter = typeof filter === 'function'

        function addMutation({ value, prop, destiny, origin, path }) {
            const oldValue = patchFunction(value, prop, destiny, origin, path)
            setDeep(unpatch, path.slice(0), oldValue)
            mutations.push({
                object: destiny,
                prop,
                path: path.slice(0),
                oldValue
            })
        }

        forEachObject(
            patch,
            ({ origin, destiny, prop, path }) => {
                const origin_value = origin[prop]
                const destiny_value = destiny[prop]
                if (
                    !destiny.hasOwnProperty(prop) ||
                    (origin_value !== destiny_value &&
                        !(
                            isPlainObject(origin_value) &&
                            isPlainObject(destiny_value)
                        ))
                ) {
                    const value = getNewPlain(origin_value)
                    if (
                        !has_filter ||
                        filter({ value, prop, destiny, origin, path }) === true
                    )
                        addMutation({ value, prop, destiny, origin, path })

                    return false // if false we dont go deeper
                }
            },
            object
        )
        return { mutations, unpatch }
    }
}
